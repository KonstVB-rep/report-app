import { UserResponse } from "@/entities/user/types";
import Contacts from "@/shared/ui/Contacts";
import TooltipComponent from "@/shared/ui/TooltipComponent";
import { TableProperties } from "lucide-react";
import Link from "next/link";
import React, { memo } from "react";


const UserItem = ({ id, username, position, departmentId, email, phone }: UserResponse ) => {
  return (
    <li key={id} className="grid grid-cols-3 gap-2">
      <Link
        href={`/profile/${id}`}
        className="flex flex-col items-center justify-center rounded-md border border-solid px-4 py-2"
        title="Перейти в профиль"
      >
        <span className="capitalize">
          {username.split(" ").join(" ")}
        </span>
        <span className="text-xs first-letter:capitalize">
          {position}
        </span>
      </Link>
      <div className="grid grid-cols-3 gap-[2px] overflow-hidden rounded-md">
        <Contacts email={email} phone={phone} className="rounded-md" />
      </div>

      <div className="flex gap-2">
        <TooltipComponent content="Перейти к проектам">
          <Link
            href={`/table/${departmentId}/projects/${id}`}
            className="flex aspect-square max-w-fit items-center justify-center rounded-md border hover:bg-muted-foreground/50"
            rel="noopener noreferrer"
          >
            <TableProperties />
          </Link>
        </TooltipComponent>
        <TooltipComponent content="Перейти к розничным сделкам">
          <Link
            href={`/table/${departmentId}/retails/${id}`}
            className="flex aspect-square max-w-fit items-center justify-center rounded-md border hover:bg-muted-foreground/50"
            rel="noopener noreferrer"
          >
            <TableProperties />
          </Link>
        </TooltipComponent>
      </div>
    </li>
  );
};

export default memo(UserItem);
