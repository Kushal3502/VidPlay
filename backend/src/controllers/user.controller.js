import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import fs from "fs";
import jwt from "jsonwebtoken";

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error!! Tokens are not created");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { username, email, fullname, password } = req.body;

  // console.log(email);

  // validate input fields
  if (
    [username, email, fullname, password].some((value) => value?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists
  const isUserExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  // check for images
  console.log(req.files);
  let avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  )
    coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (isUserExists) {
    if (avatarLocalPath) fs.unlinkSync(avatarLocalPath);
    if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath);
    throw new ApiError(409, "User already exists");
  }

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  // upload to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar upload failed!!!");

  // create user object
  const newUser = await User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  // remove password, refreshToken  from response
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  // check if the user is created
  if (!createdUser)
    throw new ApiError(500, "Something went wrong!!! User is not created");

  // return the response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully..."));
});

const loginUser = asyncHandler(async (req, res) => {
  // receive data from user
  const { username, email, password } = req.body;

  // check username or email
  if (!(username || email))
    throw new ApiError(400, "Username or Email is required");

  // find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  // console.log(user);

  if (!user) throw new ApiError(404, "User doesn't exist");

  // check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid)
    throw new ApiError(401, "Incorrect user credentials!!!");

  // generate access and refresh tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);

  const currentUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // console.log(currentUser);

  // send cookie
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: currentUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully..."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // retrieve the refresh token
  const refreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!refreshToken) throw new ApiError(401, "Unauthorized request!!!");

  try {
    // verify the token
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // get the user
    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "Unauthorized refresh token!!!");

    // generate new token
    const { newAccessToken, newRefreshToken } = await generateTokens(user._id);

    // reset cookies
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
          "Tokens refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  // get old and new password
  const { password, newPassword } = req.user;

  // find the user
  const user = await User.findById(req.user?._id);

  // verify old password
  if (!user.isPasswordCorrect(password))
    throw new ApiError(400, "Invalid password!!!");

  // set new password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully!!!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  // get updated details
  const { fullname, email } = req.body;

  if (!fullname || !email) throw new ApiError(400, "All fields are required");

  // find the user and returns the updated user details
  const updatedUserDetails = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullname, email } },
    { new: true }
  ).select("-password");

  // return updated details
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUserDetails, "User details updated!!!"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  // get file path
  const path = req.file?.path;

  if (!path) throw new ApiError(400, "Avatar is missing!!!");

  // upload new file
  const avatar = await uploadOnCloudinary(path);

  if (!avatar.url) throw new ApiError(400, "Upload failed");

  // todo : delete old image

  // update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password");

  // return
  return res
    .status(200)
    .json(new ApiError(200, updatedUser, "Avatar updated successfully."));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  // get file path
  const path = req.file?.path;

  if (!path) throw new ApiError(400, "Cover image is missing!!!");

  // upload new file
  const coverImage = await uploadOnCloudinary(path);

  if (!coverImage.url) throw new ApiError(400, "Upload failed");

  // todo : delete old image

  // update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  ).select("-password");

  // return
  return res
    .status(200)
    .json(new ApiError(200, updatedUser, "Cover image updated successfully."));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // get username
  const { username } = req.params;

  if (!username.trim()) throw new ApiError(400, "User not found");

  // find subscribers and followings
  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    // finds subscribers
    {
      $lookup: {
        from: "subscriptions",
        localField: _id,
        foreignField: "channel",
        as: "subscribers",
      },
    },
    // find followings
    {
      $lookup: {
        from: "subscriptions",
        localField: _id,
        foreignField: "subscriber",
        as: "following",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        followingsCount: {
          $size: "$following",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        email: 1,
        fullname: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        followingsCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) throw new ApiError(400, "Channel not found");

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "Channel fetched successfully..."));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
};
