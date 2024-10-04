import { Comment } from "@/components";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Tweet() {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState();

  const fetchTweet = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/tweets/${tweetId}`
      );
      console.log(response.data);
      setTweet(response.data.data);
    } catch (error) {
      console.log("Tweet fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchTweet();
  }, []);

  return (
    <div className="max-w-2xl mx-auto lg:my-8 my-4 lg:p-4 border border-zinc-600 rounded-lg">
      {tweet && (
        <div>
          <div className=" flex justify-start items-center gap-4 mb-6">
            <img
              src={tweet?.owner.avatar}
              className=" lg:w-12 lg:h-12 w-10 h-10 rounded-full object-cover"
            />
            <h2 className=" lg:text-xl">{tweet?.owner.username}</h2>
          </div>
          <div className=" mb-4">
            <p className=" lg:text-lg text-justify mb-2">{tweet?.content}</p>
            <img src={tweet?.tweetImage} className="rounded-lg " />
                  </div>
                  <Separator className="my-4" />
          <div>
            <Comment tweetId={tweet?._id} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Tweet;
