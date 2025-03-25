import { User } from "@/entities/user/types";
import { CircleUserRound } from "lucide-react";
import React from "react";
import Contacts from "../Contacts";

type UserCardProps = {
  user: User;
  isLink?: boolean;
};

const UserCard = ({ user, isLink = false }: UserCardProps) => {
  const styles = isLink ? "border border-solid rounded-md" : "";

  return (
    <div className={`grid gap-2 p-3 ${styles} justify-items-center text-sm`}>
      <div className="grid w-full justify-items-center gap-2 p-2">
        <CircleUserRound size="80" />
        <p className="capitalize">{user.username.split(" ").join(" ")}</p>
        <p className="first-letter:capitalize">{user.position}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-md">
        <Contacts user={user} className="rounded-full" />
      </div>
    </div>
  );
};

export default UserCard;
