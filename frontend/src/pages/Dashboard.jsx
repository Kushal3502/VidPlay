import { VideoCard } from "@/components";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Dashboard() {
  const { userData } = useSelector((state) => state.auth);
  const [videos, setVideos] = useState([]);

  console.log(userData);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/dashboard/videos",
        { withCredentials: true }
      );
      console.log(response.data);
      setVideos(response.data.data);
    } catch (error) {
      console.log("Video fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="w-full">
        <img
          className="w-full h-60 object-cover"
          src={userData.coverImage}
          alt="CoverImage"
        />
        <div className="flex items-center space-x-4 mt-4 px-4">
          <img
            className="w-20 h-20 rounded-full object-cover"
            src={userData.avatar}
            alt="Avatar"
          />
          <div>
            <h1 className="text-xl font-bold">{userData.username}</h1>
            <p className="text-gray-600">{userData.fullname}</p>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="w-full flex justify-evenly h-32 items-center space-x-4 lg:text-3xl text-sm ">
        <div>
          <h2>Total videos</h2>
          <p className="text-center">{videos && videos.length}</p>
        </div>
        <Separator orientation="vertical" />
        <div>
          <h2>Total subscribers</h2>
          <p className="text-center">{videos && videos.length}</p>
        </div>
        <Separator orientation="vertical" />
        <div>
          <h2>Total views</h2>
          <p className="text-center">{videos && videos.length}</p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className=" p-4 sm:p-6 lg:p-4">
        <h2 className="lg:text-3xl text-sm mb-4">Popular videos</h2>
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
    </div>
  );
}

export default Dashboard;
