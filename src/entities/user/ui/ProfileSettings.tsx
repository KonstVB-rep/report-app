"use client";

import React from "react";

import Link from "next/link";

import { UserRound } from "lucide-react";

import { User } from "../types";

type Props = {
  user: User;
};

export function ProfileSettings({ user }: Props) {
  return (
    <Link
      href={`/dashboard/profile/${user.departmentId}/${user.id}`}
      className="btn_hover text-sm"
      aria-label={`Перейти в профиль пользователя ${user.username}`}
      title={`Перейти в профиль пользователя ${user.username}`}
    >
      <UserRound size="16" />{" "}
      <span className="flex w-full items-center gap-2 capitalize">
        {user.username}
      </span>
    </Link>
  );
}

export default ProfileSettings;
