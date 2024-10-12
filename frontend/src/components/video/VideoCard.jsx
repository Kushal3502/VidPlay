import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function VideoCard({ video }) {
  const [duration, setDuration] = useState();

  function calculateDuration() {
    const now = new Date();
    const targetTime = new Date(video.createdAt);

    const durationInMilliseconds = now - targetTime;

    const durationInSeconds = Math.floor(durationInMilliseconds / 1000);

    const seconds = durationInSeconds % 60;
    const minutes = Math.floor(durationInSeconds / 60) % 60;
    const hours = Math.floor(durationInSeconds / 3600) % 24;
    const days = Math.floor(durationInSeconds / (3600 * 24));
    const months = Math.floor(durationInSeconds / (3600 * 24 * 30));

    if (months > 0) setDuration(`${months} months`);
    else if (days > 0) {
      setDuration(`${days} days`);
    } else if (hours > 0) {
      setDuration(`${hours} hours`);
    } else if (minutes > 0) {
      setDuration(`${minutes} minutes`);
    } else {
      setDuration(`${seconds} seconds`);
    }
  }

  useEffect(() => {
    calculateDuration();
  }, []);

  return (
    <div className="border border-zinc-600 rounded-lg p-2 h-full flex flex-col">
      <Link to={`/video/${video?._id}`}>
        <img src={video?.thumbnail} className=" rounded-lg mb-2 " />
        <div className="flex items-between justify-start px-2 lg:gap-4 gap-2">
          {/* <div className="flex items-start lg:gap-4 gap-2"> */}
          <img
            src={video?.owner.avatar}
            className=" lg:w-10 lg:h-10 sm:h-10 sm:w-10 w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="">{video?.title}</p>
            <p className=" text-gray-400">{video?.owner.username}</p>
          </div>
          {/* </div> */}
        </div>
        <div className=" flex justify-start gap-4 lg:pl-16 pl-12">
          <p className=" text-gray-400">{video?.views} views</p>
          <p className=" text-gray-400">{duration && duration} ago</p>
        </div>
      </Link>
    </div>
  );
}

export default VideoCard;
