"use client";

import { memo, useState, useCallback } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

import { DepartmentLinks } from "./DepartmentLinks";
import LinkProfile from "./LinkProfile";

const DepartmentPersonsList = ({ item }: { item: DepartmentListItemType }) => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  // Простая проверка — мемоизация не нужна, так как простое сравнение
  const isActiveDepartment = item.id === Number(params.departmentId);

  // Мемоизируем обработчик, чтобы не создавать новую функцию на каждый рендер
  // и избежать лишних ререндеров дочерних компонентов, которые принимают эту функцию
  const handleDepartmentClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(item.url);
    },
    [router, item.url]
  );

  return (
    <Collapsible
      open={open}
      onOpenChange={() => setOpen((prev) => !prev)}
      asChild
    >
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          onClick={handleDepartmentClick} // Используем мемоизированную функцию
          className={clsx(
            "h-max border-2",
            isActiveDepartment &&
              "border-blue-600 text-primary dark:text-stone-400"
          )}
        >
          <div
            role="link"
            className={clsx(!item.icon && "grid gap-[2px]", "cursor-pointer")}
            style={{ width: "calc(100% - 45px)" }}
          >
            {item.icon ?? null}
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
                  className={clsx(
                    "h-max rounded-sm",
                    isActiveDepartment &&
                      "!h-full !w-full p-[6px] text-primary dark:text-stone-400"
                  )}
                />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub className="mr-auto mt-2 pr-1">
                {item.items.map((user) => {
                  const isActiveUser = user.id === params.userId;

                  return (
                    <SidebarMenuItem key={user.id}>
                      <SidebarMenuButton
                        asChild
                        tooltip={user.username}
                        className={clsx(
                          "h-max items-start",
                          isActiveUser &&
                            "bg-zinc-300 text-primary dark:bg-background"
                        )}
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
                                  {user.username}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  {user.position}
                                </span>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="grid w-full gap-1 p-2">
                              <DepartmentLinks
                                departmentId={user.departmentId}
                                user={user}
                                userId={params.userId as string}
                                dealType={params.dealType as string}
                                pathName={pathname}
                              />

                              <LinkProfile user={user} />
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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

export default memo(DepartmentPersonsList);
