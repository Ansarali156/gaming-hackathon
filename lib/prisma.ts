import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const getExtendedPrismaClient = (baseClient: PrismaClient) => {
  return baseClient.$extends(withAccelerate());
};

type ExtendedPrismaClient = ReturnType<typeof getExtendedPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
  prismaBase: PrismaClient | undefined;
};

export const prismaBase = globalForPrisma.prismaBase ?? new PrismaClient();
export const prisma = globalForPrisma.prisma ?? getExtendedPrismaClient(prismaBase);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaBase = prismaBase;
}