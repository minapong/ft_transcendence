import { UserRepo } from "../repositories/user.repo.js"
import crypto from "crypto"

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export const AuthService = {
  
    async signup(email: string, username: string, password: string) {
    const existing = await UserRepo.findByEmail(email);
    if (existing) throw new Error("EMAIL_ALREADY_EXISTS");

    const password_hash = hashPassword(password);

    const user = await UserRepo.create({
      email,
      username,
      password_hash, // IMPORTANT: match your DB/repo field name
    });

    return { id: user.id, email: user.email, username: user.username };
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

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    }
  }
}
