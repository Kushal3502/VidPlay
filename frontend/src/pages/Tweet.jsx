import { Comment, LikeButton } from "@/components";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { del, get } from "@/utils/api";
import { Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

function Tweet() {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState();
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchTweet = async () => {
    const response = await get(`/tweets/${tweetId}`);
    console.log(response.data);
    setTweet(response.data);
  };

  const handleDelete = async () => {
    await del(`/tweets/${tweetId}`, {
      withCredentials: true,
    });
    navigate("/");
  };

  useEffect(() => {
    fetchTweet();
  }, []);

  return (
    <>
      {tweet ? (
        <div className="max-w-2xl mx-auto lg:my-8 my-4 p-4 border border-zinc-600 rounded-lg">
          <div>
            <div className=" flex justify-between items-start">
              <div className=" flex justify-start items-center gap-4 mb-6">
                <img
                  src={tweet?.owner.avatar}
                  className=" lg:w-12 lg:h-12 w-10 h-10 rounded-full object-cover"
                />
                <h2 className=" lg:text-xl">{tweet?.owner.username}</h2>
              </div>
              {user?.userData?._id === tweet?.owner._id && (
                <div className=" flex justify-center items-center gap-2">
                  <Link to={`/edit/tweet/${tweetId}`}>
                    <Button className="bg-green-700 hover:bg-green-800 font-semibold px-2 sm:px-4 py-2 rounded-md">
                      <Pencil />
                    </Button>
                  </Link>
                  <Button
                    className="bg-red-600 hover:bg-red-700 font-semibold px-2 sm:px-4 py-2 rounded-md"
                    onClick={handleDelete}
                  >
                    <Trash2 />
                  </Button>
                </div>
              )}
            </div>
            <div className=" mb-4">
              <p className=" lg:text-lg text-justify mb-2">{tweet?.content}</p>
              <img src={tweet?.tweetImage} className="rounded-lg mx-auto" />
            </div>
            <Separator className="my-4" />
            <LikeButton tweet={tweet} />
            <Separator className="my-4" />
            <div>
              <Comment tweetId={tweet?._id} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#ffffff" />
        </div>
      )}
    </>
  );
}

export default Tweet;
