import jwt from 'jsonwebtoken';
import axios from 'axios';
import Recipe from "../models/recipeModels.js";
import { scrapeMarmiton } from '../script/scrapeMarmiton.js';
import User from '../models/userModels.js';

const createToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
    getUsers: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        throw new Error(error);
      }
    },
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
    authenticateFacebook: async (_, { accessToken }) => {
      try {
        const { data } = await axios.get(
          `https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=${accessToken}`
        );
        if (!data) {
          throw new Error('Failed to authenticate with Facebook.');
        }
        const { id, email, first_name, last_name } = data;
        let user = await User.findOne({ accountId: id });
        if (!user) {
          user = await User.create({
            accountId: id,
            username: `${first_name} ${last_name}`,
            email,
            name: `${first_name} ${last_name}`,
            provider: 'facebook',
          });
        }
        const token = createToken(user);
        return {
          token,
          user,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

export default resolvers;
