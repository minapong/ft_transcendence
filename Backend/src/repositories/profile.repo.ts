import { prisma } from "../db/prisma.js";

export type ProfileRow = {
  id: number;
  username: string;
  created_at: Date;
  avatarId: number | null;
  avatar: { file_path: string } | null;
  age: number | null;
  location: string | null;
};

export const ProfileRepo = {
  async findByIdForProfile(userId: number): Promise<ProfileRow | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
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
