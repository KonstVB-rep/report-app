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
      <div className="w-full grid gap-2 p-2 justify-items-center">
        <CircleUserRound size="80" />
        <p className="capitalize">{user.username.split(" ").join(" ")}</p>
        <p className="first-letter:capitalize">{user.position}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 rounded-md overflow-hidden">
        <Contacts user={user} className="rounded-full"/>
      </div>
    </div>
  );
};

export default UserCard;
