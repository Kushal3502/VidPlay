import chalk from "chalk";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.on("error", (error) =>
      console.log(chalk.bgRed.bold("ERROR :: ", error))
    );
    app.listen(port, () => {
      console.log(chalk.bgBlue.bold(`🫦  Server is running on PORT :: ${port}`));
    });
  })
  .catch((error) =>
    console.log(chalk.bgRed.bold("MongoDB connection ERROR :: ", error))
  );
