import React from "react";
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
import { AtSign, LogOut, User, Video } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { Searchbox } from ".";

function Navbar() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log(userData);
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      console.log(response);
      dispatch(logout());
      navigate("/auth/login");
    } catch (error) {
      console.log("Logout error :: ", error);
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-end lg:py-4 lg:px-12 md:p-3 p-2 space-x-4">
      <Link to={"/"}>
        <img
          src="/Logo-removebg-preview.png"
          className="w-24 sm:w-28 md:w-36 lg:w-36 mt-4 sm:mt-0"
          alt="Logo"
        />
      </Link>
      <Searchbox/>
      <div className="mt-4 lg:mt-0 flex justify-center items-center gap-4">
        {userData ? (
          <p className=" hidden lg:block lg:text-lg">
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
