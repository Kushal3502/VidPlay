import axios from "axios";
import React, { useEffect, useState } from "react";
import TweetCard from "./TweetCard";

function Tweets({ userId }) {
  const [tweets, setTweets] = useState([]);

  const fetchTweets = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/tweets/user/${userId}`,
        { withCredentials: true }
      );
      console.log(response.data);
      setTweets(response.data.data);
    } catch (error) {
      console.log("Tweet fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div>
      {tweets && tweets.length > 0 ? (
        <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-3">
          {tweets.map((tweet) => (
            <div
              key={tweet._id}
              className=" rounded-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
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
