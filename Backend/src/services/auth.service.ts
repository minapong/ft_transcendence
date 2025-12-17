import { UserRepo } from "../repositories/user.repo"
import crypto from "crypto"

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export const AuthService = {
  async signup(email: string, username: string, password: string) {
    const existing = await UserRepo.findByEmail(email)
    if (existing) {
      throw new Error("EMAIL_ALREADY_EXISTS")
    }

    const passwordHash = hashPassword(password)

    const user = await UserRepo.create({
      email,
      username,
      passwordHash
    })

    return {
      id: user.id,
      email: user.email,
      username: user.username
    }
  }
}
