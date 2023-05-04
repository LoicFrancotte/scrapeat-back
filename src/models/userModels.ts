import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  facebookId?: string;
  googleId?: string;
  username?: string;
  email?: string;
  accountId?: string;
  name?: string;
  provider?: string;
  recipes?: string[];
}

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

export default mongoose.model<IUser>("User", userSchema);
