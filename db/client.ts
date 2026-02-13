import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString: dbUrl });

export const prisma = new PrismaClient({ adapter });