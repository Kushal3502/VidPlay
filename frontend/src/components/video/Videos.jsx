import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

function Videos({ userId }) {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    let url;

    if (userId) url = `http://127.0.0.1:8000/api/v1/videos?userId=${userId}`;
    else url = "http://127.0.0.1:8000/api/v1/videos";

    try {
      const response = await axios.get(url, { withCredentials: true });
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
    <div className="">
      <h2 className="lg:text-3xl mb-4">Popular videos</h2>
      <Carousel>
        {videos && videos.length > 0 ? (
          <div>
            <CarouselContent>
              {videos.map((video) => (
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div
                    key={video._id}
                    className=" transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <VideoCard video={video} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:block bg-transparent border-none" />
            <CarouselNext className="hidden lg:block bg-transparent border-none" />
          </div>
        ) : (
          <p>No videos available</p>
        )}
      </Carousel>
    </div>
  );
}

export default Videos;
