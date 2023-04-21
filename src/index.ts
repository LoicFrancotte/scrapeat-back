import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

const PORT: number = Number(process.env.PORT);

mongoose.connect(process.env.MONGO_URI!);

mongoose.connection.on('error', (error: string) => {
  console.error(error);
});

mongoose.connection.once("open", () => {
  console.log("🌱 Connected to MongoDB");
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
});

console.log(`🚀 Server ready at: ${url}`);
