import moogoose from "mongoose";
import { app } from "./app";

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined!");
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined!");
    }

    await moogoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => console.log("Tickets service is running on 3000"));
};

start();
