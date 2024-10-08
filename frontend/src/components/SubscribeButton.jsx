import React from "react";
import { Button } from "./ui/button";

function SubscribeButton() {
  return (
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
  );
}

export default SubscribeButton;
