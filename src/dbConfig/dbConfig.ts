import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  try {
    if (isConnected || mongoose.connection.readyState === 1) return;
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }

    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    // Never terminate the Node process during build/runtime.
    console.log("MongoDB connection error. Please make sure MongoDB is running.", error);
    throw error;
  }
}