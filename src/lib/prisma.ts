import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaVersion: string | undefined;
};

const SCHEMA_VERSION = "v3";

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres@localhost:5432/fastfood_delivery",
  });
  return new PrismaClient({ adapter });
}

function getPrisma() {
  if (globalForPrisma.prisma && globalForPrisma.prismaVersion === SCHEMA_VERSION) {
    return globalForPrisma.prisma;
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaVersion = SCHEMA_VERSION;
  }
  return client;
}

export const prisma = getPrisma();
