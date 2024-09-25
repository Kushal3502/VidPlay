import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    console.log(data);

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
      headers: {
        Cookie:
          "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmViYjUyMjIyZTIzNmRmYWJmNGQwNWMiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidXNlcjEiLCJmdWxsbmFtZSI6Ik1yLiBVc2VyMSIsImlhdCI6MTcyNzI0ODE2MSwiZXhwIjoxNzI3MzM0NTYxfQ.vm2losS033ck6nRYUhhtT1dg5PLtWL2-CmCj06KBRjE; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmViYjUyMjIyZTIzNmRmYWJmNGQwNWMiLCJpYXQiOjE3MjcyNDgxNjEsImV4cCI6MTcyODExMjE2MX0.sKAtdRPiuOl7MowWeK-0dSjUobCZP6I9hUqECDNqLA0",
      },
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
    <div className="">
      <h2>Welcome to VidPlay!!!</h2>
      <p>
        Already have an account?
        <Link to={"/auth/login"}>Login</Link>
      </p>
      <form onSubmit={handleSubmit(handleRegister)}>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            placeholder="Username"
            className="text-black"
            {...register("username", {
              minLength: {
                value: 3,
                message: "Username must be atleast 3 characters long!!!",
              },
            })}
          />
          {errors.username && <div>{errors.username.message}</div>}
        </div>
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="fullname">Fullname</Label>
          <Input
            type="text"
            id="fullname"
            placeholder="Fullname"
            className="text-black"
            {...register("fullname")}
          />
          {errors.fullname && <div>{errors.fullname.message}</div>}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="avatar">Avatar</Label>
          <Input id="avatar" type="file" {...register("avatar")} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="coverImage">Cover Image</Label>
          <Input id="coverImage" type="file" {...register("coverImage")} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            className="text-black"
            {...register("password", {
              minLength: {
                value: 5,
                message: "Password must be atleast 6 characters long!!!",
              },
            })}
          />
          {errors.password && <div>{errors.password.message}</div>}
        </div>
        <Button variant="secondary">Register</Button>
      </form>
    </div>
  );
}

export default Register;
