import React from "react";
import { LikeButton } from "..";

function CommentCard({ comment }) {
  console.log(comment);
  return (
    <div className=" flex justify-between item-start border-b-[1px] border-b-gray-400 px-4 py-2">
      <div className=" flex justify-start item-center gap-3 ">
        <img
          src={comment.owner.avatar}
          className=" lg:w-10 lg:h-10 sm:h-8 sm:w-8 w-6 h-6 rounded-full object-cover"
        />
        <div className="flex flex-col items-start">
          <h2 className="lg:text-base sm:text-xl text-sm">
            {comment.owner.username}
          </h2>
          <p className="lg:text-lg sm:text-xl text-sm">{comment.content}</p>
        </div>
      </div>
      <LikeButton comment={comment} />
    </div>
  );
}

export default CommentCard;
