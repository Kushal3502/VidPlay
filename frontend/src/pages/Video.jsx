import React, { useEffect, useState } from "react";
import { Comment, LikeButton } from "@/components";
import { Button } from "@/components/ui/button";
import axios from "axios";
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

function Video() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [subscribeStatus, setSubscribeStatus] = useState(false);

  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchVideoDetails = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/videos/${videoId}`,
        { withCredentials: true }
      );
      setVideo(response.data.data);
      console.log(response.data.data.views);
      updateViews(response.data.data.views + 1);
      updateHistory()
    } catch (error) {
      console.log("Video fetch error :: ", error);
    }
  };

  const updateViews = async (newViews) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/v1/videos/${videoId}`,
        {
          views: newViews,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log("Update views error :: ", error);
    }
  };
  const updateHistory = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/v1/users/update-account-details`,
        {
          watchHistory: [videoId],
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log("Update history error :: ", error);
    }
  };

  const fetchChannel = async (username) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/users/channel/${username}`,
        { withCredentials: true }
      );
      setSubscribeStatus(response.data.data.isSubscribed);
    } catch (error) {
      console.log("Channel fetch error :: ", error);
    }
  };

  const fetchUserPlaylists = async () => {
    if (user?.userData) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/playlist/user/${user?.userData._id}`,
          { withCredentials: true }
        );
        setPlaylist(response.data.data);
      } catch (error) {
        console.log("Playlist fetch error :: ", error);
      }
    }
  };

  const addVideoToPlaylist = async (playlistId) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/v1/playlist/add/${videoId}/${playlistId}`,
        {},
        { withCredentials: true }
      );
      toast({ description: "Video added successfully" });
    } catch (error) {
      console.log("Video add error :: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  const toggleSubscription = async () => {
    if (!video) return;
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/v1/subscriptions/c/${video.owner._id}`,
        {},
        { withCredentials: true }
      );
      setSubscribeStatus((prevStatus) => !prevStatus);
    } catch (error) {
      console.log("Subscription error :: ", error);
    }
  };

  const handleDeleteVideo = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/videos/${videoId}`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.log("Video delete error :: ", error);
    }
  };

  // Fetch video details and playlists on component mount
  useEffect(() => {
    if (videoId) {
      fetchVideoDetails();
      fetchUserPlaylists();
    }
  }, [videoId]);

  // Fetch channel details when video is loaded
  useEffect(() => {
    if (video?.owner?.username) {
      fetchChannel(video.owner.username);
    }
  }, [video]);

  return (
    <div className="w-full lg:max-w-5xl flex flex-col p-4 lg:px-8">
      {video ? (
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
                            <span onClick={() => navigate("/upload/playlist")}>
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
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
}

export default Video;
