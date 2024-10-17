import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AtSign,
  CirclePlus,
  History,
  LogOut,
  Search,
  ThumbsUp,
  Twitter,
  User,
  UserCheck,
  Video,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { Searchbox } from ".";
import { post } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

function Navbar() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = async () => {
    const response = await post("/users/logout");
    console.log(response);
    dispatch(logout());
    toast({
      description: "🔴 Logged out!!!",
      className:
        "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
    });
    navigate("/auth/login");
  };

  return (
    <div className="flex flex-wrap justify-between items-end lg:py-4 lg:px-12 md:p-3 p-2 space-x-4 border-b border-slate-500">
      <Link to={"/"}>
        <img
          src="/Logo-removebg-preview.png"
          className="w-24 sm:w-28 md:w-36 lg:w-36 mt-4 sm:mt-0"
          alt="Logo"
        />
      </Link>
      <div className="lg:hidden block">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full lg:w-auto bg-zinc-900 border border-gray-500 font-semibold text-base"
              onClick={() => setIsDialogOpen(true)}
            >
              <Search />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-zinc-900">
            <div className="grid gap-4 py-4">
              <Searchbox closeDialog={() => setIsDialogOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className=" lg:block hidden">
        <Searchbox />
      </div>
      <div className="mt-4 lg:mt-0 flex items-center gap-4">
        {userData ? (
          <p className="hidden lg:block lg:text-lg">
            Welcome, {userData?.fullname.split(" ")[0]}
          </p>
        ) : (
          <Link to={"/auth/login"}>
            <Button className="w-full lg:w-auto bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base">
              Login
            </Button>
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={userData?.avatar || "https://github.com/shadcn.png"}
                alt="@shadcn"
                className="object-cover"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          {userData && (
            <DropdownMenuContent className="m-4 border-gray-400 bg-[#18181B] text-white w-52">
              <DropdownMenuLabel className="text-lg">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-lg">
                <User className="mr-2 h-4 w-4" />
                <span onClick={() => navigate("/dashboard")}>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-lg">
                <Video className="mr-2 h-4 w-4" />
                <span onClick={() => navigate("/upload/video")}>New video</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-lg">
                <AtSign className="mr-2 h-4 w-4" />
                <span onClick={() => navigate("/upload/tweet")}>New post</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-lg">
                <CirclePlus className="mr-2 h-4 w-4" />
                <span onClick={() => navigate("/upload/playlist")}>
                  New playlist
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-lg">
                <ThumbsUp className="mr-2 h-4 w-4" />
                <span onClick={() => navigate("/likes")}>Likes</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-lg">
                <Twitter className="mr-2 h-4 w-4" />
                <span onClick={() => navigate("/tweets")}>Tweets</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-lg">
                <UserCheck className="mr-2 h-4 w-4" />
                <span onClick={() => navigate("/subscriptions")}>
                  Subscriptions
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-lg">
                <History className="mr-2 h-4 w-4" />
                <span onClick={() => navigate("/history")}>History</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 text-lg">
                <LogOut className="mr-2 h-4 w-4" />
                <span onClick={handleLogout}>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Navbar;
