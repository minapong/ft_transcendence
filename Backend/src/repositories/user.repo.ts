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
      isAdmin: user.isAdmin,
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
      isAdmin: user.isAdmin,
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
      isAdmin: user.isAdmin,
    };
  },

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordHash: user.password_hash,
      isAdmin: user.isAdmin,
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
      isAdmin: user.isAdmin,
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
      isAdmin: u.isAdmin,
    }));
  },

  async findByEmailRaw(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, password_hash: true, isAdmin: true },
    });
  },

  async updateEmail(userId: number, email: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { email },
      select: { id: true, email: true, username: true, isAdmin: true },
    });
  },

  async updatePasswordHash(userId: number, password_hash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password_hash },
      select: { id: true },
    });
  },

  async updateBasics(id: number, patch: { age?: number | null; location?: string | null }) {
    const data: any = {};

    if (patch.age !== undefined) data.age = patch.age;         // allows null to clear
    if (patch.location !== undefined) data.location = patch.location;

    if (Object.keys(data).length === 0) {
      // nothing to update; return current user (or throw known error)
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, username: true, isAdmin: true, age: true, location: true },
      });
      if (!user) throw new Error("USER_NOT_FOUND");
      return user;
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, username: true, isAdmin: true, age: true, location: true },
    });

    return user;
  }

};
