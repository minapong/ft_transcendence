import { prisma } from '../db/prisma.js';
export const UserRepo = {
    create: (data) => prisma.user.create({ data }),
    findById: (id) => prisma.user.findUnique({ where: { id } }),
    findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
    update: (id, patch) => prisma.user.update({ where: { id }, data: patch }),
    list: (take = 50, skip = 0) => prisma.user.findMany({ take, skip, orderBy: { created_at: 'desc' } })
};
