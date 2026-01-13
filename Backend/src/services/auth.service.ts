import { UserRepo } from "../repositories/user.repo.js"
import crypto from "crypto"
import bcrypt from "bcrypt"

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export const AuthService = {
    async login(email: string, password: string) {
    const user = await UserRepo.findByEmail(email)
    if (!user) {
      console.error("INVALID_Email:", email);
      throw new Error("INVALID_CREDENTIALS")
    }

    const passwordHash = hashPassword(password)
    const isValid = await bcrypt.compare(password, user.passwordHash)
      if (!isValid) {
    console.error("INVALID_Password:", password, "hashed:",user.passwordHash );
    throw new Error("INVALID_CREDENTIALS")
  }
// 
    // if (user.passwordHash !== passwordHash) {
    //   console.error("INVALID_Password:", password, "hashed:",user.passwordHash );
    //   throw new Error("INVALID_CREDENTIALS")
    // }

    return {
      id: user.id,
      email: user.email,
      username: user.username
    }
  }
}
