import { useEffect, useState } from "react";
import { TweetCard, Videos } from "../../components";
import axios from "axios";

function Tweets() {
  const [tweets, setTweets] = useState([]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/tweets/", {
        withCredentials: true,
      });
      console.log(response.data);
      setTweets(response.data.data);
    } catch (error) {
      console.log("Video fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:px-10">
      <h2 className="lg:text-3xl mb-4">Popular tweets</h2>
      <div className="">
        {tweets && tweets.length > 0 ? (
          <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-8">
            {tweets.map((tweet) => (
              <div key={tweet._id} className=" cursor-pointer">
                <TweetCard tweet={tweet} />
              </div>
            ))}
          </div>
        ) : (
          <p>No tweet available</p>
        )}
      </div>
    </div>
  );
}

export default Tweets;
