import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./components";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return (
    <div className=" h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
