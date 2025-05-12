"use client";

import Link from "next/link";

import { CalendarClock, SidebarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import useStoreUser from "@/entities/user/store/useStoreUser";

export function SiteHeader() {
  const { authUser } = useStoreUser();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-4">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Открыть/закрыть боковую панель"
          >
            <SidebarIcon />
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" asChild className="w-12 h-12">
            <Link href={`/calendar/${authUser?.id}`} title="Календарь">
              <CalendarClock />
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
