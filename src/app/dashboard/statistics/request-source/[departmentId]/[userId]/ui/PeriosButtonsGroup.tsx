"use client"

import type { MouseEvent } from "react"
import { Button } from "@/shared/components/ui/button"

type DateRangeParams = "week" | "month" | "year"

interface PeriodButtonsGroupProps {
  className?: string
  activeRange?: DateRangeParams | null
  handleClick: (e: MouseEvent<HTMLButtonElement>, id: DateRangeParams) => void
}

const PeriodButtonsGroup = ({
  className = "",
  handleClick,
  activeRange,
}: PeriodButtonsGroupProps) => {
  return (
    <div className={className}>
      {(["week", "month", "year"] as DateRangeParams[]).map((id) => (
        <Button
          className={`btn-active ${activeRange === id ? "border-2 border-primary" : ""}`}
          id={id}
          key={id}
          onClick={(e) => handleClick(e, id)}
          variant="outline"
        >
          {id === "week" ? "Неделя" : id === "month" ? "Месяц" : "Год"}
        </Button>
      ))}
    </div>
  )
}

export default PeriodButtonsGroup
