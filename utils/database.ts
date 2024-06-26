import mongoose from "mongoose";
import Trade from "@/models/trade";
import User from "@/models/user";
let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB,
    });
    isConnected = true;

    console.log("MongoDB connected");
  } catch (error) {}
};
