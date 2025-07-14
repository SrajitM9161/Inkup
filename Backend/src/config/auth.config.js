import Google from '@auth/core/providers/google';
import Apple from '@auth/core/providers/apple';
import Instagram from '@auth/core/providers/instagram';
import prisma from '../../prisma/prismaClient.js';
import { CustomAdapter } from '../utils/customPrismaAdapter.js';

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  adapter: CustomAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID,
      clientSecret: process.env.AUTH_APPLE_SECRET,
    }),
    Instagram({
      clientId: process.env.AUTH_INSTAGRAM_ID,
      clientSecret: process.env.AUTH_INSTAGRAM_SECRET,
    }),
    // Credentials({
    //   name: 'Credentials',
    //   credentials: {
    //     email: { label: 'Email', type: 'email' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials) {
    //     if (!credentials?.email || !credentials?.password) return null;

    //     const user = await prisma.user.findUnique({
    //       where: { email: credentials.email },
    //     });

    //     if (!user || !user.passwordHash) return null;

    //     const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
    //     if (!isValid) return null;

    //     return { id: user.id, email: user.email, role: user.role };
    //   },
    // }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60,
  },
  jwt: {
    maxAge: 15 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
        token.profileComplete = !!(user.phoneNumber && user.businessName);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.profileComplete = token.profileComplete;
      return session;
    },
  },
  
  debug: true,
};
