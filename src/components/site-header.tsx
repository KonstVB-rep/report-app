"use client"

import { SidebarIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                Приложение
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Дашбоард</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        </div>
        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
        <ModeToggle/>
      </div>
    </header>
  )
}
