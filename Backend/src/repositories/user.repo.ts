import { prisma } from '../db/prisma.js';

export const UserRepo = {
  create: (data: { email: string; username: string; password_hash: string }) =>
    prisma.user.create({ data }),

  findById: (id: number) =>
    prisma.user.findUnique({ where: { id } }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  update: (id: number, patch: Partial<{ username: string; password_hash: string; avatarId: number | null }>) =>
    prisma.user.update({ where: { id }, data: patch }),

  list: (take = 50, skip = 0) =>
    prisma.user.findMany({ take, skip, orderBy: { created_at: 'desc' } })
};
