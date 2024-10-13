import { TweetCard, VideoCard } from "@/components";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Likes() {
  const { userData } = useSelector((state) => state.auth);
  const [videos, setVideos] = useState();
  const [tweets, setTweets] = useState();

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/likes/videos",
        { withCredentials: true }
      );
      setVideos(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.log("Video fetch error :: ", error);
    }
  };

  const fetchTweets = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/likes/tweets",
        { withCredentials: true }
      );
      setTweets(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.log("Tweet fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchTweets();
  }, []);

  return (
    <>
      {userData && (
        <div className="max-w-7xl mx-auto p-2">
          <div className="lg:px-6">
            <h2 className="lg:text-3xl mb-4">Liked videos</h2>
            {videos && videos.length > 0 ? (
              <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-8">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className="cursor-pointer"
                  >
                    <VideoCard video={video.video} />
                  </div>
                ))}
              </div>
            ) : (
              <p>No videos available</p>
            )}
          </div>
          <Separator className="my-4" />
          <div className="lg:px-6">
            <h2 className="lg:text-3xl mb-4">Liked tweets</h2>
            {tweets && tweets.length > 0 ? (
              <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-8">
                {tweets.map((tweet) => (
                  <div
                    key={tweet._id}
                    className="cursor-pointer"
                  >
                    <TweetCard tweet={tweet.tweet} />
                  </div>
                ))}
              </div>
            ) : (
              <p>No tweet available</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Likes;
