import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (data) => {
    console.log(data);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://127.0.0.1:8000/api/v1/users/login",
      headers: {
        "Content-Type": "application/json",
      },
      data,
      withCredentials: true,
    };

    try {
      const response = await axios.request(config);
      console.log("Response:", response.data);
      dispatch(login(response.data.data.user));
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
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
              {errors.username && (
                <div className="text-red-500">{errors.username.message}</div>
              )}
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
    </div>
  );
}

export default Login;
