import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import mongoose from "mongoose";
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import express from 'express';
import session from 'express-session';
import http from 'http';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import 'dotenv/config';
import { createServer } from "http";

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

import User from './models/userModels.js';

interface MyContext {
  token?: String;
}

const facebookOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3001/auth/facebook/callback',
  profileFields: ['id', 'email', 'first_name', 'last_name'],
};

const facebookCallback = async (accessToken, refreshToken, profile, done) => {
  const users = await User.find();
  const matchingUser = users.find(user => user.facebookId === profile.id);
  if (matchingUser) {
    done(null, matchingUser);
    return;
  }
  const newUser = await User.create({
    facebookId: profile.id,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails && profile.emails[0] && profile.emails[0].value,
  });
  done(null, newUser);
};

passport.use(new FacebookStrategy(facebookOptions, facebookCallback));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

mongoose.connect(process.env.MONGO_URI!);

mongoose.connection.on('error', (error: string) => {
  console.error(error);
});

mongoose.connection.once("open", () => {
  console.log("🌱 Connected to MongoDB");
});

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: 'http://localhost:3001/graphql',
  failureRedirect: 'http://localhost:3001/graphql',
}));

const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 3001 }, resolve));
console.log(`🚀 Server ready at http://localhost:3001/graphql`);
