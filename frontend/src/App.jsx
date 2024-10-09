import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./components";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return (
    <div className=" h-screen">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
