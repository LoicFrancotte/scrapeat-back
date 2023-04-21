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
`;

export default typeDefs;