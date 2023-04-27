import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/userModels.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "email", "picture.type(large)"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const existingUser = await User.findOne({ accountId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          accountId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          name: profile.displayName,
          provider: "facebook",
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
