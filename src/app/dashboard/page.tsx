"use client";

import React from "react";

import useStoreUser from "@/entities/user/store/useStoreUser";
import RedirectToPath from "@/shared/ui/Redirect/RedirectToPath";
import Starfield from "@/shared/ui/StarField";
import { useTheme } from "next-themes";

const Dashboard = () => {
  const { authUser } = useStoreUser();
  const {theme} = useTheme();

  if (!authUser) {
    return <RedirectToPath to="/login" />;
  }

  return (
    <div className="min-h-[calc(100svh-var(--header-height)-2px)] grid place-items-center relative overflow-hidden ">
      <Starfield
        starCount={theme === "dark" ? 1000 : 3000}
        starColor={theme === "dark" ? [ 255, 255, 255] : [21, 52, 251]}
        speedFactor={0.005}
        backgroundColor={theme === "dark" ? "black" : "snow"}
      />
      <div className="grid gap-5 relative z-10">
        <h1 className="text-2xl text-center">
          Добро пожаловать,{" "}
          <span className="capitalize">
            {authUser?.username.split(" ")[1]}!
          </span>
        </h1>
        <p className="text-lg text-center">
          Вы можете начать свою работу с боковой панели.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
