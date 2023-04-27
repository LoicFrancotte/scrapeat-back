import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique : true,
  },
  email: {
    type: String,
    unique : true,
  },
  //accountId can be google Id, facebook Id, apple Id etc.
  accountId: {
    type: String,
  },
  name: {
    type: String,
  },
  provider: {
    type: String,
  },
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  }],
},
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);