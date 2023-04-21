import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import Recipe from "../models/recipeModels.js";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const createFakeRecipe = () => {
  return {
    user: new ObjectId(),
    title: faker.lorem.words(),
    description: faker.lorem.paragraph(),
    recipe: faker.lorem.paragraphs(),
  };
};

const seedDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const numberOfRecipes = 10; // Le nombre de recettes à générer

  for (let i = 0; i < numberOfRecipes; i++) {
    const fakeRecipe = createFakeRecipe();
    const newRecipe = new Recipe(fakeRecipe);
    await newRecipe.save();
  }

  console.log(`🌱 Inserted ${numberOfRecipes} fake recipes into the database.`);
  await mongoose.disconnect();
};

seedDatabase().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});