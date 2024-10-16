import React, { useEffect, useState } from "react";
import { Comment, LikeButton } from "@/components";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CirclePlus, ListPlus, Pencil, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { del, get, patch, post } from "@/utils/api";
import { ScaleLoader } from "react-spinners";

function Video() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [subscribeStatus, setSubscribeStatus] = useState(false);

  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchVideoDetails = async () => {
    const response = await get(`/videos/${videoId}`);
    console.log(response.data);

    setVideo(response.data);
    updateViews(response.data.views + 1);
    updateHistory();
  };

  const updateViews = async (newViews) => {
    await patch(`/videos/${videoId}`, {
      views: newViews,
    });
  };

  const updateHistory = async () => {
    await patch("/users/update-account-details", {
      watchHistory: [videoId],
    });
  };

  const fetchChannel = async (username) => {
    const response = await get(`/users/channel/${username}`);
    console.log(response.data);
    setSubscribeStatus(response.data.isSubscribed);
  };

  const fetchUserPlaylists = async () => {
    if (user?.userData) {
      const response = await get(`/playlist/user/${user?.userData._id}`);
      setPlaylist(response.data);
    }
  };

  const addVideoToPlaylist = async (playlistId) => {
    await patch(`/playlist/add/${videoId}/${playlistId}`);
    toast({
      description: "🟢 Video added successfully",
      className:
        "bg-zinc-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
    });
  };

  const toggleSubscription = async () => {
    if (!video) return;

    await post(`/subscriptions/c/${video.owner._id}`);
    setSubscribeStatus((prevStatus) => !prevStatus);
  };

  const handleDeleteVideo = async () => {
    await del(`/videos/${videoId}`);
    navigate("/");
  };

  useEffect(() => {
    if (videoId) {
      fetchVideoDetails();
      fetchUserPlaylists();
    }
  }, [videoId]);

  useEffect(() => {
    if (video?.owner?.username) {
      fetchChannel(video.owner.username);
    }
  }, [video]);

  return (
    <>
      {video ? (
        <div className="w-full lg:max-w-5xl flex flex-col p-4 lg:px-8">
          <div>
            <div className="rounded-lg overflow-hidden">
              <ReactPlayer
                url={video?.videoFile}
                controls={true}
                width="100%"
                height="100%"
              />
            </div>
            <div className="w-full p-4">
              <h1 className="lg:text-3xl sm:text-xl text-lg lg:mb-4 mb-2">
                {video?.title}
              </h1>
              <div className="w-full flex flex-row justify-between items-center gap-4 lg:gap-0">
                <div className="flex items-center gap-4">
                  <Link
                    to={`/users/channel/${video?.owner.username}`}
                    className="flex items-center gap-4"
                  >
                    <img
                      src={video?.owner?.avatar}
                      className="lg:w-12 lg:h-12 sm:h-10 sm:w-10 w-8 h-8 rounded-full object-cover"
                      alt="Avatar"
                    />
                    <p className="lg:text-xl text-lg font-medium">
                      {video?.owner?.username}
                    </p>
                  </Link>
                  <Button
                    onClick={() => {
                      if (user?.status) {
                        toggleSubscription();
                      } else {
                        navigate("/auth/login");
                      }
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base px-4 py-2 rounded-md"
                  >
                    {user?.status
                      ? subscribeStatus
                        ? "Subscribed"
                        : "Subscribe"
                      : "Login to Subscribe"}
                  </Button>
                  {user?.status && (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-2 sm:px-4 py-2 rounded-md">
                          <ListPlus />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="m-4 border-gray-400 bg-[#18181B] text-white w-52">
                        <DropdownMenuLabel className="text-lg">
                          Playlists
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {playlist && (
                          <div>
                            <div>
                              {playlist.map((pl) => (
                                <DropdownMenuItem
                                  key={pl._id}
                                  className="text-lg"
                                  onClick={() => addVideoToPlaylist(pl._id)}
                                >
                                  {pl.name}
                                </DropdownMenuItem>
                              ))}
                            </div>
                            <DropdownMenuItem className="text-lg">
                              <CirclePlus className="mr-2 h-4 w-4" />
                              <span
                                onClick={() => navigate("/upload/playlist")}
                              >
                                Create new playlist
                              </span>
                            </DropdownMenuItem>
                          </div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="flex items-center lg:gap-3 gap-2 text-center">
                  {user?.status && user.userData._id === video?.owner?._id && (
                    <div className="flex gap-2">
                      <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm lg:text-base px-2 sm:px-4 py-2 rounded-md">
                        <Link to="/dashboard">View channel</Link>
                      </Button>
                      <Link to={`/edit/video/${videoId}`}>
                        <Button className="bg-green-700 hover:bg-green-800 font-semibold text-sm lg:text-base px-2 sm:px-4 py-2 rounded-md">
                          <Pencil />
                        </Button>
                      </Link>
                      <Button
                        className="bg-red-600 hover:bg-red-700 font-semibold px-2 sm:px-4 py-2 rounded-md"
                        onClick={handleDeleteVideo}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  )}
                  <LikeButton video={video} />
                </div>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="lg:text-xl text-lg">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="lg:text-lg text-justify">
                    {video?.description}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="p-4">
              <Comment videoId={videoId} />
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

export default Video;
