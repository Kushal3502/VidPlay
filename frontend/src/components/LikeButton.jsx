import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { useSelector } from "react-redux";

function LikeButton({ video, tweetId, commentId }) {
  const [isLiked, setIsLiked] = useState(false);
  const user = useSelector((state) => state.auth);

  let url;

  if (video) url = `http://127.0.0.1:8000/api/v1/likes/toggle/v/${video._id}`;
  else if (tweetId)
    url = `http://127.0.0.1:8000/api/v1/likes/toggle/t/${tweetId}`;
  else url = `http://127.0.0.1:8000/api/v1/likes/toggle/c/${commentId}`;

  const likeStatus = async () => {
    if (video) {
      const idx = video.likes.findIndex(
        (like) => like.likedBy === user.userData._id
      );
      if (idx !== -1) {
        setIsLiked(true);
      }
    }
  };

  const toggleLike = async () => {
    try {
      const response = await axios.post(url, {}, { withCredentials: true });
      console.log(response.data);
      setIsLiked((prevStatus) => !prevStatus);
    } catch (error) {
      console.log("Like failed:", error);
      setIsLiked((prevStatus) => !prevStatus);
    }
  };

  useEffect(() => {
    likeStatus();
  }, []);

  return (
    <div
      className="flex flex-col items-center text-center cursor-pointer"
      onClick={toggleLike}
    >
      {isLiked ? (
        <BiSolidLike className="text-2xl" />
      ) : (
        <BiLike className="text-2xl" />
      )}
    </div>
  );
}

export default LikeButton;
