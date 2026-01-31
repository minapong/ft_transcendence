import { UserRepo } from "../repositories/user.repo.js"
import { toPublicUser } from "../domain/user.public.js"
import { prisma } from "../db/prisma.js";
import crypto from "crypto"

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export const AuthService = {
  
    async signup(email: string, username: string, password: string) {
    const existingEmail = await UserRepo.findByEmail(email);
    if (existingEmail) throw new Error("EMAIL_ALREADY_EXISTS");

    const existingUsername = await UserRepo.findByUsername(username);
    if (existingUsername) throw new Error("USERNAME_ALREADY_EXISTS");

    const password_hash = hashPassword(password);

    const user = await UserRepo.create({
      email,
      username,
      password_hash,
    });

    const defaults = await prisma.avatar.findMany({
      where: { is_default: true },
      select: { id: true },
    });

    if (defaults.length > 0) {
      const pick = defaults[Math.floor(Math.random() * defaults.length)];
      await UserRepo.update(user.id, { avatarId: pick.id });
    }
    return toPublicUser(user);
  },

    async login(email: string, password: string) {
    const user = await UserRepo.findByEmail(email);
    if (!user) {
      console.error("INVALID_Email:", email);
      throw new Error("INVALID_CREDENTIALS")
    }

    const incoming_hash = hashPassword(password);
    if (user.passwordHash !== incoming_hash) {
      throw new Error("INVALID_CREDENTIALS");
    }
    //  return toPublicUser(await UserRepo.findById(user.id)!);
    return toPublicUser(user);
  }
}
