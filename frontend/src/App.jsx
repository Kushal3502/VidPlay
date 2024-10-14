import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./components";
import { Toaster } from "@/components/ui/toaster";
import {
  AtSign,
  CirclePlus,
  History,
  House,
  LogOut,
  ThumbsUp,
  Twitter,
  User,
  Video,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/slices/authSlice";
import axios from "axios";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);

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

  useEffect(() => {
    navigate("/");
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        <div className="fixed top-18 w-2/5 lg:w-[13%] border-r border-slate-500 p-4 h-[calc(100vh-4rem)] lg:block hidden">
          <ul className="space-y-4 h-full flex flex-col justify-between gap-4">
            <div>
              <li className=" mb-2">
                <NavLink
                  to={"/"}
                  className={({ isActive }) =>
                    `flex items-center justify-start gap-2 p-2 cursor-pointer rounded-md text-xl ${
                      isActive
                        ? "bg-amber-600 text-black"
                        : "hover:bg-zinc-800 text-white"
                    } `
                  }
                >
                  <House className="h-6 w-6" />
                  <span className="font-medium">Home</span>
                </NavLink>
              </li>
              <li className=" mb-2">
                <NavLink
                  to={"/tweets"}
                  className={({ isActive }) =>
                    `flex items-center justify-start gap-2 p-2 cursor-pointer rounded-md text-xl ${
                      isActive
                        ? "bg-amber-600 text-black"
                        : "hover:bg-zinc-800 text-white"
                    } `
                  }
                >
                  <Twitter className="h-6 w-6" />
                  <span className="font-medium">Tweets</span>
                </NavLink>
              </li>
              {authStatus && (
                <div>
                  <li className=" mb-2">
                    <NavLink
                      to={"/likes"}
                      className={({ isActive }) =>
                        `flex items-center justify-start gap-2 p-2 cursor-pointer rounded-md text-xl ${
                          isActive
                            ? "bg-amber-600 text-black"
                            : "text-white hover:bg-zinc-800 "
                        } `
                      }
                    >
                      <ThumbsUp className="h-6 w-6" />
                      <span>Likes</span>
                    </NavLink>
                  </li>
                  <li className=" mb-2">
                    <NavLink
                      to={"/history"}
                      className={({ isActive }) =>
                        `flex items-center justify-start gap-2 p-2 cursor-pointer rounded-md text-xl ${
                          isActive
                            ? "bg-amber-600 text-black"
                            : "text-white hover:bg-zinc-800 "
                        } `
                      }
                    >
                      <History className="h-6 w-6" />
                      <span>History</span>
                    </NavLink>
                  </li>
                </div>
              )}
            </div>
            <div>
              <li className=" mb-2">
                <NavLink
                  to={"/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center justify-start gap-2 p-2 cursor-pointer rounded-md text-xl text-black ${
                      isActive ? "bg-amber-600" : "bg-amber-500"
                    } hover:bg-amber-600`
                  }
                >
                  <User className="h-6 w-6" />
                  <span className="font-medium">Profile</span>
                </NavLink>
              </li>
              <li
                className=" mb-2 flex items-center justify-start gap-2 p-2 cursor-pointer rounded-md text-xl bg-red-600 hover:bg-red-700"
                onClick={handleLogout}
              >
                <LogOut className="h-6 w-6" />
                <span>Log out</span>
              </li>
            </div>
          </ul>
        </div>
        <div className="lg:ml-[13%] w-full h-full flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
