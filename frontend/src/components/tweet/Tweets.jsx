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
    <div className=" p-4 sm:p-6 lg:p-4">
      <h2 className="lg:text-3xl mb-4">Tweets</h2>
      {tweets && tweets.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {tweets.map((tweet) => (
            <div
              key={tweet._id}
              className=" rounded-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer border border-zinc-600 p-2"
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
