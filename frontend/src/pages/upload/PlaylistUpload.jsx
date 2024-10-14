import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

function PlaylistUpload() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const { toast } = useToast();

  const handlePlaylist = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/playlist/",
        {
          name,
          description,
        },
        { withCredentials: true }
      );
      navigate("/");
      setLoader(false);
      toast({
        description: " ✅Playlist created successfully",
        className:
          "bg-amber-600 font-semibold px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
      });
      console.log(response.data);
    } catch (error) {
      console.log("Post error :: ", error);
    }
  };

  return (
    <>
      {loader ? (
        <div>
          <ScaleLoader color="#ffffff" />
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 border border-gray-300 rounded-md">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8">
            Create new playlist
          </h2>
          <div className="grid w-full gap-2 mb-4">
            <Label htmlFor="title" className="text-sm sm:text-base lg:text-lg">
              Name
            </Label>
            <Textarea
              placeholder="Enter playlist name"
              id="name"
              className="bg-transparent rounded-md p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="Enter playlist description"
              id="description"
              className="bg-transparent rounded-md p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base px-4 py-2 rounded-md"
              onClick={handlePlaylist}
            >
              Create
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default PlaylistUpload;
