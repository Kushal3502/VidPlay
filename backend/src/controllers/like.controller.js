import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

// toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Video not found!!!");

  const isLiked = await Like.findOne({
    video: new mongoose.Types.ObjectId(videoId),
    likedBy: req.user?._id,
  });

  if (isLiked) {
    try {
      await Like.findOneAndDelete({
        video: new mongoose.Types.ObjectId(videoId),
        likedBy: req.user?._id,
      });

      return res.status(200).json(new ApiResponse(200, {}, "Like removed"));
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const newLike = await Like.create({
        video: videoId,
        likedBy: req.user?._id,
      });

      return res.status(201).json(new ApiResponse(200, newLike, "Video liked"));
    } catch (error) {
      console.log(error);
    }
  }
});

// toggle like on comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "Comment not found");

  const isLiked = await Like.findOne({
    comment: new mongoose.Types.ObjectId(commentId),
    likedBy: req.user?._id,
  });

  if (isLiked) {
    try {
      await Like.findOneAndDelete({
        comment: new mongoose.Types.ObjectId(commentId),
        likedBy: req.user?._id,
      });
      return res.status(200).json(new ApiResponse(200, {}, "Like removed"));
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const newLike = await Like.create({
        comment: commentId,
        likedBy: req.user?._id,
      });

      return res
        .status(201)
        .json(new ApiResponse(200, newLike, "Comment liked"));
    } catch (error) {
      console.log(error);
    }
  }
});

// toggle like on tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) throw new ApiError(404, "Tweet not found");

  const isLiked = await Like.findOne({
    tweet: new mongoose.Types.ObjectId(tweetId),
    likedBy: req.user?._id,
  });

  if (isLiked) {
    try {
      await Like.findOneAndDelete({
        tweet: new mongoose.Types.ObjectId(tweetId),
        likedBy: req.user?._id,
      });
      return res.status(200).json(new ApiResponse(200, {}, "Like removed"));
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const newLike = await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id,
      });

      return res.status(201).json(new ApiResponse(200, newLike, "Tweet liked"));
    } catch (error) {
      console.log(error);
    }
  }
});

// get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: req.user?._id,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $unwind: "$owner",
          },
          {
            $project: {
              title: 1,
              thumbnail: 1,
              videoFile: 1,
              description: 1,
              duration: 1,
              views: 1,
              "owner.username": 1,
              "owner.fullname": 1,
              "owner.avatar": 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$video",
    },
  ]);
  console.log(videos);
  return res.status(200).json(new ApiResponse(200, videos));
});

// get all liked tweets
const getLikedTweets = asyncHandler(async (req, res) => {
  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: req.user?._id,
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "tweet",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $unwind: "$owner",
          },
          {
            $project: {
              tweetImage: 1,
              content: 1,
              "owner.username": 1,
              "owner.fullname": 1,
              "owner.avatar": 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$tweet",
    },
  ]);
  console.log(videos);
  return res.status(200).json(new ApiResponse(200, videos));
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getLikedTweets,
};
