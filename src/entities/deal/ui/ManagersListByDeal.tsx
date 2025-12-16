import { cn } from "@/shared/lib/utils"
import type { ManagerShortInfo } from "../types"

type ManagersListByDealProps = {
  managers?: ManagerShortInfo[]
  userId: string
}
const spanClass = "text-xs text-stone-600 dark:text-stone-400 flex items-center"

const ManagersListByDeal = ({ managers, userId }: ManagersListByDealProps) => {
  if (!managers || managers.length === 0) return null

  const responsible = managers.find((m) => m.id === userId)
  const assistants = managers.filter((m) => m.id !== userId)

  return (
    <div className="flex flex-wrap gap-2 divide-x divide-solid border-t border-b py-1">
      {responsible && (
        <div className="flex flex-col items-start justify-center gap-1 px-2 border-amber-400 border rounded-md">
          <span className={spanClass}>Ответственный менеджер</span>
          <span className="text-sm capitalize flex items-center">{responsible.managerName}</span>
          <span className={cn(spanClass, "first-letter:uppercase")}>{responsible.position}</span>
        </div>
      )}
      {assistants.map((m) => (
        <div
          className="flex flex-col items-start justify-center gap-1 px-2 border-accent-foreground border rounded-md"
          key={m.id}
        >
          <span className="text-sm capitalize">{m.managerName}</span>
          <span className={spanClass}>{m.position}</span>
        </div>
      ))}
    </div>
  )
}

export default ManagersListByDeal
