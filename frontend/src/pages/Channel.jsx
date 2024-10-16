import { Playlist, Tweets, Videos } from "@/components";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { get, post } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { ScaleLoader } from "react-spinners";

function Channel() {
  const { username } = useParams();
  const authStatus = useSelector((state) => state.auth.status);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [channel, setChannel] = useState();
  const [subscribeStatus, setSubscribeStatus] = useState(false);

  const fetchChannel = async () => {
    const response = await get(`/users/channel/${username}`);
    console.log(response);
    console.log(response.data.isSubscribed);
    setChannel(response.data);
    setSubscribeStatus(response.data.isSubscribed);
  };

  const toggleSubscription = async () => {
    await post(`/subscriptions/c/${channel?._id}`);

    if (subscribeStatus) {
      toast({
        description: "🔴 Unsubscribed",
        className:
          "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
      });
    } else {
      toast({
        description: "🟢 Subscribed",
        className:
          "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
      });
    }

    setSubscribeStatus((prevStatus) => !prevStatus);
  };

  useEffect(() => {
    fetchChannel();
  }, [subscribeStatus]);

  return (
    <>
      {channel ? (
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
              <Separator className="my-4" />
              <div className="lg:px-6">
                <h2 className="lg:text-3xl mb-4">Playlists</h2>
                <Playlist userId={channel._id} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#ffffff" />
        </div>
      )}
    </>
  );
}

export default Channel;
