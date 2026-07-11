import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/app/generated/prisma/client';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("CRITICAL_CONFIG_ERROR: DATABASE_URL is missing from environment variables.");
  }

  // 1. Establish a standard PostgreSQL client pool connection
  const pool = new Pool({ connectionString });

  // 2. Wrap it inside the required Prisma v7 Driver Adapter
  const adapter = new PrismaPg(pool);

  // 3. Inject the adapter directly into your client instance
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.ENVIRONMENT !== 'production') globalThis.prismaGlobal = db;