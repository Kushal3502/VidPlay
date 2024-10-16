import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { ScaleLoader } from "react-spinners";
import { useToast } from "@/hooks/use-toast";
import { post } from "@/utils/api";

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (data) => {
    setLoader(true);

    try {
      const response = await post("/users/login", data);
      dispatch(login(response.data.user));

      if (response.success) {
        navigate("/");
        toast({
          description: "🎊 Welcome back!!!",
          className:
            "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
        });
      }
    } catch (error) {
      toast({
        description: "🔴 Invalid credentials!!!",
        className:
          "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
      });
    } finally {
      setLoader(false);
    }
  };

  const email = watch("email");
  const password = watch("password");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {loader ? (
        <div>
          <ScaleLoader color="#ffffff" />
        </div>
      ) : (
        <div className="p-8 shadow-md rounded-xl max-w-screen-md w-full border-2 border-white">
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 font-mono">
            Welcome back
          </h2>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="grid grid-cols-1 gap-5"
          >
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="text-black w-full"
                  {...register("email", {
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Invalid email address!!!",
                    },
                  })}
                />
                {errors.email && (
                  <div className="text-red-500">{errors.email.message}</div>
                )}
              </div>
              <p>or</p>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="Username"
                  className="text-black w-full"
                  {...register("username")}
                />
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                className="text-black w-full"
                {...register("password", {
                  minLength: {
                    value: 5,
                    message: "Password must be at least 5 characters long!!!",
                  },
                })}
              />
              {errors.password && (
                <div className="text-red-500">{errors.password.message}</div>
              )}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
              <Button
                variant="destructive"
                className="w-full md:w-3/6 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base"
              >
                Login
              </Button>
              <p className="text-center md:text-left">
                Don't have an account?
                <Link
                  to="/auth/register"
                  className="text-blue-500 underline ml-2"
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
