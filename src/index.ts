import path, { join } from "path";
import url from "url";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import http from "http";
import pkg from "body-parser";
const { json } = pkg;
import dotenv from "dotenv";
import { Strategy as FacebookStrategy, Profile as FacebookProfile, StrategyOption } from 'passport-facebook';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import { CorsRequest } from "cors";
import { Profile } from 'passport';
import { VerifyCallback } from 'passport-oauth2';

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

import User from "./models/userModels.js";

const PORT = process.env.PORT;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: join(__dirname, "../.env") });
} else {
  dotenv.config({ path: join(__dirname, "../.env.development") });
}

console.log(process.env.ENV, "env");

interface MyContext {
  token?: String;
}

const facebookOptions: StrategyOption = {
  clientID: process.env.FACEBOOK_APP_ID as string,
  clientSecret: process.env.FACEBOOK_APP_SECRET as string,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL as string,
  profileFields: ["id", "email", "first_name", "last_name"],
};

const facebookCallback = async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
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

passport.use(new FacebookStrategy(facebookOptions, facebookCallback));

//Google

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

mongoose.connect(process.env.MONGO_URI!);

mongoose.connection.on("error", (error: string) => {
  console.error(error);
});

mongoose.connection.once("open", () => {
  console.log("🌱 Connected to MongoDB");
});

const app = express();

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: process.env.FACEBOOK_SUCCESS_REDIRECT,
    failureRedirect: process.env.FACEBOOK_FAILURE_REDIRECT,
  })
);
//Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.GOOGLE_SUCCESS_REDIRECT,
    failureRedirect: process.env.GOOGLE_FAILURE_REDIRECT,
  })
);

const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 3001 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:3001/graphql`);