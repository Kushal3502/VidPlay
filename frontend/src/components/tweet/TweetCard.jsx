import React from "react";
import { Link } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";

function TweetCard({ tweet }) {
  return (
    <div className="border border-zinc-800 hover:bg-zinc-800 rounded-lg p-2 h-full">
      <Link to={`/tweet/${tweet._id}`}>
        <div className=" flex items-center gap-2 mb-2">
          <img
            src={tweet.tweetAuthor?.avatar || tweet.owner?.avatar}
            className=" lg:w-10 lg:h-10 sm:h-10 sm:w-10 w-8 h-8 rounded-full object-cover"
          />
          <h1 className="lg:text-xl text-gray-400">
            {tweet.tweetAuthor?.username || tweet.owner?.username}
          </h1>
        </div>
        <p className="lg:text-lg mb-2">{tweet.content}</p>
        <AspectRatio ratio={16 / 9} className="rounded-lg mb-2 overflow-hidden">
          <img src={tweet.tweetImage} className="" />
        </AspectRatio>
      </Link>
    </div>
  );
}

export default TweetCard;
