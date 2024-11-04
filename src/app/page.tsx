"use client";

import React from "react";
import { useState, useEffect } from "react";

import Home from "@/app/home";
import Image from "next/image";

import supabase from "@/utils/supabase";
import { AuthProvider, useAuth } from "@/app/api/login";

const MainPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    console.log("User: ", user);
    if (!user) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [user]);

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = (
      event.currentTarget.elements.namedItem("id") as HTMLInputElement
    ).value;
    const password = (
      event.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;

    (async () => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: id,
          password,
        });
        if (error) {
          throw error;
        }
        setIsLogin(true);
        const { data } = await supabase.auth.getUser();
        console.log("User Data: ", data);
      } catch {
        console.error("Could not login!");
        return;
      }
    })();
  }

  return isLogin ? (
    <Home />
  ) : (
    <div className="h-screen w-full max-w-md mx-auto space-y-6 flex flex-col justify-center bg-white">
      <div className="flex justify-center">
        <Image src="/logo/logo.jpg" alt="main logo" width={400} height={200} />
      </div>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-2 flex flex-col">
          <label className="text font-bold" htmlFor="id">
            ID
          </label>
          <input
            id="id"
            className="border-2 border-solid rounded-lg p-2 my-4 transition-colors border-gray-200 hover:border-primary-400 focus:border-primary-400"
            placeholder="아이디를 입력하세요"
            required
          />
        </div>
        <div className="space-y-2 flex flex-col pb-4">
          <label className="text font-bold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="border-2 border-solid rounded-lg p-2 my-4 transition-colors border-gray-200 hover:border-primary-400 focus:border-primary-400"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <button
          className="rounded-lg w-full py-2 px-4 bg-black hover:bg-gray-900 transition-colors"
          type="submit"
        >
          <span className="text-white text-lg font-bold">Login</span>
        </button>
      </form>
    </div>
  );
};

const MainPageWrapper: React.FC = () => {
  return (
    <AuthProvider>
      <MainPage />
    </AuthProvider>
  );
};

export default MainPageWrapper;
