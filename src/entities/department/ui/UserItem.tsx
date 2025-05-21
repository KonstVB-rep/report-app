import React, { memo } from "react";

import Link from "next/link";

import { TableProperties } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserResponse } from "@/entities/user/types";
import Contacts from "@/shared/ui/Contacts";
import DialogComponent from "@/shared/ui/DialogComponent";
import TooltipComponent from "@/shared/ui/TooltipComponent";

const UserItem = ({
  id,
  username,
  position,
  departmentId,
  email,
  phone,
}: UserResponse) => {
  if (departmentId === 1) {
    return (
      <>
        <li key={id} className="hidden sm:flex flex-wrap gap-2">
          <Link
            href={`/profile/${departmentId}/${id}`}
            className="flex w-full sm:w-60 flex-col items-center justify-center rounded-md border border-solid px-4 py-2"
            title={`${username.split(" ").join(" ").toUpperCase()} - Перейти в профиль`}
          >
            <span className="capitalize truncate overflow-hidden text-ellipsis whitespace-nowrap w-full text-center">
              {username.split(" ").join(" ")}
            </span>
            <span className="text-xs first-letter:capitalize">{position}</span>
          </Link>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="flex gap-2 overflow-hidden rounded-md shrink-0 w-full sm:w-auto">
              <Contacts email={email} phone={phone} className="rounded-md" />
            </div>

            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <TooltipComponent content="Перейти к проектам">
                <Link
                  href={`/table/${departmentId}/projects/${id}`}
                  className="h-14 flex flex-1 sm:aspect-square sm:max-w-fit items-center justify-center rounded-md border hover:bg-muted-foreground/50"
                  rel="noopener noreferrer"
                >
                  <TableProperties />
                </Link>
              </TooltipComponent>
              <TooltipComponent content="Перейти к розничным сделкам">
                <Link
                  href={`/table/${departmentId}/retails/${id}`}
                  className="h-14 flex flex-1 sm:aspect-square sm:max-w-fit items-center justify-center rounded-md border hover:bg-muted-foreground/50"
                  rel="noopener noreferrer"
                >
                  <TableProperties />
                </Link>
              </TooltipComponent>
            </div>
          </div>
        </li>

        <li className="sm:hidden">
          <DialogComponent
            classNameContent="rounded-md pt-10"
            contentTooltip={`${username.split(" ").join(" ").toUpperCase()} - Перейти в профиль`}
            trigger={
              <Button
                variant={"outline"}
                className="flex h-14 w-full sm:w-60 flex-col items-center justify-center rounded-md border border-solid px-4 py-2"
              >
                <span className="capitalize truncate overflow-hidden text-ellipsis whitespace-nowrap w-full text-center">
                  {username.split(" ").join(" ")}
                </span>
                <span className="text-xs first-letter:capitalize">
                  {position}
                </span>
              </Button>
            }
          >
            <Link
              href={`/profile/${departmentId}/${id}`}
              className="flex w-full sm:max-w-[300px] sm:w-60 flex-col items-center justify-center rounded-md border border-solid px-4 py-2"
              title={`${username.split(" ").join(" ").toUpperCase()} - Перейти в профиль`}
            >
              Перейти в профиль
            </Link>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="flex gap-2 overflow-hidden rounded-md shrink-0 w-full sm:w-auto">
                <Contacts email={email} phone={phone} className="rounded-md" />
              </div>

              <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                <TooltipComponent content="Перейти к проектам">
                  <Link
                    href={`/table/${departmentId}/projects/${id}`}
                    className="h-14 flex flex-1 sm:aspect-square sm:max-w-fit items-center justify-center rounded-md border hover:bg-muted-foreground/50"
                    rel="noopener noreferrer"
                  >
                    <TableProperties />
                  </Link>
                </TooltipComponent>
                <TooltipComponent content="Перейти к розничным сделкам">
                  <Link
                    href={`/table/${departmentId}/retails/${id}`}
                    className="h-14 flex flex-1 sm:aspect-square sm:max-w-fit items-center justify-center rounded-md border hover:bg-muted-foreground/50"
                    rel="noopener noreferrer"
                  >
                    <TableProperties />
                  </Link>
                </TooltipComponent>
              </div>
            </div>
          </DialogComponent>
        </li>
      </>
    );
  }
  if (departmentId === 2) {
    return (
      <>
        <li key={id} className="hidden sm:flex flex-wrap gap-2">
          <Link
            href={`/profile/${departmentId}/${id}`}
            className="flex w-full sm:w-60 flex-col items-center justify-center rounded-md border border-solid px-4 py-2"
            title={`${username.split(" ").join(" ").toUpperCase()} - Перейти в профиль`}
          >
            <span className="capitalize truncate overflow-hidden text-ellipsis whitespace-nowrap w-full text-center">
              {username.split(" ").join(" ")}
            </span>
            <span className="text-xs first-letter:capitalize">{position}</span>
          </Link>
          <div className="flex gap-2 overflow-hidden rounded-md shrink-0 w-full sm:w-auto">
            <Contacts email={email} phone={phone} className="rounded-md" />
          </div>
        </li>

        <li className="sm:hidden">
          <DialogComponent
            classNameContent="rounded-md pt-10"
            contentTooltip={`${username.split(" ").join(" ").toUpperCase()} - Перейти в профиль`}
            trigger={
              <Button
                variant={"outline"}
                className="flex h-14 w-full sm:w-60 flex-col items-center justify-center rounded-md border border-solid px-4 py-2"
              >
                <span className="capitalize truncate overflow-hidden text-ellipsis whitespace-nowrap w-full text-center">
                  {username.split(" ").join(" ")}
                </span>
                <span className="text-xs first-letter:capitalize">
                  {position}
                </span>
              </Button>
            }
          >
            <Link
              href={`/profile/${departmentId}/${id}`}
              className="flex w-full sm:max-w-[300px] sm:w-60 flex-col items-center justify-center rounded-md border border-solid px-4 py-2"
              title={`${username.split(" ").join(" ").toUpperCase()} - Перейти в профиль`}
            >
              Перейти в профиль
            </Link>

            <div className="flex gap-2 overflow-hidden rounded-md shrink-0 w-full sm:w-auto">
              <Contacts email={email} phone={phone} className="rounded-md" />
            </div>
          </DialogComponent>
        </li>
      </>
    );
  }
  return null;
};

export default memo(UserItem);
