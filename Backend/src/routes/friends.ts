import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
import { FriendRepo } from "../repositories/friend.repo.js";
import { UserRepo } from "../repositories/user.repo.js";
import { sendToUsers } from "../presence/presence.store.js";

function getUserId(req: any): number {
  return Number(req.user.userId);
}

export async function registerFriendRoutes(app: FastifyInstance) {
  // Send friend request to :id
  app.post<{ Body: { username: string } }>(
    "/api/friends/request",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const me = getUserId(req);
      const { username } = req.body ?? {}

      if (!username || typeof username !== "string") {
          return reply.code(400).send({error: "Username is required"})
      }

      const target = await UserRepo.findByUsername(username);
      if (!target) {
        return reply.code(404).send({ error: "User not found" });
      }

      const other = target.id;

      if (other === me)
        return reply.code(400).send({ error: "Cannot friend yourself" });

      // block duplicates both directions (A->B or B->A)
      const a = await FriendRepo.exists(me, other);
      const b = await FriendRepo.exists(other, me);
      if (a || b) return reply.code(409).send({ error: "Friend relation already exists" });

      const row = await FriendRepo.request(me, other);
      
      //  notify target user in realtime
      sendToUsers(other, { 
        type: "friend_request",
        fromUserId: me,
        fromUsername: req.user.username,
       });

      return reply.code(201).send({ 
        ok: true, 
        request: {
          to: { id: target.id, username:target.username },
          status: row.status,
        } 
      });
    }
  );

  // Accept request from :id (requester)
  app.post<{ Params: { id: string } }>(
    "/api/friends/accept/:id",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const me = getUserId(req);
      const requester = Number(req.params.id);
      if (!Number.isFinite(requester)) return reply.code(400).send({ error: "Invalid id" });

      // requester->me must exist pending
      const row = await FriendRepo.accept(me, requester);

      // Optional: create reverse accepted row (so both users have "friend" in list)
      const reverse = await FriendRepo.exists(me, requester);
      if (!reverse) {
        await FriendRepo.request(me, requester);
        await FriendRepo.accept(requester, me).catch(() => {});
      } else {
        await FriendRepo.setStatus(me, requester, "accepted");
      }

      sendToUsers(requester, { type: "friend_request_accepted", byUserId: me });

      return reply.send({ ok: true, accepted: row });
    }
  );

  // Incoming requests for me
  app.get(
    "/api/friends/incoming",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const me = getUserId(req);
      const incoming = await FriendRepo.listIncoming(me);

      return reply.send({
        incoming: incoming.map(r => ({
          from: { id: r.user.id, username: r.user.username, avatarId: r.user.avatarId },
          status: r.status,
          created_at: r.created_at,
        })),
      });
    }
  );

  // My outgoing friends/requests
  app.get(
    "/api/friends",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const me = getUserId(req);
      const outgoing = await FriendRepo.listOutgoing(me);

      return reply.send({
        friends: outgoing.map(r => ({
          to: { id: r.friend.id, username: r.friend.username, avatarId: r.friend.avatarId },
          status: r.status,
          created_at: r.created_at,
        })),
      });
    }
  );

  // Remove/cancel (me -> :id)
  app.delete<{ Params: { id: string } }>(
    "/api/friends/:id",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const me = getUserId(req);
      const other = Number(req.params.id);
      if (!Number.isFinite(other)) return reply.code(400).send({ error: "Invalid id" });

      // try delete both directions (if you created reverse row)
      await FriendRepo.remove(me, other).catch(() => {});
      await FriendRepo.remove(other, me).catch(() => {});

      sendToUsers(other, { type: "friend_removed", byUserId: me });

      return reply.send({ ok: true });
    }
  );
}
