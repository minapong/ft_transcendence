import { prisma } from '../db/prisma.js';
import { User } from '../domain/user.js';

export const UserRepo = {
  async create(data: {
    email: string;
    username: string;
    password_hash: string;
  }): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password_hash: data.password_hash,
      },
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordHash: user.password_hash,
    };
  },

  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordHash: user.password_hash,
    };
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordHash: user.password_hash,
    };
  },

  async update(
    id: number,
    patch: Partial<{
      username: string;
      password_hash: string;
      avatarId: number | null;
    }>
  ): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: patch,
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordHash: user.password_hash,
    };
  },

  async list(take = 50, skip = 0): Promise<User[]> {
    const users = await prisma.user.findMany({
      take,
      skip,
      orderBy: { created_at: 'desc' },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      passwordHash: u.password_hash,
    }));
  },
};
