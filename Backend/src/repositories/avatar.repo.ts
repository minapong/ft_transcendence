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
};
