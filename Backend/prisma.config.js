import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config(); 

export default defineConfig({
  datasource: {
    db: {
      provider: "sqlite",
      url: process.env.DATABASE_URL || "file:./data/transcendence.db",
    }
  }
});
