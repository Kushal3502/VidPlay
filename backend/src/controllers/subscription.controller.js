import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscriptions.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channel = await User.findById(channelId);

  if (!channel) throw new ApiError(404, "Channel not found!!!");

  const isSubscribed = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  console.log(isSubscribed);

  if (isSubscribed) {
    try {
      await Subscription.findByIdAndDelete(isSubscribed._id);

      return res
        .status(200)
        .json(new ApiResponse(200, { message: "Unsubscribed" }));
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      await Subscription.create({
        subscriber: req.user?._id,
        channel: channelId,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, { message: "Subscribed" }));
    } catch (error) {
      console.log(error);
    }
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  const channel = await User.findById(subscriberId);

  if (!channel) throw new ApiError(404, "Channel not found!!!");

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscribers",
        pipeline: [
          {
            $project: {
              avatar: 1,
              fullname: 1,
              username: 1,
            },
          },
        ],
      },
    },
  ]);

  const subscriberDetails = {
    subscribers: subscribers || [],
    count: subscribers.length,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriberDetails,
        "Subscribers fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const channelId = req.user?._id;

  const user = await User.findById(channelId);

  if (!user) throw new ApiError(404, "User not found!!!");

  const followings = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
        pipeline: [
          {
            $project: {
              avatar: 1,
              fullname: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$channelDetails",
    },
  ]);

  const followingsDetails = {
    followings: followings || [],
    count: followings.length,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, followingsDetails, "Followings fetched successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
