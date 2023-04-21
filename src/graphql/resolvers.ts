import Recipe from "../models/recipeModels.js";

const resolvers = {
  Query: {
    getRecipe: async (_, { id }) => {
      try {
        const recipe = await Recipe.findById(id);
        return recipe;
      } catch (error) {
        throw new Error(error);
      }
    },
    getRecipes: async () => {
      try {
        const recipes = await Recipe.find();
        return recipes;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createRecipe: async (_, { user, title, description, recipe }) => {
      try {
        const newRecipe = new Recipe({ user, title, description, recipe });
        await newRecipe.save();
        return newRecipe;
      } catch (error) {
        throw new Error(error);
      }
    },
    updateRecipe: async (_, { id, user, title, description, recipe }) => {
      try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          id,
          { user, title, description, recipe },
          { new: true, omitUndefined: true }
        );
        if (!updatedRecipe) {
          throw new Error('Recipe not found');
        }
        return updatedRecipe;
      } catch (error) {
        throw new Error(error);
      }
    },
    deleteRecipe: async (_, { id }) => {
      try {
        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
          throw new Error('Recipe not found');
        }
        return id;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

export default resolvers;
