"use client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        redirect: false,
      });
       router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md border-2 border-white rounded-2xl p-8 shadow-lg bg-gray-900">
        <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter Your Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              value={name}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter Your Email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              value={email}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter Your Password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              value={password}
            />
          </div>

          <p className="text-sm text-center text-gray-400">
            Already have an account ?{" "}
            <span
              className="text-indigo-400 underline cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>

          <button
            type="submit"
            className="w-full cursor-pointer mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-md"
          >
            Register
          </button>

          <div className="flex items-center justify-center space-x-4 my-4">
            <hr className="w-full border-gray-700" />
            <span className="text-gray-400">OR</span>
            <hr className="w-full border-gray-700" />
          </div>

          <button
            className="w-full cursor-pointer mt-2 bg-white hover:bg-gray-200 text-black font-medium py-2 rounded-md flex items-center justify-center space-x-2 gap-3"
            onClick={async () => {await signIn("google", {callbackUrl:"/"});
          }}>
            <FcGoogle size={27} />
            Sign Up with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
