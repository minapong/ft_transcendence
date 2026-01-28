import { prisma } from "../db/prisma.js";

type FriendStatus = "pending" | "accepted" | "blocked";

export const FriendRepo = {
  async request(userId: number, friendId: number) {
    return prisma.friend.create({
      data: {
        user_id: userId,
        friend_id: friendId,
        status: "pending",
      },
    });
  },

  async accept(me: number, requester: number) {
    // requester -> me (pending) becomes accepted
    return prisma.friend.update({
      where: {
        user_id_friend_id: { user_id: requester, friend_id: me },
      },
      data: { status: "accepted" },
    });
  },

  async setStatus(userId: number, friendId: number, status: FriendStatus) {
    return prisma.friend.update({
      where: { user_id_friend_id: { user_id: userId, friend_id: friendId } },
      data: { status },
    });
  },

  async remove(userId: number, friendId: number) {
    return prisma.friend.delete({
      where: { user_id_friend_id: { user_id: userId, friend_id: friendId } },
    });
  },

  async exists(userId: number, friendId: number) {
    return prisma.friend.findUnique({
      where: { user_id_friend_id: { user_id: userId, friend_id: friendId } },
    });
  },

  async find(userId: number, friendId: number) {
    return prisma.friend.findUnique({
      where: { user_id_friend_id: { user_id: userId, friend_id: friendId } },
    });
  },

  async listOutgoing(userId: number) {
    return prisma.friend.findMany({
      where: { user_id: userId },
      include: { friend: true },
      orderBy: { created_at: "desc" },
    });
  },

  async listIncoming(userId: number) {
    return prisma.friend.findMany({
      where: { friend_id: userId, status: "pending" },
      include: { user: true },
      orderBy: { created_at: "desc" },
    });
  },

   async areFriends(a: number, b: number): Promise<boolean> {
    const row = await prisma.friend.findFirst({
      where: {
        status: "accepted",
        OR: [
          { user_id: a, friend_id: b },
          { friend_id: b, user_id: a },
        ],
      },
      select: { id: true },
    });

    return !!row;
  },
};
