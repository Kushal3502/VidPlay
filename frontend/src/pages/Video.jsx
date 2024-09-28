import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Video() {
  const [video, setVideo] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [user, setUser] = useState();
  const { videoId } = useParams();

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/users/user",
        {
          withCredentials: true,
        }
      );
      setUser(response.data.data);
    } catch (error) {
      console.log("User fetch error :: ", error);
    }
  };

  const fetchVideoDetails = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/videos/${videoId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data);
      setVideo(response.data.data);
    } catch (error) {
      console.log("Video fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
    getCurrentUser();
  }, [videoId]);

  useEffect(() => {
    if (video && user && video.owner._id === user._id) {
      setIsOwner(true);
    }
  }, [video, user]);

  return (
    <div className=" lg:p-20 sm:p-5 p-3">
      <div className="sm:w-full max-w-6xl">
        <div className="w-full sm:max-w-72 md:max-w-md lg:max-w-6xl rounded-lg overflow-hidden">
          <img src={video?.thumbnail} />
        </div>
        <div>
          <div>
            <h1 className="lg:text-3xl sm:text-xl text-lg py-4">
              {video?.title}
            </h1>
            <div className=" flex justify-between items-center ">
              <div className=" flex justify-center items-center gap-4">
                <Link
                  to={`/users/channel/${video?.owner.username}`}
                  className="flex justify-center items-center gap-4"
                >
                  <img
                    src={video?.owner?.avatar}
                    className=" lg:w-12 lg:h-12 sm:h-10 sm:w-10 w-8 h-8 rounded-full"
                  />
                  <p className="lg:text-xl ">{video?.owner?.username}</p>
                </Link>
                <Button className=" bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base">
                  Subscribe
                </Button>
                {isOwner && (
                  <Link to={`/users/channel/${user.username}`}>
                    <Button className=" bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base">
                      View Channel
                    </Button>
                  </Link>
                )}
              </div>
              <div className=" pr-3 flex justify-center items-center gap-5">
                <p>{video?.likes} likes</p>
                <p>Save</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
