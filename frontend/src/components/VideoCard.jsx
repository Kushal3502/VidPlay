import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function VideoCard({ data }) {
  console.log(data);

  const { userData } = useSelector((state) => state.auth);

  return (
    <div className="border border-zinc-600 rounded-lg p-2">
      <Link to={`/video/${data._id}`}>
        <img src={data.thumbnail} className=" rounded-lg mb-2" />
        <div className="flex items-center justify-between px-2">
          <div className="flex items-start lg:gap-4 gap-2">
            <img
              src={data.owner.avatar || userData?.avatar}
              className=" lg:w-10 lg:h-10 sm:h-10 sm:w-10 w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="lg:text-lg">{data.title}</p>
              <p className="lg:text-lg text-gray-400">{data.owner.username}</p>
            </div>
          </div>
          <p className=" text-gray-400">{data.views} views</p>
        </div>
      </Link>
    </div>
  );
}

export default VideoCard;
