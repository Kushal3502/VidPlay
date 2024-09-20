import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

// get video, upload to cloudinary, create video
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description)
    throw new ApiError(400, "All fields are required!!!");

  // check for video and thumbnail
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath)
    throw new ApiError(400, "All fields are required!!!");

  // upload on cloudinary
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !thumbnail) throw new ApiError(400, "Upload failed!!!");

  const owner = await User.findById(req.user?._id);

  // create new object
  const newVideo = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner,
    title,
    description,
    duration: videoFile.duration,
  });

  if (!newVideo) throw new ApiError(400, "Something went wrong!!!");

  console.log(newVideo);

  return res
    .status(201)
    .json(new ApiResponse(200, newVideo, "Video uploaded..."));
});

// get video by id
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);

  return res.status(200).json(new ApiResponse(200, video, "Video fetched..."));
});

// update video details like title, description, thumbnail
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  const updatedDetails = await Video.findByIdAndUpdate(videoId, { $set: {} });
});

// delete video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const videoDetails = await Video.findById(videoId);

  const video_parts = videoDetails.videoFile.split("/");
  const video_publicId = video_parts[video_parts.length - 1].split(".")[0];

  const thumbnail_parts = videoDetails.thumbnail.split("/");
  const thumbnail_publicId =
    thumbnail_parts[thumbnail_parts.length - 1].split(".")[0];

  // delete from cloudinary
  await deleteVideoFromCloudinary(video_publicId);
  await deleteImageFromCloudinary(thumbnail_publicId);

  await Video.findByIdAndDelete(videoId);

  return res.status(200).json(new ApiResponse(200, {}, "Video deleted..."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
