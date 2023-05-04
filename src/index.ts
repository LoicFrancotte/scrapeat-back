import { expressMiddleware } from "@apollo/server/express4";
import http from "http";
import pkg from 'body-parser';
const { json } = pkg; 
import { Request, Response } from "express";
import express from "express";
import cors from "cors";

import configureDotenv from "./config/dotenv.js";
import connectDatabase from "./config/database.js";
import passport from "./config/passport.js";
import createApolloServer from "./config/apollo-server.js";
import session from "express-session";

configureDotenv();
connectDatabase();

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
const server = createApolloServer(httpServer);

await server.start();

app.use(
  "/graphql",
  cors(),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 3001 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:3001/graphql`);
