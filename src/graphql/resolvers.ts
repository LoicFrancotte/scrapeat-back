import Recipe from "../models/recipeModels.js";
import { scrapeMarmiton } from '../script/scrapeMarmiton.js';
import { UserInputError } from "apollo-server-errors";
import passport from "../auth/authFacebook.js";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

const loginUserWithFacebook = (req) =>
  new Promise<User>((resolve, reject) => {
    passport.authenticate("facebook", { scope: ["email"] }, (err, user) => {
      if (err) {
        reject(err);
      } else if (!user) {
        reject(new UserInputError("User not found"));
      } else {
        resolve(user as User);
      }
    })(req);
  });

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
    scrapeMarmitonRecipe: async (_, { url }) => {
      try {
        const scrapedRecipe = await scrapeMarmiton(url);
        return scrapedRecipe;
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
    loginWithFacebook: async (_, __, { req }) => {
      const user = await loginUserWithFacebook(req);
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      };
    },
  },
};

export default resolvers;
