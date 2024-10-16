import { get } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState();

  const fetchSubscriptions = async () => {
    const response = await get("/subscriptions/");
    console.log(response.data.followings);
    setSubscriptions(response.data.followings);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="p-4">
      <h2 className="lg:text-3xl mb-4">Subscriptions</h2>
      {subscriptions ? (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
          {subscriptions.map((item) => (
            <Link to={`/users/channel/${item.channelDetails.username}`}>
              <div
                key={item.channelDetails._id}
                className="border border-zinc-800 hover:bg-zinc-800 rounded-lg p-3 h-full flex items-center gap-4 transition-all duration-200 ease-in-out"
              >
                <img
                  src={item.channelDetails.avatar}
                  alt={item.channelDetails.username}
                  className="lg:w-12 lg:h-12 sm:w-10 sm:h-10 w-8 h-8 rounded-full object-cover"
                />
                <p className="text-sm lg:text-base font-medium">
                  {item.channelDetails.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#ffffff" />
        </div>
      )}
    </div>
  );
}

export default Subscriptions;
