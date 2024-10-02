import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex items-start justify-center h-full mt-20">
      <Outlet />
    </div>
  );
}

export default Layout;
