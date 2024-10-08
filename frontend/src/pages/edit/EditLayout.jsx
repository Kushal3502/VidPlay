import React from "react";
import { Outlet } from "react-router-dom";

function EditLayout() {
  return (
    <div className="flex items-start justify-center mt-20">
      <Outlet />
    </div>
  );
}

export default EditLayout;
