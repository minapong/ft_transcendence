import { UserRepo } from "../repositories/user.repo"
import crypto from "crypto"

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export const AuthService = {
    async login(email: string, password: string) {
    const user = await UserRepo.findByEmail(email)
    if (!user) {
      throw new Error("INVALID_CREDENTIALS")
    }

    const passwordHash = hashPassword(password)
    if (user.passwordHash !== passwordHash) {
      throw new Error("INVALID_CREDENTIALS")
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username
    }
  }
}
