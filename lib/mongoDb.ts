import { CloudCog } from "lucide-react";
import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/Test";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable.");
}

// Global cache to prevent re-connections during hot reloads in development
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "Test",
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected");
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};
//console.log("abccccc")
const connection=connectDB()
export default connection;
