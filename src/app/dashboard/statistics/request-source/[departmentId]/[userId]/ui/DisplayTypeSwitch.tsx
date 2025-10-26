"use client"

import { ChartColumnBig, ChartPie } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

interface DisplayTypeSwitchProps {
  activeType: string
  onChange: (type: string) => void
}

export default function DisplayTypeSwitch({ activeType, onChange }: DisplayTypeSwitchProps) {
  const isCircle = activeType === "circle"
  const isGraph = activeType === "graph"

  return (
    <div className="gap-2 hidden sm:flex">
      <Button
        id="circle"
        onClick={() => onChange("circle")}
        size="icon"
        title="Круговая диаграмма"
        variant={isCircle ? "default" : "outline"}
      >
        <ChartPie />
      </Button>
      <Button
        id="graph"
        onClick={() => onChange("graph")}
        size="icon"
        title="График"
        variant={isGraph ? "default" : "outline"}
      >
        <ChartColumnBig />
      </Button>
    </div>
  )
}
