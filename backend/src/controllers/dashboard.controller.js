import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscriptions.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get the channel stats like total video views, total subscribers, total videos, total likes etc.
const getChannelStats = asyncHandler(async (req, res) => {
  const totalVideos = await Video.countDocuments({
    owner: new mongoose.Types.ObjectId(req.user?._id),
  });

  const totalSubscribers = await Subscription.countDocuments({
    channel: new mongoose.Types.ObjectId(req.user?._id),
  });

  const totalLikesViews = await Video.aggregate([
    {
      $match: {
        owner: req.user?._id,
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "liked",
      },
    },
    {
      $addFields: {
        likes: {
          $size: "$liked",
        },
      },
    },
    {
      $group: {
        _id: null,
        totalLikes: {
          $sum: "$likes",
        },
        totalViews: {
          $sum: "$views",
        },
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalSubscribers,
      totalLikes: totalLikesViews[0]?.totalLikes || 0,
      totalViews: totalLikesViews[0]?.totalViews || 0,
    })
  );
});

// Get all the videos uploaded by the channel
const getChannelVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({
    owner: new mongoose.Types.ObjectId(req.user?._id),
  });

  if (!videos || videos.length == 0)
    throw new ApiError(400, "No videos available!!!");

  return res.status(200).json(new ApiResponse(200, videos));
});

export { getChannelStats, getChannelVideos };
