import { prisma } from "../src/db/prisma.js";
import * as bcrypt from "bcrypt";

async function main() {
  const password = "password123";
  const hashed = await bcrypt.hash(password, 10);

  for (let i = 1; i <= 10; i++) {
    const email = `test${i}@example.com`;
    const username = `testuser${i}`;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password_hash: hashed,
      },
    });

    console.log("Seeded user:", {
      id: user.id,
      email,
      username,
      password,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
