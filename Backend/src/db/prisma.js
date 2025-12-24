import { PrismaClient } from '@prisma/clients';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';
dotenv.config();
const databaseUrl = process.env.DATABASE_URL ?? 'file:./database/transcendence.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
export const prisma = new PrismaClient({ adapter });
