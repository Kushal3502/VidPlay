import React from "react";
import { Videos } from ".";

function Home() {
  return (
    <div className="p-4 sm:p-6 lg:px-10">
      <h2 className="lg:text-3xl mb-4">Popular videos</h2>
      <Videos />
    </div>
  );
}

export default Home;
