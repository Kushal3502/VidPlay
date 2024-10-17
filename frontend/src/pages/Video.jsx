import React, { useEffect, useState } from "react";
import { Comment, LikeButton, VideoCard } from "@/components";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CirclePlus,
  ListPlus,
  Pencil,
  Rss,
  Trash2,
  User,
  UserCheck,
  UserPlus,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

function Video() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [subscribeStatus, setSubscribeStatus] = useState(false);
  const [suggestions, setSuggestions] = useState();

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
      description: "🟢Video added successfully",
      className:
        "bg-zinc-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
    });
  };

  const toggleSubscription = async () => {
    if (!video) return;

    await post(`/subscriptions/c/${video.owner._id}`);

    if (subscribeStatus) {
      toast({
        description: "🔴Unsubscribed",
        className:
          "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
      });
    } else {
      toast({
        description: "🟢Subscribed",
        className:
          "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
      });
    }

    setSubscribeStatus((prevStatus) => !prevStatus);
  };

  const handleDeleteVideo = async () => {
    await del(`/videos/${videoId}`);
    navigate("/");

    toast({
      description: "🔴Video deleted",
      className:
        "bg-zinc-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
    });
  };

  const fetchSuggestions = async (videoId) => {
    const response = await get("/videos");
    console.log(response);
    setSuggestions(response.data.filter((item) => item._id != videoId));
  };

  useEffect(() => {
    if (videoId) {
      fetchVideoDetails();
      fetchUserPlaylists();
      fetchSuggestions(videoId);
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
        <div className=" mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="w-full col-span-2">
              <div className="rounded-lg overflow-hidden max-w-7xl">
                <ReactPlayer
                  url={video?.videoFile}
                  controls={true}
                  width="100%"
                  height="100%"
                />
              </div>
              <div className="mt-4">
                <h1 className="lg:text-3xl sm:text-xl text-lg lg:mb-4 mb-2">
                  {video?.title}
                </h1>
                <div className="flex justify-between items-center">
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
                      className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base p-2 rounded-md"
                    >
                      {user?.status ? (
                        subscribeStatus ? (
                          <>
                            <p className=" lg:block hidden">Subscribed</p>
                            <UserCheck className=" lg:hidden block" />
                          </>
                        ) : (
                          <>
                            <p className=" lg:block hidden">Subscribe</p>
                            <UserPlus className=" lg:hidden block" />
                          </>
                        )
                      ) : (
                        "Login to Subscribe"
                      )}
                    </Button>
                    {user?.status && (
                      <div>
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
                        <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-2 sm:px-4 py-2 rounded-md ml-2">
                          <LikeButton video={video} />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center lg:gap-3 gap-2 text-center">
                    {user?.status &&
                      user.userData._id === video?.owner?._id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-2 sm:px-4 py-2 rounded-md">
                              <Rss />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="m-4 border-gray-400 bg-[#18181B] text-white w-52">
                            <DropdownMenuItem className="text-lg">
                              <User className="mr-2 h-4 w-4" />
                              <span onClick={() => navigate("/dashboard")}>
                                View channel
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-lg">
                              <Pencil className="mr-2 h-4 w-4" />
                              <span
                                onClick={() =>
                                  navigate(`/edit/video/${videoId}`)
                                }
                              >
                                Edit
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 text-lg">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span onClick={handleDeleteVideo}>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                  </div>
                </div>
              </div>
              <Accordion type="single" collapsible className=" lg:hidden block">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="lg:text-xl text-lg">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="lg:text-lg text-justify">
                    {video?.description}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Separator className="my-4 lg:block hidden" />
              <div className=" col-span-2 mt-2">
                <Comment videoId={videoId} />
              </div>
            </div>
            <div className=" lg:block hidden p-2">
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="lg:text-xl text-lg">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="lg:text-lg text-justify">
                    {video?.description}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className=" lg:p-8 p-2 mt-2">
                <h2 className="lg:text-xl">Suggestions</h2>
                {suggestions?.map((video) => (
                  <div className=" my-4">
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
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
