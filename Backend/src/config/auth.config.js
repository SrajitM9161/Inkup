import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../../prisma/prismaClient.js';

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      callbackURL: `${process.env.SERVER_BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: profile.displayName,
            email,
            accounts: {
              create: {
                provider: 'google',
                providerAccountId: profile.id,
                access_token: accessToken,
                refresh_token: refreshToken,
                 type: 'oauth'
              },
            },
          },
        });
      }

      return done(null, user);
    }
  )
);

export default passport;
