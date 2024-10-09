import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import axios from "axios";

function Videos({ userId, query }) {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    let url;

    if (userId) url = `http://127.0.0.1:8000/api/v1/videos?userId=${userId}`;
    else if (query) url = `http://127.0.0.1:8000/api/v1/videos/?query=${query}`;
    else url = "http://127.0.0.1:8000/api/v1/videos";

    try {
      const response = await axios.get(url, { withCredentials: true });
      console.log(response.data);
      setVideos(response.data.data);
    } catch (error) {
      console.log("Video fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [userId, query]);

  return (
    <div className="">
      {videos && videos.length > 0 ? (
        <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-8">
          {videos.map((video) => (
            <div
              key={video._id}
              className=" transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      ) : (
        <p>No videos available</p>
      )}
    </div>
  );
}

export default Videos;
