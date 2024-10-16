import { Playlist, Tweets, Videos } from "@/components";
import { Separator } from "@/components/ui/separator";
import { get } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";

function Dashboard() {
  const { userData } = useSelector((state) => state.auth);
  const [stats, setStats] = useState();

  console.log(userData);

  const fetchStats = async () => {
    const response = await get("/dashboard/stats");
    console.log(response);
    setStats(response.data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      {stats ? (
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
      ) : (
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#ffffff" />
        </div>
      )}
    </>
  );
}

export default Dashboard;
