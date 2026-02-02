import { MeRepo } from "../repositories/me.repo.js";

export const MeService = {
  async getMe(userId: number) {
    if (!Number.isFinite(userId)) throw new Error("UNAUTHORIZED");

    const me = await MeRepo.findMeById(userId);
    if (!me) throw new Error("USER_NOT_FOUND");

    return {
      ...me,
      avatarUrl: me.avatar?.file_path ? `/static/${me.avatar.file_path}` : null,
    };
  },
};
