import { Router } from "express";
import {
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  updatePassword,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secure routes
router.route("/logout").post(validateJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/update-password").patch(validateJWT, updatePassword);

router.route("/user").get(validateJWT, getCurrentUser);

router
  .route("/update-account-details")
  .patch(validateJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(validateJWT, upload.single("avatar"), updateAvatar);

router
  .route("/cover-image")
  .patch(validateJWT, upload.single("coverImage"), updateCoverImage);

router.route("/channel/:username").get(getUserChannelProfile);

router.route("/watch-history").get(validateJWT, getWatchHistory);

export default router;
