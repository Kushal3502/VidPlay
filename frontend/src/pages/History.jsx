import { VideoCard } from "@/components";
import axios from "axios";
import React, { useEffect, useState } from "react";

function History() {
  const [videos, setVideos] = useState();

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/users/watch-history",
        { withCredentials: true }
      );
      setVideos(response.data.data);
    } catch (error) {
      console.log("History fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:px-12">
      <h2 className="lg:text-3xl mb-4">Watch History</h2>
      {videos && videos.length > 0 ? (
        <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-8">
          {videos.map((video) => (
            <div key={video._id} className="cursor-pointer">
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

export default History;
