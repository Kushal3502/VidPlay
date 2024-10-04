import React from 'react'
import { Link } from 'react-router-dom'

function VideoCard({video}) {
  return (
    <div className="border border-zinc-600 rounded-lg p-2">
      <Link to={`/video/${video?._id}`}>
        <img src={video?.thumbnail} className=" rounded-lg mb-2 " />
        <div className="flex items-center justify-between px-2">
          <div className="flex items-start lg:gap-4 gap-2">
            <img
              src={video?.owner.avatar}
              className=" lg:w-10 lg:h-10 sm:h-10 sm:w-10 w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="lg:text-lg">{video?.title}</p>
              <p className="lg:text-lg text-gray-400">{video?.owner.username}</p>
            </div>
          </div>
          <p className=" text-gray-400">{video?.views} views</p>
        </div>
      </Link>
    </div>
  )
}

export default VideoCard