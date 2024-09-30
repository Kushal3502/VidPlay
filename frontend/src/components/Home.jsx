import axios from "axios";
import React, { useEffect, useState } from "react";
import { VideoCard } from ".";
import { useNavigate } from "react-router-dom";

function Home() {
  const [videos, setVideos] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/users/user",
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) setIsAuthorized(true);
    } catch (error) {
      navigate("/auth/login");
      console.log("Unauthorized :: ", error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/videos", {
        withCredentials: true,
      });
      console.log(response.data);
      setVideos(response.data.data);
    } catch (error) {
      console.log("Video fetch error :: ", error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchVideos();
    }
  }, [isAuthorized]);

  return (
    <div className=" p-4 sm:p-6 lg:p-8">
      {videos && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {videos.map((video) => (
            <div
              key={video._id}
              className=" rounded-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <VideoCard data={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
