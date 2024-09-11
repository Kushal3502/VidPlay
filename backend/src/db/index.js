import chalk from "chalk";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // console.log(connectionInstance.connection);
    console.log(
      chalk.bgBlue.bold(
        `MongoDB connected !!! DB host :: ${connectionInstance.connection.host}`
      )
    );
  } catch (error) {
    console.log(chalk.bgRed.bold("MongoDB connection FAILED :: ", error));
    process.exit(1);
  }
};

export default connectDB;
