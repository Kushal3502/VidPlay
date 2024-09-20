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

const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader
      .destroy(publicId)
      .catch((error) => console.log("Image deletion failed : ", error));

    console.log("Delete : ", result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

const deleteVideoFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader
      .destroy(publicId, { resource_type: "video" })
      .catch((error) => console.log("Image deletion failed : ", error));

    console.log("Delete : ", result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

const searchInCloudinary = async (videoId) => {
  try {
    const result = await cloudinary.search
      .expression(`public_id:${videoId}`)
      .execute()
      .catch((error) => console.log("Something went wrong : ", error));

    console.log("Search Result:", result.resources);
    return result;
  } catch (error) {
    console.error("Error searching for image:", error);
  }
};

export {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
  deleteVideoFromCloudinary,
  searchInCloudinary,
};
