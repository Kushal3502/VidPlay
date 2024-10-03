import axios from "axios";
import React, { useEffect, useState } from "react";
import TweetCard from "./TweetCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

function Tweets({ userId }) {
  const [tweets, setTweets] = useState([]);

  const fetchTweets = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/tweets/user/${userId}`,
        { withCredentials: true }
      );
      console.log(response.data);
      setTweets(response.data.data);
    } catch (error) {
      console.log("Tweet fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div className=" p-4 sm:p-6 lg:p-4">
      <h2 className="lg:text-3xl mb-4">Tweets</h2>
      <Carousel>
        {tweets && tweets.length > 0 ? (
          <div>
            <CarouselContent>
              {tweets.map((tweet) => (
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div
                    key={tweet._id}
                    className=" rounded-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <TweetCard tweet={tweet} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>{" "}
            <CarouselPrevious className="hidden lg:block bg-transparent border-none" />
            <CarouselNext className="hidden lg:block bg-transparent border-none" />
          </div>
        ) : (
          <p>No tweets available</p>
        )}
      </Carousel>
    </div>
  );
}

export default Tweets;
