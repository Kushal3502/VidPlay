import React from "react";
import { Link } from "react-router-dom";

function TweetCard({ tweet }) {
  return (
    <div className="border border-zinc-600 rounded-lg p-2">
      <Link>
        <div className=" flex items-center gap-2 mb-2">
          <img
            src={tweet.tweetAuthor.avatar}
            className=" lg:w-10 lg:h-10 sm:h-10 sm:w-10 w-8 h-8 rounded-full object-cover"
          />
          <h1 className="lg:text-xl text-gray-400">
            {tweet.tweetAuthor.username}
          </h1>
        </div>
        <p className="lg:text-lg mb-2">{tweet.content}</p>
        <img src={tweet.tweetImage} className=" rounded-lg mb-2 " />
      </Link>
    </div>
  );
}

export default TweetCard;
