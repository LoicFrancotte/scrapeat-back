import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose.connect(process.env.MONGO_URI!);

  mongoose.connection.on("error", (error: string) => {
    console.error(error);
  });

  mongoose.connection.once("open", () => {
    console.log("🌱 Connected to MongoDB");
  });
};

export default connectDatabase;
