import { Tweets, Videos } from "@/components";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

function Channel() {
  const { username } = useParams();
  const [channel, setChannel] = useState();
  const [subscribeStatus, setSubscribeStatus] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

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

  return (
    <div className="max-w-7xl mx-auto lg:p-8 p-2">
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
            onClick={() => {
              if (authStatus) {
                toggleSubscription();
              } else {
                navigate("/auth/login");
              }
            }}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base px-4 py-2 rounded-md"
          >
            {authStatus
              ? subscribeStatus
                ? "Subscribed"
                : "Subscribe"
              : "Login to Subscribe"}
          </Button>
        </div>
      </div>
      <Separator className="my-4" />
      {channel && (
        <div>
          <div className="lg:px-6">
            <h2 className="lg:text-3xl mb-4">Popular videos</h2>
            <Videos userId={channel._id} />
          </div>
          <Separator className="my-4" />
          <div className="lg:px-6">
            <h2 className="lg:text-3xl mb-4">Tweets</h2>
            <Tweets userId={channel._id} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Channel;
