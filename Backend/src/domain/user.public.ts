import type { User } from "./user.js";

export type PublicUser = {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
};

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    isAdmin: user.isAdmin,
  };
}
