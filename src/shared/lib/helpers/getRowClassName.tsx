export const getRowClassName = (dealStatus?: string) => {
  const baseClass = "tr hover:bg-zinc-600 hover:text-white relative flex"
  if (!dealStatus) return baseClass

  const statusMap: Record<string, string> = {
    CLOSED: "bg-green-950/50 dark:bg-green-950/30",
    REJECT: "bg-red-900/40 dark:bg-red-900/40 opacity-80",
    PAID: "bg-green-100 dark:bg-lime-200/20",
    PROGRESS: "bg-amber-900/40 dark:bg-amber-900/40 opacity-80",
  }

  return `${baseClass} ${statusMap[dealStatus] || ""}`
}
