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
    <div className="">
      <h2>Welcome back!!!</h2>
      <p>
        Don't have an account?
        <Link to={"/auth/register"}>Register</Link>
      </p>
      <form onSubmit={handleSubmit(handleLogin)}>
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
        <Button variant="secondary">Login</Button>
      </form>
    </div>
  );
}

export default Login;
