import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(validateJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getSubscribedChannels);
router.route("/c/:channelId").post(toggleSubscription);
router.route("/u/:subscriberId").get(getUserChannelSubscribers);

export default router;
