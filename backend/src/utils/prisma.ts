import "dotenv/config";
// ❌ Hapus baris ini: import { PrismaClient } from "@prisma/client";

// ✅ Ganti dengan ini:
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || "";

// Only initialize pool if connectionString is provided to prevent boot crashes
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
