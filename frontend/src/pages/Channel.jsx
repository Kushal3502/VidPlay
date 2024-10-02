import { Tweets, VideoCard } from "@/components";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Channel() {
  const { username } = useParams();
  const [channel, setChannel] = useState();
  const [videos, setVideos] = useState([]);
  const [subscribeStatus, setSubscribeStatus] = useState(false);

  const fetchChannel = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/users/channel/${username}`,
        { withCredentials: true }
      );
      console.log(response.data);
      setChannel(response.data.data);
      setSubscribeStatus(response.data.data.isSubscribed);
    } catch (error) {
      console.log("Channel fetch error :: ", error);
    }
  };

  const fetchVideos = async (userId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/videos?userId=${userId}`,
        { withCredentials: true }
      );
      console.log(response.data);
      setVideos(response.data.data);
    } catch (error) {
      console.log("Video fetch error :: ", error);
    }
  };

  const toggleSubscription = async () => {
    console.log("click");
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/subscriptions/c/${channel?._id}`,
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
    fetchChannel();
    console.log(subscribeStatus);
  }, [username, subscribeStatus]);

  useEffect(() => {
    if (channel?._id) {
      fetchVideos(channel._id);
    }
  }, [channel]);

  return (
    <div className="max-w-7xl mx-auto p-2">
      <div className="w-full">
        <img
          className="w-full lg:h-60 h-32 object-cover"
          src={channel?.coverImage}
          alt="CoverImage"
        />
        <div className="flex items-center justify-between space-x-4 mt-4 px-4">
          <div className="flex items-center gap-5">
            <img
              className="w-20 h-20 rounded-full object-cover"
              src={channel?.avatar}
              alt="Avatar"
            />
            <div>
              <h1 className="text-xl font-bold">{channel?.username}</h1>
              <div className="flex gap-2">
                <p className="text-gray-600">{channel?.fullname} |</p>
                <p className="text-gray-600">
                  {channel?.subscribersCount} subscribers
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={toggleSubscription}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base px-4 py-2 rounded-md"
          >
            {subscribeStatus ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      </div>
      <Separator className="my-4" />
      {channel && (
        <div>
          <div className=" p-4 sm:p-6 lg:p-4">
            <h2 className="lg:text-3xl mb-4">Popular videos</h2>
            {videos && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className=" rounded-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer "
                  >
                    <VideoCard data={video} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <Separator className="my-4" />
          <div>
            <Tweets userId={channel._id} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Channel;
