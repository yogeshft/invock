import mongoose from "mongoose";

import { config } from "../config";

export const connectToDatabase = async () => {
  await mongoose.connect(config.mongoUri);
  console.log("MongoDB connected");
};
