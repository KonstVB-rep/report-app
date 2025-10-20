import { cn } from "@/shared/lib/utils"
import type { ManagerShortInfo } from "../types"

type ManagersListByDealProps = {
  managers?: ManagerShortInfo[]
  userId: string
}
const spanClass = "text-xs text-stone-600 dark:text-stone-400"

const ManagersListByDeal = ({ managers, userId }: ManagersListByDealProps) => {
  if (!managers || managers.length === 0) return null

  const responsible = managers.find((m) => m.id === userId)
  const assistants = managers.filter((m) => m.id !== userId)

  return (
    <div className="flex flex-wrap gap-2 divide-x divide-solid">
      {responsible && (
        <div className="grid px-2">
          <span className={spanClass}>Ответственный менеджер</span>
          <span className="text-sm capitalize">{responsible.managerName}</span>
          <span className={cn(spanClass, "first-letter:uppercase")}>{responsible.position}</span>
        </div>
      )}
      {assistants.map((m) => (
        <div className="grid  px-2" key={m.id}>
          <span className="text-sm capitalize">{m.managerName}</span>
          <span className={spanClass}>{m.position}</span>
        </div>
      ))}
    </div>
  )
}

export default ManagersListByDeal
