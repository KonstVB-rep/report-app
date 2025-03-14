import { User } from "@/entities/user/types";
import { CircleUserRound, Mail, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

type UserCardProps = {
  user: User;
  isLink?: boolean;
};

const UserCard = ({ user, isLink = false }: UserCardProps) => {
  const styles = isLink ? "border border-solid rounded-md" : "";

  return (
    <div className={`grid gap-4 p-3 ${styles} justify-items-center`}>
      {isLink ? (
        <Link
          href={`/dashboard/profile/${user.id}`}
          className="w-full grid gap-2 p-3 justify-items-center border border-transparent hover:border-muted-foreground rounded-md"
          title="Перейти к сотруднику"
        >
          <CircleUserRound size="80" />
          <p className="capitalize">{user.username.split(" ").join(" ")}</p>
          <p className="first-letter:capitalize">{user.position}</p>
        </Link>
      ) : (
        <div className="w-full grid gap-2 p-3 justify-items-center">
          <CircleUserRound size="80" />
          <p className="capitalize">{user.username.split(" ").join(" ")}</p>
          <p className="first-letter:capitalize">{user.position}</p>
        </div>
      )}
      <div className="grid grid-cols-3 divide-x-2 divide-accent-foreground rounded-md overflow-hidden">
        <a
          href={`mailto:${user.email}`}
          className="flex items-center justify-center p-2 bg-muted hover:bg-muted-foreground/50"
        >
          {" "}
          <Mail size="32" />
        </a>
        <a
          href={`tel:${user?.phone || ""}`}
          className="flex items-center justify-center p-2 bg-muted hover:bg-muted-foreground/50"
        >
          <Phone size="32" />
        </a>
        <a
          href={`https://wa.me/${user?.phone || ""}`}
          target="_blank"
          className="flex items-center justify-center p-2 bg-muted hover:bg-muted-foreground/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144l-2.494.654l.666-2.433l-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931a6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646c-.182-.065-.315-.099-.445.099c-.133.197-.513.646-.627.775c-.114.133-.232.148-.43.05c-.197-.1-.836-.308-1.592-.985c-.59-.525-.985-1.175-1.103-1.372c-.114-.198-.011-.304.088-.403c.087-.088.197-.232.296-.346c.1-.114.133-.198.198-.33c.065-.134.034-.248-.015-.347c-.05-.099-.445-1.076-.612-1.47c-.16-.389-.323-.335-.445-.34c-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992c.47.205.84.326 1.129.418c.475.152.904.129 1.246.08c.38-.058 1.171-.48 1.338-.943c.164-.464.164-.86.114-.943c-.049-.084-.182-.133-.38-.232"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default UserCard;
