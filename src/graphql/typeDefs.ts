import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  type Recipe {
    id: ID!
    user: ID!
    title: String!
    description: String!
    recipe: String!
    createdAt: DateTime!
  }

  type Query {
    getRecipe(id: ID!): Recipe!
    getRecipes: [Recipe!]!
    scrapeMarmitonRecipe(url: String!): ScrapedRecipe!
  }

  type Mutation {
    createRecipe(
      user: ID!
      title: String!
      description: String!
      recipe: String!
    ): Recipe!
    updateRecipe(
      id: ID!
      user: ID
      title: String
      description: String
      recipe: String
    ): Recipe!
    deleteRecipe(id: ID!): ID
  }

  type ScrapedRecipe {
    title: String!
    ingredients: [String!]!
    steps: [String!]!
    ustensiles: [String!]!
  }
`;

export default typeDefs;
