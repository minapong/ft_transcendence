
import sqlite3 from "sqlite3"
import { User } from "../domain/user"

const db = new sqlite3.Database("database/transcendence.db")

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    username TEXT,
    passwordHash TEXT
  )
`)

export const UserRepo = {
  async create(data: {
    email: string
    username: string
    passwordHash: string
  }): Promise<User> {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (email, username, passwordHash) VALUES (?, ?, ?)",
        [data.email, data.username, data.passwordHash],
        function(err) {
          if (err) return reject(err)
          resolve({
            id: this.lastID,
            email: data.email,
            username: data.username,
            passwordHash: data.passwordHash
          })
        }
      )
    })
  },

  async findByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, row: any) => {
          if (err) return reject(err)
          if (!row) return resolve(null)
          resolve({
            id: row.id,
            email: row.email,
            username: row.username,
            passwordHash: row.password_hash
          })
        }
      )
    })
  }
}
