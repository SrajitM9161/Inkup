// prisma/client.js
import { PrismaClient } from '@prisma/client';
import { passwordHashingMiddleware } from '../../Backend/src/middlewares/passwordMiddleware.js';

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
prisma.$use(passwordHashingMiddleware);

export default prisma;
