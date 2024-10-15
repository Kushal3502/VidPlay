import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className=" lg:p-8 md:p-6 p-4 h-full">
      <Outlet />
      <Toaster />
    </div>
  );
}

export default AuthLayout;
