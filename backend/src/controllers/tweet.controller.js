import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// create tweet
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.toLowerCase().trim() === "")
    throw new ApiError(400, "Content is required!!!");

  const tweetImageLocalPath = req.file?.path;

  let newTweetImage;
  if (tweetImageLocalPath) {
    newTweetImage = await uploadOnCloudinary(tweetImageLocalPath);

    if (!newTweetImage) throw new ApiError(400, "Upload failed!!!");
  }

  const newTweet = await Tweet.create({
    owner: req.user?._id,
    content,
    tweetImage: newTweetImage.url || "",
  });

  if (!newTweet) throw new ApiError(400, "Something went wrong!!!");

  return res.status(201).json(new ApiResponse(200, newTweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
