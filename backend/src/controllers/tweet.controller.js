import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteImageFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

// create tweet
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.toLowerCase().trim() === "")
    throw new ApiError(400, "Content is required!!!");

  let tweetImage = "";

  const tweetImageLocalPath = req.file?.path;

  if (tweetImageLocalPath) {
    // If image is uploaded, upload to Cloudinary
    const uploadedImage = await uploadOnCloudinary(tweetImageLocalPath);

    if (!uploadedImage) {
      throw new ApiError(400, "Image upload failed!!!");
    }

    // Set tweetImage URL if upload succeeds
    tweetImage = uploadedImage.secure_url;
  }

  const newTweet = await Tweet.create({
    owner: req.user?._id,
    content,
    tweetImage,
  });

  if (!newTweet) throw new ApiError(400, "Something went wrong!!!");

  return res.status(201).json(new ApiResponse(200, newTweet));
});

// get all tweets
const getAllTweets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const tweets = await Tweet.aggregate([
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
      $sort: { createdAt: -1 }, // Sort by the latest tweets
    },
    {
      $skip: (page - 1) * limit, // Pagination: skip previous pages
    },
    {
      $limit: parseInt(limit), // Limit the number of results per page
    },
  ]);

  if (!tweets || tweets.length === 0)
    throw new ApiError(404, "No tweets found");

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

// get tweet by id
const getTweetById = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const tweet = await Tweet.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(tweetId),
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
        foreignField: "tweet",
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
        foreignField: "tweet",
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

  if (!tweet) throw new ApiError(404, "Tweet not found");

  return res
    .status(200)
    .json(new ApiResponse(200, tweet[0], "Tweet fetched..."));
});

// get user tweets
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User not found!!!");

  const userTweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "tweetAuthor",
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
      $unwind: "$tweetAuthor",
    },
  ]);

  if (userTweets && userTweets.length == 0)
    throw new ApiError(404, "No tweets found!!!");

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "Tweets fetched successfully..."));
});

// update tweet
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) throw new ApiError(404, "Tweet not found!!!");

  const { content } = req.body;

  const tweetImageLocalPath = req.file?.path;

  let newTweetImage;

  if (tweetImageLocalPath) {
    newTweetImage = await uploadOnCloudinary(tweetImageLocalPath);

    if (!newTweetImage) throw new ApiError(400, "Upload failed!!!");

    // delete old image
    const parts = tweet.tweetImage.split("/");
    const tweetImageId = parts[parts.length - 1].split(".")[0];

    await deleteImageFromCloudinary(tweetImageId);
  }

  // update database
  const updatedTweetDetails = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
        tweetImage: newTweetImage?.secure_url || tweet.tweetImage,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweetDetails, "Tweet updated"));
});

// delete tweet
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) throw new ApiError(404, "Tweet not found!!!");

  // extract image_id
  const tweet_parts = tweet.tweetImage.split("/");
  const tweetImageId = tweet_parts[tweet_parts.length - 1].split(".")[0];

  // delete from cloudinary
  await deleteImageFromCloudinary(tweetImageId);

  await Tweet.findByIdAndDelete(tweetId);

  return res.status(200).json(new ApiResponse(200, {}, "Tweet deleted..."));
});

export {
  createTweet,
  getAllTweets,
  getTweetById,
  getUserTweets,
  updateTweet,
  deleteTweet,
};
