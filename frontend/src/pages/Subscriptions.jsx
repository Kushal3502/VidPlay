import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState();

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/subscriptions/",
        { withCredentials: true }
      );
      console.log(response.data.data.followings);
      setSubscriptions(response.data.data.followings);
    } catch (error) {
      console.log("Subscription fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="p-4">
      <h2 className="lg:text-3xl mb-4">Subscriptions</h2>
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {subscriptions &&
          subscriptions.map((item) => (
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
    </div>
  );
}

export default Subscriptions;
