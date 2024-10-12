import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

// create playlist
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description)
    throw new ApiError(400, "Name and description is required!!!");

  const newPlaylist = await Playlist.create({
    name,
    description,
    owner: req.user?._id,
  });

  if (!newPlaylist) throw new ApiError(400, "Something went wrong!!!");

  return res
    .status(201)
    .json(new ApiResponse(200, newPlaylist, "Playlist created..."));
});

// get user playlists
const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User not found!!!");

  const userPlaylists = await Playlist.find({
    owner: new mongoose.Types.ObjectId(userId),
  });

  if (!userPlaylists) throw new ApiError(400, "Something went wrong!!!");

  return res.status(200).json(new ApiResponse(200, userPlaylists));
});

// get playlist by id
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  // const playlist = await Playlist.findById(playlistId);
  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$owner",
          },
        ],
      },
    },
  ]);

  if (!playlist) throw new ApiError(404, "Playlist not found!!!");

  return res.status(200).json(new ApiResponse(200, playlist));
});

// add videos to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) throw new ApiError(404, "Playlist not found!!!");

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Video not found!!!");

  if (!playlist?.owner.equals(req.user?._id))
    throw new ApiError(401, "Unauthorized request!!!");

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!updatePlaylist) throw new ApiError(400, "Something went wrong!!!");

  return res
    .status(201)
    .json(new ApiResponse(200, updatedPlaylist, "Video added..."));
});

// remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) throw new ApiError(404, "Playlist not found!!!");

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Video not found!!!");

  if (!playlist?.owner.equals(req.user?._id))
    throw new ApiError(401, "Unauthorized request!!!");

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: { videos: videoId },
    },
    { new: true }
  );

  if (!updatePlaylist) throw new ApiError(400, "Something went wrong!!!");

  return res
    .status(201)
    .json(new ApiResponse(200, updatedPlaylist, "Video removed..."));
});

// delete playlist
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) throw new ApiError(404, "Playlist not found!!!");

  await Playlist.findByIdAndDelete(playlistId);

  return res.status(200).json(new ApiResponse(200, {}, "Playlist deleted..."));
});

// update playlist
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) throw new ApiError(404, "Playlist not found!!!");

  const updatedPlaylistDetails = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPlaylistDetails)
    throw new ApiError(400, "Something went wrong!!!");

  return res
    .status(201)
    .json(new ApiResponse(200, updatedPlaylistDetails, "Playlist updated..."));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
