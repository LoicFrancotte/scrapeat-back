import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import typeDefs from "../graphql/typeDefs.js";
import resolvers from "../graphql/resolvers.js";

interface MyContext {
  token?: String;
}

const createApolloServer = (httpServer: any) => {
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  return server;
};

export default createApolloServer;
