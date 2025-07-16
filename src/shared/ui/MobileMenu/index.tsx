"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import React from "react";

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Check, Menu } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SummaryTableLink from "@/entities/deal/ui/SummaryTableLink";
import useStoreUser from "@/entities/user/store/useStoreUser";

import ProtectedByPermissions from "../Protect/ProtectedByPermissions";
import { cn } from "@/shared/lib/utils";

const namePagesByDealType = [DealType.PROJECT, DealType.RETAIL];

const ThemeValues: Record<string, string> = {
  light: "Светлая",
  dark: "Темная",
  system: "Системная",
};

const Themes = [
  { id: "light", value: "Светлая" },
  { id: "dark", value: "Темная" },
  { id: "system", value: "Системная" },
];

const MobileMenu = () => {
  const pathName = usePathname();
  const { authUser } = useStoreUser();
  const { setTheme, theme } = useTheme();

  const isSummaryTable = pathName?.includes("summary-table");

  const handleCheckTheme = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const id = e.currentTarget.id;
    setTheme(id);
  };

  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 md:hidden" align="start">
          {!isSummaryTable && (
            <>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="p-0">
                  <AccordionTrigger className="px-3 py-2 font-semibold">
                    <span>
                      <span className="capitalize">сводные</span> таблицы
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex pl-3 pt-2 flex-col gap-1 text-balance">
                    <ProtectedByPermissions
                      permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}
                    >
                      {namePagesByDealType.map((type) => (
                        <SummaryTableLink
                          type={type}
                          key={type}
                          departmentId="1"
                          className="px-3 py-2 rounded-md hover:bg-muted-foreground focus-visible:bg-muted-foreground hover:text-secondary focus-visible:text-secondary"
                        />
                      ))}
                    </ProtectedByPermissions>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <DropdownMenuSeparator className="bg-muted-foreground" />
            </>
          )}

          <DropdownMenuItem className="p-0">
            <Link
              href={`/dashboard/tasks/${authUser?.departmentId}/${authUser?.id}`}
              className="w-full px-3 py-2 font-semibold hover:bg-muted-foreground focus-visible:bg-muted-foreground hover:text-secondary focus-visible:text-secondary rounded-md"
            >
              Мои задачи
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <ProtectedByPermissions
              permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}
            >
              <Link
                href={`/dashboard/tasks/${authUser?.departmentId}`}
                className="w-full px-3 py-2 font-semibold hover:bg-muted-foreground focus-visible:bg-muted-foreground hover:text-secondary focus-visible:text-secondary rounded-md"
              >
                Все задачи
              </Link>
            </ProtectedByPermissions>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-muted-foreground" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-3 py-2 font-semibold">
                <span>
                  <span className="capitalize">Тема:</span>{" "}
                  <span className="text-blue-600">
                    {ThemeValues[theme as string]}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex pt-2 pl-3 flex-col gap-1 text-balance rounded-md ">
                {Themes.map((item) => {
                  const isCurrentTheme = theme === item.id
                  return (
                  <DropdownMenuItem
                    key={item.id}
                    id={item.id}
                    onClick={handleCheckTheme}
                    className="p-0"
                  >
                    <div className={cn("w-full px-3 py-2 cursor-pointer capitalize rounded-md hover:bg-muted-foreground focus-visible:bg-muted-foreground hover:text-secondary focus-visible:text-secondary",isCurrentTheme && "flex items-center justify-between")}>
                      {item.value}
                      {isCurrentTheme && <Check />}
                    </div>
                  </DropdownMenuItem>
                )})}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileMenu;
