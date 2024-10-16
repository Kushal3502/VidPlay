import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { post } from "@/utils/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

function VideoUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVideo = async (e) => {
    e.preventDefault();
    setLoader(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    formData.append("videoFile", video);

    const response = await post("/videos/", formData);
    console.log(response.data);

    navigate(`/video/${response.data._id}`);

    setLoader(false);

    toast({
      description: "🟢Video uploaded",
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
            Upload new video
          </h2>
          <div className="grid w-full gap-2 mb-4">
            <Label htmlFor="title" className="text-sm sm:text-base lg:text-lg">
              Title
            </Label>
            <Textarea
              placeholder="Type your message here."
              id="title"
              className="bg-transparent rounded-md p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid w-full gap-2">
            <Label
              htmlFor="description"
              className="text-sm sm:text-base lg:text-lg"
            >
              Description
            </Label>
            <Textarea
              placeholder="Type your message here."
              id="description"
              className="bg-transparent rounded-md p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-end">
            <div className="flex gap-4">
              <div className="grid w-28 items-center gap-2 mt-4 cursor-pointer">
                <Label
                  htmlFor="picture"
                  className="text-sm sm:text-base lg:text-lg"
                >
                  Video
                </Label>
                <Input
                  id="picture"
                  type="file"
                  className="rounded-md p-2"
                  onChange={(e) => setVideo(e.target.files[0])}
                />
              </div>
              <div className="grid w-28 items-center gap-2 mt-4 cursor-pointer">
                <Label
                  htmlFor="picture"
                  className="text-sm sm:text-base lg:text-lg"
                >
                  Thumbnail
                </Label>
                <Input
                  id="picture"
                  type="file"
                  className="rounded-md p-2"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base px-4 py-2 rounded-md"
                onClick={handleVideo}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoUpload;
