import React, { memo } from "react";

import { CircleUserRound } from "lucide-react";

import Contacts from "../Contacts";

type UserCardProps = {
  email: string;
  phone: string;
  username: string;
  position: string;
  isLink?: boolean;
};

const UserCard = ({
  email,
  phone,
  username,
  position,
  isLink = false,
}: UserCardProps) => {
  const styles = isLink ? "border border-solid rounded-md" : "";

  return (
    <div
      className={`grid gap-2 p-3 ${styles} justify-items-center text-sm h-full`}
    >
      <div className="grid w-full justify-items-center gap-2 p-2">
        <CircleUserRound size="80" />

        <p className="capitalize">{username.split(" ").join(" ")}</p>

        <p className="first-letter:capitalize">{position}</p>
      </div>
      <div className="flex gap-2 overflow-hidden rounded-md w-full items-center">
        <Contacts email={email} phone={phone} className="rounded-full" />
      </div>
    </div>
  );
};

export default memo(UserCard);
