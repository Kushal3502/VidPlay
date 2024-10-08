import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    let userInfo = new FormData();

    userInfo.append("username", data.username);
    userInfo.append("email", data.email);
    userInfo.append("fullname", data.fullname);
    userInfo.append("avatar", data.avatar[0]);
    userInfo.append("coverImage", data.coverImage[0]);
    userInfo.append("password", data.password);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://127.0.0.1:8000/api/v1/users/register",
      data: userInfo,
    };

    try {
      const response = await axios.request(config);
      console.log(response.data);
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="lg:p-8 md:p-6 p-4 shadow-md rounded-xl max-w-screen-md w-full border-2 border-white">
        <h2 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold font-mono mb-4 md:mb-8 flex flex-col sm:flex-row items-center justify-start">
          Welcome to
          <img
            src="../public/Logo-removebg-preview.png"
            className="w-32 sm:w-40 md:w-48 lg:w-48 mt-4 sm:mt-0 sm:ml-4"
            alt="Logo"
          />
        </h2>
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="fullname" className="">
              Fullname
            </Label>
            <Input
              type="text"
              id="fullname"
              placeholder="Fullname"
              className="text-black "
              {...register("fullname")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="username" className="">
              Username
            </Label>
            <Input
              type="text"
              id="username"
              placeholder="Username"
              className={`text-black ${
                errors.username ? "border-red-500" : ""
              }`}
              {...register("username", {
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters long!",
                },
              })}
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              className={`text-black ${errors.email ? "border-red-500" : ""}`}
              {...register("email", {
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Invalid email address!",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password" className="">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              className={`text-black ${
                errors.password ? "border-red-500" : ""
              }`}
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long!",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="avatar" className="">
              Avatar
            </Label>
            <Input
              id="avatar"
              type="file"
              {...register("avatar")}
              className="cursor-pointer"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="coverImage" className="">
              Cover Image
            </Label>
            <Input
              id="coverImage"
              type="file"
              {...register("coverImage")}
              className="cursor-pointer"
            />
          </div>
          {isSubmitting ? (
            <Button
              disabled
              className=" bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base"
            >
              Register
            </Button>
          )}
          <p className="flex justify-center items-center">
            Already have an account?
            <Link to={"/auth/login"} className="text-blue-500 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
