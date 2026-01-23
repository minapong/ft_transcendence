import { prisma } from "../src/db/prisma.js";
import * as bcrypt from "bcrypt";

async function main() {
  const email = "test@example.com";
  const username = "testuser";
  const password = "password123";

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password_hash: hashed,
    },
  });

  console.log("Seeded user:", {
    email,
    username,
    password,
    id: user.id,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
