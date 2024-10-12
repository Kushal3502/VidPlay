import { VideoCard } from "@/components";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function Playlist() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState();

  const user = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/playlist/${playlistId}`
      );
      setPlaylist(response.data.data[0]);
      console.log(response.data.data.videos);
    } catch (error) {
      console.log("Playlist fetch error :: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/playlist/${playlistId}`,
        {
          withCredentials: true,
        }
      );
      navigate("/");
    } catch (error) {
      console.log("Playlist delete error :: ", error);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  return (
    <div className="max-w-6xl mx-auto lg:p-8 p-2 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div>
        <div className=" flex justify-between items-center">
          <h1 className="text-3xl font-semibold">{playlist?.name}</h1>
          <div className="flex items-center lg:gap-3 gap-2 text-center">
            {user.status && user.userData._id === playlist?.owner && (
              <div className=" flex gap-2">
                <Link to={`/edit/playlist/${playlistId}`}>
                  <Button className="bg-green-700 hover:bg-green-800 px-2 sm:px-4 py-2 rounded-md">
                    <Pencil />
                  </Button>
                </Link>
                <Button
                  className="bg-red-600 hover:bg-red-700 px-2 sm:px-4 py-2 rounded-md"
                  onClick={handleDelete}
                >
                  <Trash2 />
                </Button>
              </div>
            )}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="mt-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-2xl">
                Description
              </AccordionTrigger>
              <AccordionContent className="mt-2 text-gray-600 text-lg text-justify">
                {playlist?.description}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* <h2 className="text-2xl">Description</h2>
          <p className="mt-2 text-gray-600 text-justify">
            {playlist?.description}
          </p> */}
        </div>
      </div>
      <div>
        {playlist && playlist.videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {playlist.videos.map((video) => (
              <div
                key={video._id}
                className="transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No videos available</p>
        )}
      </div>
    </div>
  );
}

export default Playlist;
