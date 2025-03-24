"use client";

import { EllipsisVertical, UserRound } from "lucide-react";
import React from "react";
import { User } from "../types";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

import Link from "next/link";
import PersonEdit from "./PersonTableEdit";
import HoverCardComponent from "@/shared/ui/HoverCard";

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
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="outline" className="flex gap-2 capitalize">
    //       <EllipsisVertical className="mr-2 h-4 w-4" />
    //       {user.username.split(" ").join(" ")}
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent
    //     className="w-56 grid gap-1"
    //     align="start"
    //     onFocusOutside={(e) => e.preventDefault()}
    //   >
    //     <PersonEdit />
    //     <Link
    //       href={`/dashboard/profile/${user.id}`}
    //       className="btn_hover text-sm"
    //     >
    //       <UserRound size="16" /> <span>Профиль</span>
    //     </Link>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}

export default ProfileSettings;
