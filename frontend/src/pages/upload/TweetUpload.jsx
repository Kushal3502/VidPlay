import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TweetUpload() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleTweet = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", message);
    formData.append("tweetImage", image);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/tweets/",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (error) {
      console.log("Post error :: ", error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 border border-gray-300 rounded-md">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8">
        Create new Tweet
      </h2>
      <div className="grid w-full gap-2">
        <Label htmlFor="message" className="text-sm sm:text-base lg:text-lg">
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
          <Label htmlFor="picture" className="text-sm sm:text-base lg:text-lg">
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
  );
}

export default TweetUpload;
