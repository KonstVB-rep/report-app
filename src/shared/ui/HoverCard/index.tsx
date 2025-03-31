import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { HoverCardArrow } from "@radix-ui/react-hover-card";
import React from "react";

type Props = {
  children: React.ReactNode;
  title: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  alignOffset?: number;
  className?: string;
};

const HoverCardComponent = ({
  children,
  title,
  align = "center",
  sideOffset = 2,
  className,
  ...props
}: Props) => {
  return (
    <HoverCard openDelay={50} closeDelay={150}>
      <HoverCardTrigger>
        <Button
          variant="outline"
          className="h-auto w-full items-center first-letter:capitalize"
        >
          {title}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className={`grid w-max gap-1 p-1 ${className}`}
        align={align}
        sideOffset={sideOffset}
        {...props}
      >
        <HoverCardArrow className="fill-popover" />
        {children}
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardComponent;
