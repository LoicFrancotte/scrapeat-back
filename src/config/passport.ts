import passport from "passport";
import { Strategy as FacebookStrategy, Profile as FacebookProfile, StrategyOption } from 'passport-facebook';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { VerifyCallback } from "passport-oauth2";
import { Profile } from 'passport';

import User from "../models/userModels.js";

import configureDotenv from "./dotenv.js";
configureDotenv();

const facebookOptions: StrategyOption = {
  clientID: process.env.FACEBOOK_APP_ID as string,
  clientSecret: process.env.FACEBOOK_APP_SECRET as string,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL as string,
  profileFields: ["id", "email", "first_name", "last_name"],
};

const facebookCallback = async (
  accessToken: string,
  refreshToken: string,
  profile: FacebookProfile,
  done: VerifyCallback
) => {
  const users = await User.find();
  const matchingUser = users.find((user) => user.facebookId === profile.id);
  if (matchingUser) {
    done(null, matchingUser);
    return;
  }
  const newUser = await User.create({
    facebookId: profile.id,
    firstName: profile.name?.givenName || "",
    lastName: profile.name?.familyName || "",
    email: profile.emails && profile.emails[0] && profile.emails[0].value,
  });
  done(null, newUser);
};

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
};

const googleCallback = async (
  accessToken: string,
  refreshToken: string,
  profile: GoogleProfile,
  done: VerifyCallback
) => {
  const users = await User.find();
  const matchingUser = users.find((user) => user.googleId === profile.id);
  if (matchingUser) {
    done(null, matchingUser);
    return;
  }
  const newUser = await User.create({
    googleId: profile.id,
    firstName: profile.name?.givenName || "",
    lastName: profile.name?.familyName || "",
    email: profile.emails && profile.emails[0] && profile.emails[0].value,
  });
  done(null, newUser);
};

passport.use(new FacebookStrategy(facebookOptions, facebookCallback));
passport.use(new GoogleStrategy(googleOptions, googleCallback));

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
