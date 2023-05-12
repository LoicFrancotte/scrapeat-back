import jwt from "jsonwebtoken";
import axios from "axios";
import Recipe from "../models/recipeModels.js";
import { scrapeRecipe } from "../script/scrFinal.js";
import User from "../models/userModels.js";

export interface IUser {
  id: string;
  facebookId?: string;
  googleId?: string;
  username: string;
  email: string;
  accountId?: string;
  name: string;
  provider: string;
  recipes?: IRecipe[];
}

interface IRecipe {
  user: string;
  title: string;
  ingredients: string[];
  ustensiles: string[];
  steps: string[];
}

interface IRecipeInput {
  user: string;
  title: string;
  ingredients: string[];
  ustensiles: string[];
  steps: string[];
}

interface IFacebookAuthInput {
  accessToken: string;
}

interface IGoogleAuthInput {
  accessToken: string;
}

interface IScrapedRecipeInput {
  user: string;
  title: string;
  ingredients: string[];
  steps: string[];
  ustensiles: string[];
}

interface IScrapeRecipeInput {
  url: string;
}

const createToken = (user: IUser): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

const resolvers = {
  Query: {
    getUser: async (_: any, { id }: { id: string }) => {
      try {
        const user = await User.findById(id).populate({
          path: "recipes",
          match: { ingredients: { $ne: null } },
        });
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
    getUsers: async () => {
      try {
        const users = await User.find().populate('recipes') as IUser[];
        const filteredUsers = users.filter(user =>
          user.recipes?.every(recipe => recipe.title != null)
        );
        return filteredUsers;
      } catch (error) {
        throw new Error(error);
      }
    },
    getRecipe: async (_: any, { id }: { id: string }) => {
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
    createRecipe: async (_: any, { user, title, ingredients, ustensiles, steps }: IRecipeInput) => {
      try {
        const newRecipe = new Recipe({ user, title, ingredients, ustensiles, steps });
        await newRecipe.save();
        return newRecipe;
      } catch (error) {
        throw new Error(error);
      }
    },
    deleteRecipe: async (_: any, { id }: { id: string }) => {
      try {
        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
          throw new Error("Recipe not found");
        }
        return id;
      } catch (error) {
        throw new Error(error);
      }
    },
    authenticateFacebook: async (_: any, { accessToken }: IFacebookAuthInput) => {
      try {
        const { data } = await axios.get(
          `https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=${accessToken}`
        );
        if (!data) {
          throw new Error("Failed to authenticate with Facebook.");
        }
        const { id, email, first_name, last_name } = data;
        let user = await User.findOne({ facebookId: id });
        if (!user) {
          user = await User.create({
            facebookId: id,
            username: `${first_name} ${last_name}`,
            email,
            name: `${first_name} ${last_name}`,
            provider: "facebook",
          });
        }
        const token = createToken(user as unknown as IUser);
        return {
          token,
          user,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    authenticateGoogle: async (_:any, { accessToken }: IGoogleAuthInput) => {
      try {
        const { data } = await axios.get(
          `https://graph.google.com/me?fields=id,email,first_name,last_name&access_token=${accessToken}`
        );
        if (!data) {
          throw new Error("Failed to authenticate with Facebook.");
        }
        const { id, email, first_name, last_name } = data;
        let user = await User.findOne({ accountId: id });
        if (!user) {
          user = await User.create({
            accountId: id,
            username: `${first_name} ${last_name}`,
            email,
            name: `${first_name} ${last_name}`,
            provider: "google",
          });
        }
        const token = createToken(user as unknown as IUser);
        return {
          token,
          user,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    saveScrapedRecipe: async (_: any, { user, title, ingredients, ustensiles, steps }: IRecipeInput) => {
      try {
        const newRecipe = new Recipe({ user, title, ingredients, steps, ustensiles });
        await newRecipe.save();
        return newRecipe;
      } catch (error) {
        throw new Error(error);
      }
    },
    scrapeRecipe: async(_: any, { url }: IScrapeRecipeInput) => {
      try {
        const scrapedRecipe = await scrapeRecipe(url);
        return scrapedRecipe;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

export default resolvers;
