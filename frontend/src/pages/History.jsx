import { VideoCard } from "@/components";
import { get } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";

function History() {
  const [videos, setVideos] = useState();

  const fetchHistory = async () => {
    const response = await get("/users/watch-history");
    setVideos(response.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:px-12">
      <h2 className="lg:text-3xl mb-4">Watch History</h2>
      {videos ? (
        <>
          {videos.length > 0 ? (
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
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#ffffff" />
        </div>
      )}
    </div>
  );
}

export default History;
