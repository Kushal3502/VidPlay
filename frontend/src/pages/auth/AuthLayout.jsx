import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className=" lg:p-8 md:p-6 p-4 h-full">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
