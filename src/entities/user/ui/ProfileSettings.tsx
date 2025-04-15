"use client";

import React from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import { EllipsisVertical, UserRound } from "lucide-react";

import HoverCardComponent from "@/shared/ui/HoverCard";

import { User } from "../types";

const PersonEdit = dynamic(() => import("./PersonTableEdit"), { ssr: false });

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
      <PersonEdit />
      <Link
        href={`/profile/${user.departmentId}/${user.id}`}
        className="btn_hover text-sm"
      >
        <UserRound size="16" /> <span>Профиль</span>
      </Link>
    </HoverCardComponent>
  );
}

export default ProfileSettings;
