import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// router.use(validateJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(validateJWT, createPlaylist);

router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(validateJWT, updatePlaylist)
  .delete(validateJWT, deletePlaylist);

router
  .route("/add/:videoId/:playlistId")
  .patch(validateJWT, addVideoToPlaylist);
router
  .route("/remove/:videoId/:playlistId")
  .patch(validateJWT, removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);

export default router;
