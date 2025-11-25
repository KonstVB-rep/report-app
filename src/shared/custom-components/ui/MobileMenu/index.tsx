"use client"

import type React from "react"
import { DealType, PermissionEnum } from "@prisma/client"
import { Check, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import SummaryTableLink from "@/entities/deal/ui/SummaryTableLink"
import useStoreUser from "@/entities/user/store/useStoreUser"
import LogoutDialog from "@/feature/auth/ui/logout-dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { cn } from "@/shared/lib/utils"
import ProtectedByPermissions from "../Protect/ProtectedByPermissions"

const namePagesByDealType = [DealType.PROJECT, DealType.RETAIL]

const ThemeValues: Record<string, string> = {
  light: "Светлая",
  dark: "Темная",
  system: "Системная",
}

const Themes = [
  { id: "light", value: "Светлая" },
  { id: "dark", value: "Темная" },
  { id: "system", value: "Системная" },
]

const MobileMenu = () => {
  const pathName = usePathname()
  const { authUser } = useStoreUser()
  const { setTheme, theme } = useTheme()

  const isSummaryTable = pathName?.includes("summary-table")

  const handleCheckTheme = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const id = e.currentTarget.id
    setTheme(id)
  }

  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {!isSummaryTable && (
            <>
              <Accordion className="w-full" collapsible type="single">
                <AccordionItem className="p-0" value="item-1">
                  <AccordionTrigger className="px-3 py-2 font-semibold">
                    <span>
                      <span className="capitalize">сводные</span> таблицы
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex pl-3 pt-2 flex-col gap-1 text-balance">
                    <ProtectedByPermissions permission={PermissionEnum.VIEW_UNION_REPORT}>
                      {namePagesByDealType.map((type) => (
                        <SummaryTableLink
                          className="px-3 py-2 rounded-md hover:bg-muted-foreground focus-visible:bg-muted-foreground hover:text-secondary focus-visible:text-secondary"
                          departmentId="1"
                          key={type}
                          type={type}
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
              className="w-full px-3 py-2 font-semibold hover:bg-muted-foreground focus-visible:bg-muted-foreground hover:text-secondary focus-visible:text-secondary rounded-md"
              href={`/dashboard/tasks/${authUser?.departmentId}/${authUser?.id}`}
              prefetch={false}
            >
              Мои задачи
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <ProtectedByPermissions permission={PermissionEnum.VIEW_UNION_REPORT}>
              <Link
                className="w-full px-3 py-2 font-semibold hover:bg-muted-foreground focus-visible:bg-muted-foreground hover:text-secondary focus-visible:text-secondary rounded-md"
                href={`/dashboard/tasks/${authUser?.departmentId}`}
                prefetch={false}
              >
                Все задачи
              </Link>
            </ProtectedByPermissions>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-muted-foreground" />
          <Accordion className="w-full" collapsible type="single">
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-3 py-2 font-semibold">
                <span>
                  <span className="capitalize">Тема:</span>{" "}
                  <span className="text-blue-600">{ThemeValues[theme as string]}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex pt-2 pl-3 flex-col gap-1 text-balance rounded-md ">
                {Themes.map((item) => {
                  const isCurrentTheme = theme === item.id
                  return (
                    <DropdownMenuItem
                      className="p-0"
                      id={item.id}
                      key={item.id}
                      onClick={handleCheckTheme}
                    >
                      <div
                        className={cn(
                          "w-full px-3 py-2 cursor-pointer capitalize rounded-md hover:bg-muted-foreground focus-visible:bg-muted-foreground hover:text-secondary focus-visible:text-secondary",
                          isCurrentTheme && "flex items-center justify-between",
                        )}
                      >
                        {item.value}
                        {isCurrentTheme && <Check />}
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <DropdownMenuItem asChild>
            <LogoutDialog />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default MobileMenu
