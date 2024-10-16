import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { get } from "@/utils/api";
import { ScaleLoader } from "react-spinners";

function Videos({ userId, query }) {
  const [videos, setVideos] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchVideos = async () => {
    setLoader(true);
    const params = {};

    if (userId) params.userId = userId;
    if (query) params.query = query;

    const response = await get("/videos", params, false);
    console.log(response);
    setVideos(response.data);
    setLoader(false);
  };

  useEffect(() => {
    fetchVideos();
  }, [userId, query]);

  return (
    <div>
      {loader ? (
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#ffffff" />
        </div>
      ) : (
        <div className="">
          {videos && videos.length > 0 ? (
            <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-8">
              {videos.map((video) => (
                <div key={video._id} className=" cursor-pointer">
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          ) : (
            <p>No videos available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Videos;
