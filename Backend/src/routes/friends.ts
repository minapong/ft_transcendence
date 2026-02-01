import { FastifyInstance } from "fastify";
import { requireAuth } from "../plugins/auth.guard.js";
import { FriendsService } from "../services/friends.service.js";

function getUserId(req: any): number {
  return Number(req.user.userId);
}

export async function registerFriendRoutes(app: FastifyInstance) {
  // Send friend request to username
  app.post<{ Body: { username: string } }>(
    "/api/friends/request",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const me = getUserId(req);
      const username = req.body?.username;

      try {
        const request = await FriendsService.requestFriend(me, username, req.user?.username);

        return reply.code(201).send({
          ok: true,
          request: {
            to: request.to,
            status: request.status,
          },
        });
      } catch (e: any) {
        const msg = String(e?.message ?? "");

        if (msg === "USERNAME_REQUIRED") {
          return reply.code(200).send({ ok: false, error: "Username is required" });
        }
        if (msg === "USER_NOT_FOUND") {
          return reply.code(200).send({ ok: false, error: "User not found" });
        }
        if (msg === "CANNOT_FRIEND_SELF") {
          return reply.code(200).send({ ok: false, error: "Cannot friend yourself" });
        }
        if (msg === "ALREADY_SENT") {
          return reply.code(200).send({ ok: false, error: "Friend request already sent" });
        }
        if (msg === "THEY_ALREADY_SENT") {
          return reply.code(200).send({
            ok: false,
            error: "This user already sent you a friend request",
          });
        }
        if (msg === "ALREADY_FRIENDS") {
          return reply.code(200).send({ ok: false, error: "You are already friends" });
        }

        return reply.code(200).send({ ok: false, error: "Server error" });
      }
    }
  );

  // Accept request from :id (requester)
  app.post<{ Params: { id: string } }>(
    "/api/friends/accept/:id",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const me = getUserId(req);

      try {
        const accepted = await FriendsService.acceptFriend(me, req.params?.id);
        return reply.send({ ok: true, accepted });
      } catch (e: any) {
        const msg = String(e?.message ?? "");

        if (msg === "INVALID_ID") {
          return reply.code(200).send({ ok: false, error: "Invalid id" });
        }
        if (msg === "NO_PENDING_REQUEST") {
          return reply.code(200).send({ ok: false, error: "No pending request from this user" });
        }

        return reply.code(200).send({ ok: false, error: "Server error" });
      }
    }
  );

  // Incoming requests for me
  app.get(
    "/api/friends/incoming",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const me = getUserId(req);

      try {
        const incoming = await FriendsService.listIncoming(me);
        return reply.send({ incoming });
      } catch {
        return reply.code(200).send({ incoming: [] });
      }
    }
  );

  // My outgoing friends/requests
  app.get(
    "/api/friends",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const me = getUserId(req);

      try {
        const friends = await FriendsService.listOutgoing(me);
        return reply.send({ friends });
      } catch {
        return reply.code(200).send({ friends: [] });
      }
    }
  );

  // Remove/cancel (me -> :id)
  app.delete<{ Params: { id: string } }>(
    "/api/friends/:id",
    { preHandler: requireAuth },
    async (req: any, reply) => {
      const me = getUserId(req);

      try {
        await FriendsService.removeFriend(me, req.params?.id);
        return reply.send({ ok: true });
      } catch (e: any) {
        const msg = String(e?.message ?? "");
        if (msg === "INVALID_ID") {
          return reply.code(200).send({ ok: false, error: "Invalid id" });
        }
        return reply.code(200).send({ ok: false, error: "Server error" });
      }
    }
  );
}
