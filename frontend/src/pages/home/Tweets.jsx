import { useEffect, useState } from "react";
import { TweetCard } from "../../components";
import { get } from "@/utils/api";
import { ScaleLoader } from "react-spinners";

function Tweets() {
  const [tweets, setTweets] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchTweets = async () => {
    setLoader(true);
    const response = await get("/tweets/", {}, false);
    console.log(response);
    setTweets(response.data);
    setLoader(false);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:px-10">
      <h2 className="lg:text-3xl mb-4">Popular tweets</h2>
      {!loader ? (
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
      ) : (
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#ffffff" />
        </div>
      )}
    </div>
  );
}

export default Tweets;
