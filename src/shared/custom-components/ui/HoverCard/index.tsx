import type React from "react"
import { HoverCardArrow } from "@radix-ui/react-hover-card"
import { Button } from "@/shared/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/components/ui/hover-card"

type Props = {
  children: React.ReactNode
  title: React.ReactNode
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
  alignOffset?: number
  className?: string
}

const HoverCardComponent = ({
  children,
  title,
  align = "start",
  sideOffset = 2,
  className,
  ...props
}: Props) => {
  return (
    <HoverCard closeDelay={150} openDelay={50}>
      <HoverCardTrigger>
        <Button className="h-full w-full items-center first-letter:capitalize" variant="outline">
          {title}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        align={align}
        className={`grid w-max gap-1 p-1 ${className}`}
        sideOffset={sideOffset}
        {...props}
      >
        <HoverCardArrow className="fill-popover" />
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}

export default HoverCardComponent
