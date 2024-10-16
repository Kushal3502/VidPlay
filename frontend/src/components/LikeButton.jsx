import { useToast } from "@/hooks/use-toast";
import { post } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { useSelector } from "react-redux";

function LikeButton({ video, tweet, comment }) {
  const [isLiked, setIsLiked] = useState(false);
  const user = useSelector((state) => state.auth);
  const { toast } = useToast();

  const likeStatus = async () => {
    if (video) {
      const idx = video.likes.findIndex(
        (like) => like.likedBy === user.userData._id
      );
      if (idx !== -1) {
        setIsLiked(true);
      }
    } else if (tweet) {
      const idx = tweet.likes.findIndex(
        (like) => like.likedBy === user?.userData._id
      );
      if (idx !== -1) {
        setIsLiked(true);
      }
    } else {
      const idx = comment.likes.findIndex(
        (like) => like.likedBy === user.userData._id
      );
      if (idx !== -1) {
        setIsLiked(true);
      }
    }
  };

  const toggleLike = async () => {
    let url;

    if (video) {
      url = `/likes/toggle/v/${video._id}`;
    } else if (tweet) {
      url = `/likes/toggle/t/${tweet._id}`;
    } else {
      url = `/likes/toggle/c/${comment._id}`;
    }

    const response = await post(url);
    console.log(response);

    if (isLiked) {
      toast({
        description: "🔴 Like removed",
        className:
          "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
      });
    } else {
      toast({
        description: "🟢 Liked!!!",
        className:
          "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
      });
    }

    setIsLiked((prevStatus) => !prevStatus);
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
