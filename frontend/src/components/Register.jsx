import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { post } from "@/utils/api";
import { ScaleLoader } from "react-spinners";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loader, setLoader] = useState(false);

  const handleRegister = async (data) => {
    setLoader(true);

    const formData = new FormData();

    formData.append("fullname", data.fullname);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);
    formData.append("coverImage", data.coverImage[0]);

    try {
      const response = await post("/users/register", formData);

      console.log(response);

      if (response.success) {
        navigate("/auth/login");
        toast({
          description: "🟢 Account created successfully!",
          className:
            "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        description: "🔴 Failed to register, please try again.",
        className:
          "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {loader ? (
        <div>
          <ScaleLoader color="#ffffff" />
        </div>
      ) : (
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
              <Label htmlFor="fullname">Fullname</Label>
              <Input
                type="text"
                id="fullname"
                placeholder="Fullname"
                className="text-black"
                {...register("fullname")}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="username">Username</Label>
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
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                className={`text-black ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password", {
                  minLength: {
                    value: 5,
                    message: "Password must be at least 5 characters long!",
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
              <Label htmlFor="avatar">Avatar</Label>
              <Input
                id="avatar"
                type="file"
                {...register("avatar")}
                className="cursor-pointer"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="coverImage">Cover Image</Label>
              <Input
                id="coverImage"
                type="file"
                {...register("coverImage")}
                className="cursor-pointer"
              />
            </div>
            <Button
              variant="destructive"
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base"
            >
              Register
            </Button>
            <p className="flex justify-center items-center">
              Already have an account?
              <Link to="/auth/login" className="text-blue-500 underline ml-2">
                Login
              </Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default Register;
