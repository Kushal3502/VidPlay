import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import fs from "fs";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { username, email, fullname, password } = req.body;

  console.log(email);

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

  if (!avatar) throw new ApiError(400, "Avatar is required");

  // create user object
  const newUser = await User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  // remove password, refreshToken
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

export { registerUser };
