import React, { useEffect, useState } from "react";
import { Comment, LikeButton } from "@/components";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { Pencil, Trash2 } from "lucide-react";

function Video() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [subscribeStatus, setSubscribeStatus] = useState(false);
  const user = useSelector((state) => state.auth);
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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/videos/${videoId}`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.log("Video delete error :: ", error);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  return (
    <div className="w-full lg:max-w-7xl flex flex-col p-4 lg:px-8">
      {video ? (
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
                {/* Fix subscribe button */}
                <Button
                  onClick={() => {
                    if (user.status) {
                      toggleSubscription();
                    } else {
                      navigate("/auth/login");
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm lg:text-base px-2 sm:px-4 py-2 rounded-md"
                >
                  {subscribeStatus ? "Subscribed" : "Subscribe"}
                </Button>
                {user.status && user.userData._id === video?.owner?._id && (
                  <div className=" flex gap-2">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm lg:text-base px-2 sm:px-4 py-2 rounded-md">
                      <Link to={"/dashboard"}>View channel</Link>
                    </Button>
                    <Link to={`/edit/video/${videoId}`}>
                      <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm lg:text-base px-2 sm:px-4 py-2 rounded-md">
                        <Pencil />
                      </Button>
                    </Link>
                    <Button
                      className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-2 sm:px-4 py-2 rounded-md"
                      onClick={handleDelete}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center lg:gap-3 gap-2 text-center">
                {/* <div className="flex flex-col items-center text-center">
                  <IoMdEye className="lg:text-lg" />
                  <p>{video?.views} views</p>
                </div> */}
                <LikeButton video={video} />
              </div>
            </div>
          </div>
          <div>
            <Comment videoId={videoId} />
          </div>
        </div>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
}

export default Video;
