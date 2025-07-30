"use client";

import React from "react";

import { useTheme } from "next-themes";

import useStoreUser from "@/entities/user/store/useStoreUser";
import Starfield from "@/shared/ui/StarField";

type TypeOptionsTheme = {
  starCount: number;
  starColor: [number, number, number];
  backgroundColor: string;
};

const darkThemeOptions: TypeOptionsTheme = {
  starCount: 1000,
  starColor: [255, 255, 255],
  backgroundColor: "black",
};

const lightThemeOptions: TypeOptionsTheme = {
  starCount: 3000,
  starColor: [21, 52, 251],
  backgroundColor: "snow",
};

const Themes = {
  dark: darkThemeOptions,
  light: lightThemeOptions,
  system: {
    dark: darkThemeOptions,
    light: lightThemeOptions,
  },
};

const Dashboard = () => {
  const { authUser } = useStoreUser();
  const { theme, systemTheme } = useTheme();

  const currentTheme = (theme ?? "dark") as "dark" | "light" | "system";

  const currentThemeOptions =
    currentTheme === "system"
      ? systemTheme
        ? Themes["system"][systemTheme]
        : Themes["dark"]
      : Themes[currentTheme];

  return (
    <div className="min-h-[calc(100svh-var(--header-height)-2px)] grid place-items-center relative overflow-hidden ">
      <Starfield
        starCount={currentThemeOptions.starCount}
        starColor={currentThemeOptions.starColor}
        speedFactor={0.005}
        backgroundColor={currentThemeOptions.backgroundColor}
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
