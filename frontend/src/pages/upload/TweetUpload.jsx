import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { post } from "@/utils/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

function TweetUpload() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTweet = async (e) => {
    e.preventDefault();
    setLoader(true);

    const formData = new FormData();
    formData.append("content", message);
    formData.append("tweetImage", image);

    const response = await post("/tweets/", formData);
    console.log(response.data);

    navigate(`/tweet/${response.data._id}`);

    setLoader(false);

    toast({
      description: "🟢Tweet uploaded",
      className:
        "bg-zinc-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
    });
  };

  return (
    <>
      {loader ? (
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#ffffff" />
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 border border-gray-300 rounded-md">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8">
            Create new Tweet
          </h2>
          <div className="grid w-full gap-2">
            <Label
              htmlFor="message"
              className="text-sm sm:text-base lg:text-lg"
            >
              Your message
            </Label>
            <Textarea
              placeholder="Type your message here."
              id="message"
              className="bg-transparent rounded-md p-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-end">
            <div className="grid w-28 items-center gap-2 mt-4 cursor-pointer">
              <Label
                htmlFor="picture"
                className="text-sm sm:text-base lg:text-lg"
              >
                Image
              </Label>
              <Input
                id="picture"
                type="file"
                className="rounded-md p-2"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base px-4 py-2 rounded-md"
                onClick={handleTweet}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TweetUpload;
