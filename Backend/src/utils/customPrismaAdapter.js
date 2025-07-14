import { PrismaAdapter } from '@auth/prisma-adapter';

export const CustomAdapter = (prisma) => {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    async createUser(data) {
      return await prisma.user.create({
        data: {
          ...data,
          businessName: null,
          phoneNumber: null,
          passwordHash: null,
        },
      });
    },
  };
};
