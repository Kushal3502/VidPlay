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

// get all videos based on query, sort, pagination
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const matchConditions = {};

  if (userId) {
    matchConditions.owner = new mongoose.Types.ObjectId(userId);
  }

  if (query) {
    matchConditions.title = { $regex: query, $options: "i" };
  }

  const videos = await Video.aggregate([
    {
      $match: matchConditions,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $sort: {
        [sortBy]: sortType == "asc" ? 1 : -1,
      },
    },
    {
      $skip: (parseInt(page) - 1) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  return res.status(200).json(new ApiResponse(200, videos, "Results"));
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
    videoFile: videoFile.secure_url,
    thumbnail: thumbnail.secure_url,
    owner: req.user?._id,
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
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
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
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
        pipeline: [
          {
            $project: {
              likedBy: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $addFields: {
        // likes: {
        //   $size: "$likes",
        // },
        comments: {
          $size: "$comments",
        },
      },
    },
  ]);

  if (!video) throw new ApiError(404, "Video not found");

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video fetched..."));
});

// update video details like title, description, thumbnail
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Video not found!!!");

  const { title, description, views } = req.body;
  const thumbnailLocalPath = req.file?.path;

  let newThumbnail;

  // if new thumbnail uploaded
  if (thumbnailLocalPath) {
    newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!newThumbnail) throw new ApiError(400, "Upload failed!!!");

    // delete old image
    const parts = video.thumbnail.split("/");
    const thumbnailId = parts[parts.length - 1].split(".")[0];

    await deleteImageFromCloudinary(thumbnailId);
  }

  // update database
  const updatedVideoDetails = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: newThumbnail?.secure_url || video.thumbnail,
        views,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideoDetails, "Video details updated"));
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

// toggle publish state
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Video not found");

  video.isPublished = !video.isPublished;

  await video.save();

  return res.status(200).json(new ApiResponse(200, video, "Ok"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
