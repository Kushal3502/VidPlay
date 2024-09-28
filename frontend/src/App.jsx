import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);
  return (
    <div className=" h-full">
      <div><h1 className=" font-mono">VidPlay</h1></div>
      <Outlet />
    </div>
  );
}

export default App;
