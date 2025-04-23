"use client";

import {  useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams, usePathname } from "next/navigation";

import { ChevronRight, UserRound } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {

  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  DepartmentLabels,
  DepartmentListItemType,
} from "@/entities/department/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { DepartmentLinks } from "./DepartmentLinks";

const DepartmentPersonsList = ({ item }: { item: DepartmentListItemType }) => {
  const { departmentId, userId, dealType } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Collapsible
      key={item?.id || item.title}
      asChild
      open={open}
      onOpenChange={handleToggle}
    >
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          onClick={handleToggle}
          className={`h-max border-2 ${
            item.id === Number(departmentId) &&
            "border-blue-600 text-primary dark:text-stone-400"
          }`}
          onClickCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(item.url);
          }}
        >
          <div
            role="link"
            className={`${!item.icon && "grid gap-[2px]"}} cursor-pointer`}
            style={{ width: "calc(100% - 45px)" }}
          >
            {item?.icon ?? null}
            <span className="text-primary">
              {DepartmentLabels[item.title as keyof typeof DepartmentLabels]}
            </span>
          </div>
        </SidebarMenuButton>
        {item.items?.length ? (
          <>
            <CollapsibleTrigger
              asChild
              className="!top-[1.25px] !h-[38px] !w-[38px] !border-[1px] border-stone-400"
            >
              <SidebarMenuAction className="h-[24px] w-[24px] border-2 data-[state=open]:rotate-90">
                <ChevronRight
                  className={`h-max ${
                    item.id === Number(departmentId) &&
                    "!h-full !w-full p-[6px] text-primary dark:text-stone-400"
                  } rounded-sm`}
                />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="mr-auto mt-2 pr-1">
                {item.items.map((user) => {
                  return (
                    <Collapsible key={user?.id} asChild>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={user.username}
                          className={`h-max items-start ${
                            user.id === userId &&
                            "bg-zinc-300 text-primary dark:bg-background"
                          }`}
                        >
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full !pr-1"
                          >
                            <AccordionItem
                              value="item-1"
                              className="group/item w-full border-none"
                            >
                              <AccordionTrigger className="mr-[2px] w-full py-1 hover:no-underline">
                                <div className="relative flex flex-col gap-[2px]">
                                  <span className="font-semibold capitalize">
                                    {user.username.split(" ").join(" ")}
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    {user.position}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="grid w-full gap-1 pb-1 pr-1 pt-1">

                                <DepartmentLinks
                                  departmentId={user.departmentId}
                                  user={user}
                                  userId={userId as string}
                                  dealType={dealType as string}
                                  pathName={pathname}
                                />
                                <Link
                                  href={`/profile/${user.departmentId}/${user.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className={`${
                                    (pathname !==
                                      `/profile/${user.departmentId}/${user.id}` ||
                                      user.id !== userId) &&
                                    "text-primary dark:text-stone-400"
                                  } relative flex items-center gap-2 overflow-hidden rounded-md p-1 text-foreground transition-all duration-150 hover:bg-muted focus-visible:bg-muted focus-visible:text-foreground`}
                                >
                                  <p className="relative z-[1] flex h-full w-full items-center gap-2 rounded-sm p-2 transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground">
                                    <UserRound
                                      size={
                                        pathname !==
                                          `/profile/${user.departmentId}/${user.id}` ||
                                        user.id !== userId
                                          ? 12
                                          : 16
                                      }
                                    />{" "}
                                    <span>Профиль</span>
                                  </p>
                                  {pathname ===
                                    `/profile/${user.departmentId}/${user.id}` &&
                                    user.id === userId && (
                                      <div className="absolute right-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-md bg-blue-600" />
                                    )}
                                </Link>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default DepartmentPersonsList;
