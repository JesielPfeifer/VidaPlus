import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from '../constants/envs.constant';

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
