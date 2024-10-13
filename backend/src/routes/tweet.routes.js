import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getTweetById,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
// router.use(validateJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllTweets)
  .post(validateJWT, upload.single("tweetImage"), createTweet);
router.route("/user/:userId").get(getUserTweets);
router
  .route("/:tweetId")
  .get(getTweetById)
  .patch(validateJWT, upload.single("tweetImage"), updateTweet)
  .delete(validateJWT, deleteTweet);

export default router;
