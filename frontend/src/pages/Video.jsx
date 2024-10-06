import React, { useEffect, useState } from "react";
import { Comment } from "@/components";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BiLike } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";

function Video() {
  const { videoId } = useParams();
  const [video, setVideo] = useState();
  const [channel, setChannel] = useState();
  const [subscribeStatus, setSubscribeStatus] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

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

  const fetchChannel = async (username) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/users/channel/${username}`,
        { withCredentials: true }
      );
      console.log(response.data);
      console.log(response.data.data.isSubscribed);
      setChannel(response.data.data);
      setSubscribeStatus(response.data.data.isSubscribed);
    } catch (error) {
      console.log("Channel fetch error :: ", error);
    }
  };

  const toggleSubscription = async () => {
    console.log("click");
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/subscriptions/c/${video?.owner._id}`,
        {},
        { withCredentials: true }
      );
      console.log(response.data);
      setSubscribeStatus((prevStatus) => !prevStatus);
    } catch (error) {
      console.log("Subscription error :: ", error);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);
  
  useEffect(() => {
    if (video?.owner?.username) {
      fetchChannel(video.owner.username);
    }
  }, [video]);

  return (
    <div className="w-full lg:max-w-5xl flex flex-col p-4 lg:px-8">
      <div>
        <div className="rounded-lg overflow-hidden">
          <ReactPlayer
            url={video?.videoFile}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
        <div className="w-full p-4">
          <h1 className="lg:text-3xl sm:text-xl text-lg lg:mb-4 mb-2">
            {video?.title}
          </h1>
          <div className="w-full flex flex-row justify-between items-center gap-4 lg:gap-0">
            <div className="flex items-center gap-4">
              <Link
                to={`/users/channel/${video?.owner.username}`}
                className="flex items-center gap-4"
              >
                <img
                  src={video?.owner?.avatar}
                  className="lg:w-12 lg:h-12 sm:h-10 sm:w-10 w-8 h-8 rounded-full object-cover"
                  alt="Avatar"
                />
                <p className="lg:text-xl text-lg font-medium">
                  {video?.owner?.username}
                </p>
              </Link>
              <Button
                onClick={() => {
                  if (authStatus) {
                    toggleSubscription();
                  } else {
                    navigate("/auth/login");
                  }
                }}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm lg:text-base px-2 sm:px-4 py-2 rounded-md"
              >
                {subscribeStatus ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
            <div className="flex items-center lg:gap-3 gap-2 text-center">
              <div className="flex flex-col items-center text-center">
                <IoMdEye className="lg:text-lg" />
                <p className="">{video?.views} views</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <BiLike className="lg:text-lg" />
                <p className="">{video?.likes} likes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Comment videoId={videoId} />
      </div>
    </div>
  );
}

export default Video;
