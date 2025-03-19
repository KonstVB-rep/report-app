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
  classname?: string;
};

const HoverCardComponent = ({ children, title,align = "center",sideOffset = 2,classname, ...props }: Props) => {
  return (
    <HoverCard openDelay={50} closeDelay={150} >
      <HoverCardTrigger >
        <Button variant="outline" className="first-letter:capitalize w-full h-auto items-center">
          {title}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className={`p-1 grid gap-1 w-max ${classname}`}
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
