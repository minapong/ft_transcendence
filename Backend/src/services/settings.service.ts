import crypto from "crypto";
import { UserRepo } from "../repositories/user.repo.js";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function isValidEmail(email: string) {
  // simple sanity check (enough for project)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const SettingsService = {
  async changeEmail(userId: number, newEmail: string, currentPassword: string) {
    if (!Number.isFinite(userId)) throw new Error("UNAUTHORIZED");

    const email = (newEmail ?? "").trim().toLowerCase();
    if (!email) throw new Error("EMAIL_REQUIRED");
    if (!isValidEmail(email)) throw new Error("EMAIL_INVALID");

    const me = await UserRepo.findById(userId);
    if (!me) throw new Error("USER_NOT_FOUND");

    // verify password (need password_hash -> fetch raw)
    const meRaw = await UserRepo.findByEmailRaw(me.email);
    if (!meRaw) throw new Error("USER_NOT_FOUND");

    const incoming = hashPassword(currentPassword ?? "");
    if (incoming !== meRaw.password_hash) throw new Error("INVALID_PASSWORD");

    // check email not used by another user
    const existing = await UserRepo.findByEmail(email);
    if (existing && existing.id !== userId) throw new Error("EMAIL_ALREADY_EXISTS");

    const updated = await UserRepo.updateEmail(userId, email);
    return updated;
  },

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    if (!Number.isFinite(userId)) throw new Error("UNAUTHORIZED");

    const cur = currentPassword ?? "";
    const next = newPassword ?? "";

    if (next.length < 8) throw new Error("PASSWORD_TOO_SHORT");
    if (next === cur) throw new Error("PASSWORD_SAME");

    // fetch user + hash to verify
    const me = await UserRepo.findById(userId);
    if (!me) throw new Error("USER_NOT_FOUND");

    const meRaw = await UserRepo.findByEmailRaw(me.email);
    if (!meRaw) throw new Error("USER_NOT_FOUND");

    const incoming = hashPassword(cur);
    if (incoming !== meRaw.password_hash) throw new Error("INVALID_PASSWORD");

    const nextHash = hashPassword(next);
    await UserRepo.updatePasswordHash(userId, nextHash);

    return { ok: true };
  },
};
