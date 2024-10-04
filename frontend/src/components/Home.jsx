import axios from "axios";
import React, { useEffect, useState } from "react";
import { VideoCard } from ".";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

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
    <div className=" p-4 sm:p-6 lg:p-12">
      <Carousel className="">
        {videos && (
          <div className="">
            <CarouselContent>
              {videos.map((video) => (
                <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                  <div
                    key={video._id}
                    className=" rounded-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <VideoCard video={video} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:block bg-transparent border-none" />
            <CarouselNext className="hidden lg:block bg-transparent border-none" />
          </div>
        )}
      </Carousel>
    </div>
  );
}

export default Home;
