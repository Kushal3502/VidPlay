import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PlaylistEdit() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { playlistId } = useParams();

  const navigate = useNavigate();

  const fetchPlaylistDetails = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/playlist/${playlistId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data);
      setName(response.data.data[0].name);
      setDescription(response.data.data[0].description);
    } catch (error) {
      console.log("Video fetch error :: ", error);
    }
  };

  const updatePlaylist = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/v1/playlist/${playlistId}`,
        {
          name,
          description,
        },
        { withCredentials: true }
      );
      navigate(`/playlist/${playlistId}`);
      console.log(response.data);
    } catch (error) {
      console.log("Post error :: ", error);
    }
  };

  useEffect(() => {
    fetchPlaylistDetails();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 border border-gray-300 rounded-md">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8">
        Edit playlist
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
          onClick={updatePlaylist}
        >
          Create
        </Button>
      </div>
    </div>
  );
}

export default PlaylistEdit;
