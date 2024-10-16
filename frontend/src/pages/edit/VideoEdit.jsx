import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { get, patch } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

function VideoEdit() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loader, setLoader] = useState(false);

  const { videoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchVideoDetails = async () => {
    const response = await get(`/videos/${videoId}`);
    console.log(response.data);
    setTitle(response.data.title);
    setDescription(response.data.description);
  };

  const updateVideo = async (e) => {
    e.preventDefault();
    setLoader(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);

    const response = await patch(`/videos/${videoId}`, formData);
    console.log(response);

    navigate(`/video/${videoId}`);

    setLoader(false);

    toast({
      description: "🟢Video updated",
      className:
        "bg-zinc-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
    });
  };

  useEffect(() => {
    fetchVideoDetails();
  }, []);

  return (
    <>
      {loader ? (
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#ffffff" />
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 border border-gray-300 rounded-md">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8">
            Edit video
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
                onClick={updateVideo}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoEdit;
