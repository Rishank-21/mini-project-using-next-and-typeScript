"use client";

import { userDataContext } from "@/context/UserContext";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";

const page = () => {
  const data = useContext(userDataContext)
  const [name, setName] = useState("");
  const [backendImage, setBackendImage] = useState<File | null>(null);
  const [frontendImage, setFrontendImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontendImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (data?.user?.name) {
      setName(data.user.name);
      setFrontendImage(data.user.image || "");
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (backendImage) {
      formData.append("file", backendImage);
    }
    setIsLoading(true);
    try {
      const res = await axios.post("/api/editProfile", formData);
      data?.setUser(res.data);
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black justify-center text-white px-4">
      <div className="w-full max-w-md border-2 border-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Edit Profile Page
        </h1>
        <form
          action=""
          className="space-y-4 flex flex-col w-full items-center"
          onSubmit={handleSubmit}
        >
          <div
            className="w-[100px] h-[100px] rounded-full border-2 flex justify-center items-center border-white transition-all hover:border-blue-500 text-white hover:text-blue-500 cursor-pointer overflow-hidden relative"
            onClick={() => imageInput.current?.click()}
          >
            <input
              type="file"
              accept="image/*"
              hidden
              ref={imageInput}
              onChange={handleImage}
            />
            {frontendImage ? (
              <Image src={frontendImage} alt="User Image" fill={true} />
            ) : (
              <CgProfile size={22} color="white" />
            )}
          </div>

          <div className="space-y-4 w-full rounded-2xl bg-black">
            <label htmlFor="name" className="block text-sm text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 rounded-md bg-black border border-white border-r-0 border-l-0 border-t-0  outline-none focus:outline-none focus:ring-0 focus:ring-indigo-500"
              placeholder="Enter Your Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              value={name}
            />
          </div>

          <button
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-white text-black font-semibold rounded-lg transition-colors ${
              isLoading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-gray-200 cursor-pointer"
            }`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
