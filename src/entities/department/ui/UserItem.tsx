import { UserResponse } from "@/entities/user/types";
import TooltipComponent from "@/shared/ui/TooltipComponent";
import { Mail, Phone, TableProperties } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserItem = ({ person }: { person: UserResponse }) => {
  return (
    <li key={person.id} className="grid grid-cols-3 gap-2">
      <Link
        href={`/dashboard/profile/${person.id}`}
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
        <a
          href={`mailto:${person.email}`}
          className="flex items-center justify-center p-2 bg-muted hover:bg-muted-foreground/50"
          title="Написать письмо"
          rel="noopener noreferrer"
        >
          {" "}
          <Mail size="20" />
        </a>
        <a
          href={`tel:${person?.phone || ""}`}
          className="flex items-center justify-center p-2 bg-muted hover:bg-muted-foreground/50"
          title="Позвонить"
          rel="noopener noreferrer"
        >
          <Phone size="20" />
        </a>
        <a
          href={`https://wa.me/${person?.phone || ""}`}
          target="_blank"
          className="flex items-center justify-center p-2 bg-muted hover:bg-muted-foreground/50"
          title="Написать в WhatsApp"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144l-2.494.654l.666-2.433l-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931a6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646c-.182-.065-.315-.099-.445.099c-.133.197-.513.646-.627.775c-.114.133-.232.148-.43.05c-.197-.1-.836-.308-1.592-.985c-.59-.525-.985-1.175-1.103-1.372c-.114-.198-.011-.304.088-.403c.087-.088.197-.232.296-.346c.1-.114.133-.198.198-.33c.065-.134.034-.248-.015-.347c-.05-.099-.445-1.076-.612-1.47c-.16-.389-.323-.335-.445-.34c-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992c.47.205.84.326 1.129.418c.475.152.904.129 1.246.08c.38-.058 1.171-.48 1.338-.943c.164-.464.164-.86.114-.943c-.049-.084-.182-.133-.38-.232"
            ></path>
          </svg>
        </a>
      </div>

      <div className="flex gap-2">
        <TooltipComponent content="Перейти к проектам">
          <Link
            href={`/dashboard/table/projects/${person.id}`}
            className="border max-w-fit aspect-square flex items-center justify-center rounded-md hover:bg-muted-foreground/50"
            rel="noopener noreferrer"
          >
            <TableProperties />
          </Link>
        </TooltipComponent>
        <TooltipComponent content="Перейти к розничным сделкам">
          <Link
            href={`/dashboard/table/retails/${person.id}`}
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
