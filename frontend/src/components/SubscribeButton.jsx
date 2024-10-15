import React, { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SubscribeButton({ authStatus, owner, subscribeStatus }) {
  const [status, setStatus] = useState(subscribeStatus);
  const navigate = useNavigate();
  console.log(status);
  const toggleSubscription = async () => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/v1/subscriptions/c/${owner}`,
        {},
        { withCredentials: true }
      );
      setStatus((prevStatus) => !prevStatus);
    } catch (error) {
      console.log("Subscription error :: ", error);
    }
  };

  return (
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
        ? status
          ? "Subscribed"
          : "Subscribe"
        : "Login to Subscribe"}
    </Button>
  );
}

export default SubscribeButton;
