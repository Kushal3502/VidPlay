import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload the file from local server to cloudinary
    const response = await cloudinary.uploader
      .upload(localFilePath, { resource_type: "auto" })
      .catch((error) => {
        console.log("CLOUDINARY upload ERROR : ", error);
      });

    console.log("Cloudinary : ", response);

    // delete file from local server
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("CLOUDINARY upload ERROR : ", error);
    return null;
  }
};

export default uploadOnCloudinary;
