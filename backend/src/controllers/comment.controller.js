import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

// get all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Video not found");

  console.log(video);

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
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
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        likes: {
          $size: "$likes",
        },
      },
    },
    {
      $skip: (parseInt(page) - 1) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  console.log(comments);

  if (!comments) throw new ApiError(400, "Something went wrong");

  return res.status(200).json(new ApiResponse(200, comments));
});

// add a comment to a video
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Comment is required");

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Video not found");

  const newComment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id,
  });

  if (!newComment) throw new ApiError(400, "Something went wrong");

  return res.status(201).json(new ApiResponse(200, newComment));
});

// update a comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "Comment not found");

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedComment) throw new ApiError(400, "Something went wrong");

  return res.status(200).json(new ApiResponse(200, updatedComment));
});

// delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "Comment not found");

  await Comment.findByIdAndDelete(commentId);

  return res.status(200).json(new ApiResponse(200, {}, "Comment deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
