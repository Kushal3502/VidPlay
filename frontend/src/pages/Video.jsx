import { Comment } from "@/components";
import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

function Video() {
  const [video, setVideo] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [user, setUser] = useState();
  const [comments, setComments] = useState([]);
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

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/comments/${videoId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data);
      setComments(response.data?.data);
    } catch (error) {
      console.log("Comment fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
    getCurrentUser();
    fetchComments();
  }, [videoId]);

  useEffect(() => {
    if (video && user && video.owner._id === user._id) {
      setIsOwner(true);
    }
  }, [video, user]);

  return (
    <div className=" lg:px-20 lg:py-8 sm:p-5 p-3">
      <div className="sm:w-full max-w-6xl">
        <div className="w-full sm:max-w-72 md:max-w-md lg:max-w-6xl rounded-lg overflow-hidden cursor-pointer">
          <ReactPlayer
            url={video?.videoFile}
            controls={true}
            width="100%"
            height="100%"
          />
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
                {/* <Button className=" bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base"> */}
                <AnimatedSubscribeButton
                  buttonColor="#000000"
                  buttonTextColor="#ffffff"
                  subscribeStatus={false}
                  initialText={
                    <span className="group inline-flex items-center">
                      Subscribe{" "}
                      <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  }
                  changeText={
                    <span className="group inline-flex items-center">
                      <CheckIcon className="mr-2 size-4" />
                      Subscribed{" "}
                    </span>
                  }
                />
                {/* </Button> */}
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
        <div>
          <h2 className="lg:text-xl sm:text-lg text-base">Comments</h2>
          <div className="grid w-full gap-2 my-4">
            <Textarea
              placeholder="Type your message here."
              className=" bg-transparent"
            />
            <Button className=" bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base">
              Add Comment
            </Button>
          </div>
          {comments && comments.length > 0 ? (
            <ul>
              {comments.map((comment) => (
                <div className="mb-6" key={comment?._id}>
                  <Comment comment={comment} />
                </div>
              ))}
            </ul>
          ) : (
            <h2>No comments!!!</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Video;
