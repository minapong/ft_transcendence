import { prisma } from "../db/prisma.js";

export const AvatarRepo = {
  async createForUser(params: {
    userId: number;
    filePath: string; // relative: uploads/uX/....
    isDefault?: boolean;
    }) {
      const row = await prisma.avatar.create({
        data: {
          user_id: params.userId,
          file_path: params.filePath,
          is_default: params.isDefault ?? false,
        },
        select: { id: true, file_path: true, user_id: true, is_default: true },
      });
      return row;
    },

    async getSelectedForUser(userId: number) {
      const u = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          avatarId: true,
          avatar: { select: { id: true, file_path: true, is_default: true, user_id: true } },
        },
      });
      return u?.avatar ?? null;
  },
};
