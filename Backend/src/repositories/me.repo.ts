import { prisma } from "../db/prisma.js";

export const MeRepo = {
  async findMeById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        created_at: true,
        avatarId: true,
        avatar: { select: { file_path: true } },
        age: true,
        location: true,
      },
    });
  },
};
