"use client";

import React, { useState, PropsWithChildren, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

type DropdownWrapperProps = PropsWithChildren<{
  trigger: React.ReactNode;
  contentClassName?: string;
}> &
  DropdownMenuPrimitive.DropdownMenuProps;

const DropdownWrapper = ({
  children,
  trigger,
  contentClassName,
  ...props
}: DropdownWrapperProps) => {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenChange = (open: boolean) => {
    console.log("handleOpenChange");
    if (!isMobile) {
      if (open) {
        setIsOpen(true); // Открытие при наведение
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsOpen(false); // Закрытие с задержкой
        }, 200);
      }
    }
  };

  const handleMouseEnter = () => {
    console.log("handleMouseEnter");
    if (!isMobile) {
      clearTimeout(timeoutRef.current!); // Убираем любые предыдущие задержки
      setIsOpen(true); // Открытие меню при наведении
    }
  };

  const handleMouseLeave = () => {
    console.log("handleMouseLeave");
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false); // Закрытие с задержкой
      }, 200); // Можно настроить время задержки
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} {...props}>
      <DropdownMenuTrigger
        asChild
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        className={contentClassName}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownWrapper;
