"use client";

import { BookText, ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { DepartmentsTitle } from "@/entities/user/model/objectTypes";

import DialogAddUser from "@/entities/user/ui/DialogAddUser";
import Link from "next/link";
import { DepartmentListType } from "@/entities/department/types";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Separator } from "@radix-ui/react-separator";

export function NavMain({ items }: { items: DepartmentListType[] }) {
  const { departmentId, userId } = useParams();

  const render = (item: (typeof items)[number]) => {
    return (
      <Collapsible key={item?.id || item.title} asChild>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            className={`h-max ${
              item.id === Number(departmentId) &&
              "text-secondary bg-secondary-foreground"
            }`}
          >
            <Link
              href={item.url}
              className={`${!item.icon && "grid gap-[2px]"}`}
            >
              {item.icon && item.icon}
              <span>
                {DepartmentsTitle[item.title as keyof typeof DepartmentsTitle]}
              </span>
            </Link>
          </SidebarMenuButton>
          {item.items?.length ? (
            <>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="data-[state=open]:rotate-90 border-2 h-[24px] w-[24px]">
                  <ChevronRight
                    className={`h-max ${
                      item.id === Number(departmentId) &&
                      "text-secondary bg-secondary-foreground"
                    } rounded-sm`}
                  />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="mr-auto pr-1">
                  {item.items.map((user) => {
                    return (
                      <Collapsible key={user?.id} asChild>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            tooltip={user.username}
                            className={`h-max items-start ${
                              user.id === userId &&
                              "text-primary bg-sidebar-primary"
                            }`}
                          >
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full !pr-1"
                            >
                              <AccordionItem
                                value="item-1"
                                className="w-full border-none group/item"
                              >
                                <AccordionTrigger className="w-full hover:no-underline py-1">
                                  <div className="relative flex flex-col gap-[2px] hover:bg-transparent focus-visible:bg-transparent">
                                    <span className="capitalize font-semibold">
                                      {user.username.split(" ").join(" ")}
                                    </span>
                                    <span className="text-xs text-zinc-500">
                                      {user.position}
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="w-full pt-1 pb-1 pr-1 grid gap-1">
                                  <Link
                                    href={`${user.url}projects/${user.id}`}
                                    className="text-primary p-2 flex items-center gap-2 rounded-md hover:bg-muted hover:text-foreground transition-all duration-150 focus-visible:bg-muted focus-visible:text-foreground
                                   "
                                  >
                                    <BookText size={12} />
                                    Проекты
                                  </Link>
                                  <Separator className="my-[1px] bg-stone-600 h-[1px]" />
                                  <Link
                                    href={`${user.url}retails/${user.id}`}
                                    className="text-primary p-2 flex gap-2 items-center rounded-md hover:bg-muted hover:text-foreground transition-all duration-150 focus-visible:bg-muted focus-visible:text-foreground
                                   "
                                  >
                                    <BookText size={12} />
                                    Розница
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

  return (
    <SidebarGroup className="grid gap-4 h-full grid-rows-[1fr_auto]">
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>{items.map(render)}</SidebarMenu>
      <DialogAddUser />
    </SidebarGroup>
  );
}
