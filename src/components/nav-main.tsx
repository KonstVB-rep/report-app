"use client";

import { ChevronRight } from "lucide-react";

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


export function NavMain({
  items,
}: {
  items: DepartmentListType[]
}) {

  const { departmentId} = useParams();


  const render = (item: (typeof items)[number]) => {
    return (
      <Collapsible
        key={item?.id || item.title}
        asChild
      >
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={item.title} className={`h-max ${item.id === Number(departmentId) && "text-secondary bg-secondary-foreground"}`}>
            <Link href={item.url} className={`${!item.icon && "grid gap-[2px]"}`}>
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
                  <ChevronRight className={`h-max ${item.id === Number(departmentId) && "text-secondary bg-secondary-foreground"} rounded-sm`}/>
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="mr-auto pr-1">
                  {item.items.map((user) => {
                    return (
                      <Collapsible
                        key={user?.id}
                        asChild
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            tooltip={user.username}
                            className="h-max items-start"
                          >
                            <Link
                              href={user.url}
                              className="flex flex-col gap-[2px]"
                            >
                              <span className="capitalize font-semibold">
                                {user.username.split(" ").join(" ")}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {user.position}
                              </span>
                            </Link>
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
