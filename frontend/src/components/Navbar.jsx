import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
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
import { LogOut, User } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";

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

  const handleProfile = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/dashboard/stats",
        { withCredentials: true }
      );
      console.log(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.log("Profile error :: ", error);
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center lg:py-4 lg:px-12 md:p-3 p-2 space-x-4">
      <Link to={"/"}>
        <img
          src="/Logo-removebg-preview.png"
          className="w-24 sm:w-28 md:w-36 lg:w-36 mt-4 sm:mt-0"
          alt="Logo"
        />
      </Link>
      <form className="flex flex-wrap justify-center items-center gap-4 w-full lg:w-auto">
        <Input
          type="text"
          id="search"
          placeholder="Search for videos"
          className="w-full lg:w-[550px]  px-4 py-2 bg-transparent border-gray-600 text-white text-lg"
        />
        <Button
          variant="destructive"
          className="w-full lg:w-auto bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base"
        >
          Search
        </Button>
      </form>
      <div className="mt-4 lg:mt-0 flex justify-center items-center gap-4">
        <p className=" hidden lg:block lg:text-lg">Welcome, { userData?.fullname}</p>
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
          <DropdownMenuContent className="m-4 bg-[#18181B] text-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span onClick={handleProfile}>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span onClick={handleLogout}>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Navbar;
