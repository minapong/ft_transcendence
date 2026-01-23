import { prisma } from "../src/db/prisma.js";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  const password = "password123";
  const password_hash = hashPassword(password);

  for (let i = 1; i <= 10; i++) {
    const email = `test${i}@example.com`;
    const username = `testuser${i}`;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password_hash,
      },
    });

    console.log("Seeded user:", {
      id: user.id,
      email,
      username,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
