import { Playlist, Tweets, Videos } from "@/components";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Dashboard() {
  const { userData } = useSelector((state) => state.auth);
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState();

  console.log(userData);

  // const fetchVideos = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://127.0.0.1:8000/api/v1/dashboard/videos",
  //       { withCredentials: true }
  //     );
  //     console.log(response.data);
  //     setVideos(response.data.data);
  //   } catch (error) {
  //     console.log("Video fetch error :: ", error);
  //   }
  // };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/dashboard/stats",
        { withCredentials: true }
      );
      console.log(response.data);
      setStats(response.data.data);
    } catch (error) {
      console.log("Video fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchStats();
    // fetchVideos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-2">
      <div className="w-full">
        <img
          className="w-full lg:h-60 h-32 object-cover"
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
      <div className="w-full flex justify-evenly lg:h-24 h-12 items-center space-x-4 lg:text-3xl ">
        <div>
          <h2 className="mb-2">Total videos</h2>
          <p className="text-center">{stats?.totalVideos}</p>
        </div>
        <Separator orientation="vertical" />
        <div>
          <h2 className="mb-2">Total subscribers</h2>
          <p className="text-center">{stats?.totalSubscribers}</p>
        </div>
        <Separator orientation="vertical" />
        <div>
          <h2 className="mb-2">Total views</h2>
          <p className="text-center">{stats?.totalViews}</p>
        </div>
      </div>
      <Separator className="my-4" />
      {userData && (
        <div>
          <div className="lg:px-6">
            <h2 className="lg:text-3xl mb-4">Popular videos</h2>
            <Videos userId={userData._id} />
          </div>
          <Separator className="my-4" />
          <div className="lg:px-6">
            <h2 className="lg:text-3xl mb-4">Tweets</h2>
            <Tweets userId={userData._id} />
          </div>
          <Separator className="my-4" />
          <div className="lg:px-6">
            <h2 className="lg:text-3xl mb-4">Playlists</h2>
            <Playlist userId={userData._id} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
