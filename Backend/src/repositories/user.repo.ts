import { User } from "../domain/user"

let users: User[] = []
let nextId = 1

export const UserRepo = {
  async create(data: {
    email: string
    username: string
    passwordHash: string
  }): Promise<User> {
    const user: User = {
      id: nextId++,
      email: data.email,
      username: data.username,
      passwordHash: data.passwordHash
    }
    users.push(user)
    return user
  },

  async findByEmail(email: string): Promise<User | null> {
    return users.find(u => u.email === email) ?? null
  }
}
