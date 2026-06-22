import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaVersion: string | undefined;
};

const SCHEMA_VERSION = "v3";

function createPrismaClient() {
  const adapter = new PrismaMariaDb({
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "fastfood_delivery",
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
