import { FriendRepo } from "../repositories/friend.repo.js";
import { UserRepo } from "../repositories/user.repo.js";
import { sendToUsers } from "../presence/presence.store.js";

import { unwrap } from "../lib/input/unwrap.js";
import { vUsername } from "../lib/input/validators.js";

export const FriendsService = {
  async requestFriend(me: number, usernameRaw: unknown, meUsername: unknown) {
    if (!Number.isFinite(me)) throw new Error("UNAUTHORIZED");

    if (usernameRaw == null) throw new Error("USERNAME_REQUIRED");

    // Validate exactly like frontend (trim/normalize + allowlist rules)
    // This also rejects weird chars / too short / too long, etc.
    let username: string;
    try {
      username = unwrap(vUsername(usernameRaw));
    } catch {
      // Route already maps USERNAME_REQUIRED -> "Username is required"
      // it is used for any invalid username input.
      throw new Error("USERNAME_REQUIRED");
    }

    const target = await UserRepo.findByUsername(username);
    if (!target) throw new Error("USER_NOT_FOUND");

    const other = target.id;
    if (other === me) throw new Error("CANNOT_FRIEND_SELF");

    // block duplicates both directions (A->B or B->A)
    const ab = await FriendRepo.find(me, other);
    const ba = await FriendRepo.find(other, me);

    if (ab) {
      if (ab.status === "pending") throw new Error("ALREADY_SENT");
      if (ab.status === "accepted") throw new Error("ALREADY_FRIENDS");
      throw new Error("RELATION_EXISTS");
    }

    if (ba) {
      if (ba.status === "pending") throw new Error("THEY_ALREADY_SENT");
      if (ba.status === "accepted") throw new Error("ALREADY_FRIENDS");
      throw new Error("RELATION_EXISTS");
    }

    const row = await FriendRepo.request(me, other);

    sendToUsers(other, {
      type: "friend_request",
      fromUserId: me,
      fromUsername: typeof meUsername === "string" ? meUsername : undefined,
    });

    return {
      to: { id: target.id, username: target.username },
      status: row.status,
    };
  },

  async acceptFriend(me: number, requesterRaw: unknown) {
    if (!Number.isFinite(me)) throw new Error("UNAUTHORIZED");

    const requester = Number(requesterRaw);
    if (!Number.isFinite(requester)) throw new Error("INVALID_ID");

    let row: any;
    try {
      // requester -> me (pending) becomes accepted
      row = await FriendRepo.accept(me, requester);
    } catch {
      throw new Error("NO_PENDING_REQUEST");
    }

    //create reverse accepted row (so both users have "friend" in list)
    const reverse = await FriendRepo.exists(me, requester);
    if (!reverse) {
      await FriendRepo.request(me, requester);
      await FriendRepo.accept(requester, me).catch(() => {});
    } else {
      await FriendRepo.setStatus(me, requester, "accepted");
    }

    return row;
  },

  async listIncoming(me: number) {
    if (!Number.isFinite(me)) throw new Error("UNAUTHORIZED");

    const incoming = await FriendRepo.listIncoming(me);
    return incoming.map((r) => ({
      from: { id: r.user.id, username: r.user.username, avatarId: r.user.avatarId },
      status: r.status,
      created_at: r.created_at,
    }));
  },

  async listOutgoing(me: number) {
    if (!Number.isFinite(me)) throw new Error("UNAUTHORIZED");

    const outgoing = await FriendRepo.listOutgoing(me);
    return outgoing.map((r) => ({
      to: { id: r.friend.id, username: r.friend.username, avatarId: r.friend.avatarId },
      status: r.status,
      created_at: r.created_at,
    }));
  },

  async removeFriend(me: number, otherRaw: unknown) {
    if (!Number.isFinite(me)) throw new Error("UNAUTHORIZED");

    const other = Number(otherRaw);
    if (!Number.isFinite(other)) throw new Error("INVALID_ID");

    // try delete both directions (if you created reverse row)
    await FriendRepo.remove(me, other).catch(() => {});
    await FriendRepo.remove(other, me).catch(() => {});

    return true;
  },
};
