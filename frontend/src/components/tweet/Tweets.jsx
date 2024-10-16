
import React, { useEffect, useState } from "react";
import TweetCard from "./TweetCard";
import { get } from "@/utils/api";

function Tweets({ userId }) {
  const [tweets, setTweets] = useState([]);

  const fetchTweets = async () => {
    const response = await get(`/tweets/user/${userId}`);
    console.log(response.data);
    setTweets(response.data);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div>
      {tweets && tweets.length > 0 ? (
        <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-3">
          {tweets.map((tweet) => (
            <div key={tweet._id} className=" rounded-lg cursor-pointer">
              <TweetCard tweet={tweet} />
            </div>
          ))}
        </div>
      ) : (
        <p>No tweets available</p>
      )}
    </div>
  );
}

export default Tweets;
