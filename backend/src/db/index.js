import mongoose from "mongoose";
import chalk from "chalk";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      chalk.bgBlue.bold(
        `\nMongoDB connected!!! DB host: ${connectionInstance.connection.host}`
      )
    );
  } catch (error) {
    console.log(chalk.bgRed.bold("ERROR: ", error));
    process.exit(1);
  }
};

export default connectDB;
