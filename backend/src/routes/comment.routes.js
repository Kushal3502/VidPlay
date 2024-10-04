import { Router } from "express";
import {
  addComment,
  addTweetComment,
  deleteComment,
  getTweetComments,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// router.use(validateJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/video/:videoId").get(getVideoComments).post(validateJWT, addComment);
router
  .route("/tweet/:tweetId")
  .get(getTweetComments)
  .post(validateJWT, addTweetComment);
router
  .use(validateJWT)
  .route("/c/:commentId")
  .delete(deleteComment)
  .patch(updateComment);

export default router;
