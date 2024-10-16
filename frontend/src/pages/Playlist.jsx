import { VideoCard } from "@/components";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { useToast } from "@/hooks/use-toast";
import { ScaleLoader } from "react-spinners";
import { del, get } from "@/utils/api";

function Playlist() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState();
  const [loader, setLoader] = useState(false);
  const user = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const { toast } = useToast();

  const fetchPlaylist = async () => {
    setLoader(true);

    const response = await get(`/playlist/${playlistId}`);
    setPlaylist(response.data[0]);
    console.log(response.data.videos);

    setLoader(false);
  };

  const handleDelete = async () => {
    setLoader(true);

    await del(`/playlist/${playlistId}`);

    navigate("/dashboard");
    setLoader(false);

    toast({
      description: "🗑️ Playlist deleted.",
      className:
        "bg-zinc-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
    });
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  return (
    <>
      {loader ? (
        <div className=" h-full flex justify-center items-center">
          <ScaleLoader color="#ffffff" />
        </div>
      ) : (
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
            </div>
          </div>
          <div>
            {playlist && playlist.videos.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {playlist.videos.map((video) => (
                  <div key={video._id} className="cursor-pointer">
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No videos available</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Playlist;
