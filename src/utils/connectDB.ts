import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to DB");
  } catch (error) {
    console.log("Couldnt connect to DB: ", error);
  }
};

export default connectDB;
