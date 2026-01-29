import { FriendRepo } from "../repositories/friend.repo.js";
import { ProfileRepo } from "../repositories/profile.repo.js";

export type ProfileView = {
  id: number;
  username: string;
  created_at: string;
  avatarId: number | null;
  avatarUrl: string | null;
  canSeePrivate: boolean;
  age: number | null;
  location: string | null;
};

export const ProfileIdService = {
  async getProfileForViewer(viewerId: number, targetId: number): Promise<ProfileView | null> {
    const user = await ProfileRepo.findByIdForProfile(targetId);
    if (!user) return null;

    const canSeePrivate =
      viewerId === targetId ? true : await FriendRepo.areFriends(viewerId, targetId);

    return {
      id: user.id,
      username: user.username,
      created_at: user.created_at.toISOString(),
      avatarId: user.avatarId ?? null,
      avatarUrl: user.avatar?.file_path ? `/static/${user.avatar.file_path}` : null,
      canSeePrivate,
      age: canSeePrivate ? (user.age ?? null) : null,
      location: canSeePrivate ? (user.location ?? null) : null,
    };
  },
};
