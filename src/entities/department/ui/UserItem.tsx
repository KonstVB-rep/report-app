import { UserResponse } from "@/entities/user/types";
import Contacts from "@/shared/ui/Contacts";
import TooltipComponent from "@/shared/ui/TooltipComponent";
import { TableProperties } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserItem = ({ person }: { person: UserResponse }) => {
  return (
    <li key={person.id} className="grid grid-cols-3 gap-2">
      <Link
        href={`/profile/${person.id}`}
        className="flex flex-col items-center justify-center px-4 py-2 rounded-md border border-solid"
        title="Перейти в профиль"
      >
        <span className="capitalize">
          {person.username.split(" ").join(" ")}
        </span>
        <span className="first-letter:capitalize text-xs">
          {person.position}
        </span>
      </Link>
      <div className="grid grid-cols-3 gap-[2px] rounded-md overflow-hidden">
        <Contacts user={person} className="rounded-md"/>
      </div>

      <div className="flex gap-2">
        <TooltipComponent content="Перейти к проектам">
          <Link
            href={`/table/projects/${person.id}`}
            className="border max-w-fit aspect-square flex items-center justify-center rounded-md hover:bg-muted-foreground/50"
            rel="noopener noreferrer"
          >
            <TableProperties />
          </Link>
        </TooltipComponent>
        <TooltipComponent content="Перейти к розничным сделкам">
          <Link
            href={`/table/retails/${person.id}`}
            className="border max-w-fit aspect-square flex items-center justify-center rounded-md hover:bg-muted-foreground/50"
            rel="noopener noreferrer"
          >
            <TableProperties />
          </Link>
        </TooltipComponent>
      </div>
    </li>
  );
};

export default UserItem;
