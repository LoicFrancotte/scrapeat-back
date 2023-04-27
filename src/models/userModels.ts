import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
  },
  //accountId can be google Id, facebook Id, apple Id etc.
  accountId: {
    type: String,
  },
  name: {
    type: String,
    trim: true,
  },
  photoURL: {
    type: String,
  },
  provider: {
    type: String,
  },
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);