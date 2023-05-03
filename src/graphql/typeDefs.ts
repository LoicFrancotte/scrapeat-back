import gql from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    email: String!
    name: String!
  }

  type Recipe {
    id: ID!
    user: ID!
    title: String!
    ingredients: [String!]!
    ustensiles: [String!]!
    steps: [String!]!
    createdAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type ScrapedRecipe {
    title: String!
    ingredients: [String!]!
    steps: [String!]!
    ustensiles: [String!]!
  }

  type Query {
    getUser(id: ID!): User!
    getUsers: [User!]!
    getRecipe(id: ID!): Recipe!
    getRecipes: [Recipe!]!
  }

  type Mutation {
    saveScrapedRecipe(
      user: ID!
      title: String!
      ingredients: [String!]!
      steps: [String!]!
      ustensiles: [String!]!
    ): Recipe!
    createRecipe(
      user: ID!
      title: String!
      ingredients: [String!]!
      ustensiles: [String!]!
      steps: [String!]!
    ): Recipe!
    deleteRecipe(id: ID!): ID
    authenticateFacebook(accessToken: String!): AuthPayload!
    authenticateGoogle(accessToken: String!): AuthPayload!
    scrapeRecipe(url: String!): ScrapedRecipe!
  }
`;

export default typeDefs;
