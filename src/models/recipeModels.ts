import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  user: string;
  title: string;
  ingredients: string[];
  steps: string[];
  ustensiles: string[];
}

const recipeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  },
  ingredients: [
    {
      type: String,
      required: true
    }
  ],
  steps: [
    {
      type: String,
      required: true
    }
  ],
  ustensiles: [
    {
      type: String,
      required: true
    }
  ],
}, {
  timestamps: true,
});

export default mongoose.model<IRecipe>("Recipe", recipeSchema);
