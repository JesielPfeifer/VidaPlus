import { PrismaClient } from '@prisma/client';

const DATABASE_URL =
    process.env.DATABASE_URL ||
    'postgresql://admin:root@localhost:5432/sghss?schema=vidaplus&connection_limit=5&socket_timeout=3';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        datasources: {
            db: {
                url: DATABASE_URL,
            },
        },
    });

export default prisma;
