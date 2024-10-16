import { TweetCard, VideoCard } from "@/components";
import { Separator } from "@/components/ui/separator";
import { get } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";

function Likes() {
  const { userData } = useSelector((state) => state.auth);
  const [videos, setVideos] = useState();
  const [tweets, setTweets] = useState();
  const [loader, setLoader] = useState(false);

  const fetchLikes = async () => {
    setLoader(true);

    const likedVideos = await get("/likes/videos");
    setVideos(likedVideos.data);
    console.log(likedVideos);

    const likedTweets = await get("/likes/tweets");
    setTweets(likedTweets.data);
    console.log(likedTweets);

    setLoader(false);
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  return (
    <>
      {loader ? (
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#ffffff" />
        </div>
      ) : (
        <div>
          {userData && (
            <div className="max-w-7xl mx-auto p-2">
              <div className="lg:px-6">
                <h2 className="lg:text-3xl mb-4">Liked videos</h2>
                {videos && videos.length > 0 ? (
                  <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-8">
                    {videos.map((video) => (
                      <div key={video._id} className="cursor-pointer">
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
                      <div key={tweet._id} className="cursor-pointer">
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
        </div>
      )}
    </>
  );
}

export default Likes;
