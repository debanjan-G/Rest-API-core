import passport from "passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Missing required Google OAuth credentials");
  process.exit(1);
}

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id); // saving only user.id as session
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile.emails?.[0]?.value,
            profilePicture: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Google Strategy error:", err);
        return done(err, null);
      }
    }
  )
);
