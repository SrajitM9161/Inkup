import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../../prisma/prismaClient.js";

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      callbackURL: `${process.env.SERVER_BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("Google account has no email associated"), null);
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName || "",
              email,
              accounts: {
                create: {
                  provider: "google",
                  providerAccountId: profile.id,
                  access_token: accessToken,
                  refresh_token: refreshToken,
                  type: "oauth",
                },
              },
            },
          });
        }
        return done(null, user);
      } catch (err) {
        console.error("Google Auth Error:", err);
        return done(err, null);
      }
    }
  )
);

export default passport;