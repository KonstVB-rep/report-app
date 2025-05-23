"use client";

import React from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import { EllipsisVertical, UserRound } from "lucide-react";

import HoverCardComponent from "@/shared/ui/HoverCard";

import { User } from "../types";

const PersonEdit = dynamic(() => import("./PersonTableEdit"), {
  ssr: false,
  loading: () => <div className="btn_hover animate-pulse h-10" />,
});

type Props = {
  user: User;
};

export function ProfileSettings({ user }: Props) {
  return (
    <HoverCardComponent
      title={
        <span className="flex w-full items-center gap-2 capitalize">
          <EllipsisVertical className="mr-2 h-4 w-4" />
          {user.username.split(" ").join(" ")}
        </span>
      }
    >
      <Link
        href={`/profile/${user.departmentId}/${user.id}`}
        className="btn_hover text-sm"
      >
        <UserRound size="16" /> <span>Профиль пользователя</span>
      </Link>

      <PersonEdit />
    </HoverCardComponent>
  );
}

export default ProfileSettings;
