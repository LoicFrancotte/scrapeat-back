import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    accountId: {
      type: String,
    },
    name: {
      type: String,
    },
    provider: {
      type: String,
    },
    recipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
