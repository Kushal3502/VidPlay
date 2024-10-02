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
        tweetImage: newTweetImage?.url || tweet.tweetImage,
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

export { createTweet, getUserTweets, updateTweet, deleteTweet };
