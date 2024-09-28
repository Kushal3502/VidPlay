import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);
  return (
    <div>
      <div>Navbar</div>
      <Outlet />
    </div>
  );
}

export default App;
