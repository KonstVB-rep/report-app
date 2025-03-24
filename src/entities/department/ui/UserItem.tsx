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
        className="flex flex-col items-center justify-center rounded-md border border-solid px-4 py-2"
        title="Перейти в профиль"
      >
        <span className="capitalize">
          {person.username.split(" ").join(" ")}
        </span>
        <span className="text-xs first-letter:capitalize">
          {person.position}
        </span>
      </Link>
      <div className="grid grid-cols-3 gap-[2px] overflow-hidden rounded-md">
        <Contacts user={person} className="rounded-md" />
      </div>

      <div className="flex gap-2">
        <TooltipComponent content="Перейти к проектам">
          <Link
            href={`/table/${person.departmentId}/projects/${person.id}`}
            className="flex aspect-square max-w-fit items-center justify-center rounded-md border hover:bg-muted-foreground/50"
            rel="noopener noreferrer"
          >
            <TableProperties />
          </Link>
        </TooltipComponent>
        <TooltipComponent content="Перейти к розничным сделкам">
          <Link
            href={`/table/${person.departmentId}/retails/${person.id}`}
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

export default UserItem;
