import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

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
    };

    try {
      const response = await axios.request(config);
      console.log("Response:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="p-8 shadow-md rounded-xl max-w-screen-md w-full border-2 border-white">
        <h2 className="text-4xl font-semibold font-mono mb-8">
          Welcome back🫦💦
        </h2>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="grid grid-cols-1 gap-5"
        >
          <div className="flex justify-center items-center gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                className="text-black"
                {...register("email", {
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Invalid email address!!!",
                  },
                })}
              />
              {errors.email && <div>{errors.email.message}</div>}
            </div>
            <p>or,</p>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                placeholder="Username"
                className="text-black"
                {...register("username")}
              />
              {errors.username && <div>{errors.username.message}</div>}
            </div>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              className="text-black w-4/5"
              {...register("password", {
                minLength: {
                  value: 5,
                  message: "Password must be atleast 6 characters long!!!",
                },
              })}
            />
            {errors.password && <div>{errors.password.message}</div>}
          </div>
          <div className="flex justify-between items-center">
            <Button
              variant="destructive"
              className="w-3/6 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base"
            >
              Login
            </Button>
            <p className="flex justify-center items-center pr-10">
              Don't have an account?
              <Link to={"/auth/register"} className="text-blue-500 underline">
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
