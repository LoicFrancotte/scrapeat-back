import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import Recipe, { IRecipe } from "../models/recipeModels.js";
import User, { IUser } from "../models/userModels.js";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Clear the database
const clearDatabase = async () => {
  await Recipe.deleteMany({});
  await User.deleteMany({});
};

const createFakeUser = (): Partial<IUser> => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    name: faker.name.fullName(),
    provider: "faker",
  };
};

const createFakeRecipe = (user: IUser): Partial<IRecipe> => {
  return {
    user: user._id,
    title: faker.lorem.words(),
    ingredients: Array.from({ length: 5 }, () => faker.lorem.word()),
    steps: Array.from({ length: 5 }, () => faker.lorem.sentence()),
    ustensiles: Array.from({ length: 3 }, () => faker.lorem.word()),
  };
};

const seedDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  await clearDatabase();
  console.log('🌱 Database cleared');

  const numberOfUsers = 250;
  const numberOfRecipesPerUser = 4;

  for (let i = 0; i < numberOfUsers; i++) {
    const fakeUser = createFakeUser();
    const newUser = new User(fakeUser);
    await newUser.save();

    for (let j = 0; j < numberOfRecipesPerUser; j++) {
      const fakeRecipe = createFakeRecipe(newUser);
      const newRecipe = new Recipe(fakeRecipe);
      await newRecipe.save();

      newUser.recipes?.push(newRecipe._id);
    }

    await newUser.save();
  }

  console.log(`🌱 Inserted fake recipes into the database.`);
  await mongoose.disconnect();
};

seedDatabase().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
