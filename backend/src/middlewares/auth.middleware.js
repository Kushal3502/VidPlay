import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const validateJWT = asyncHandler(async (req, res, next) => {
  try {
    // get the user tokens --> cookies for web and header for mobile devices
    const token =
      (await req.cookies?.accessToken) ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);

    if (!token) throw new ApiError(401, "Unauthorized request");

    // verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log(decodedToken);

    // find the user
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(401, "Unauthorized request");

    // set a new object
    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});

export { validateJWT };
