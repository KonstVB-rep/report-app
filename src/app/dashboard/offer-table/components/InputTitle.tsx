import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"
import { ChangeEvent, useState } from "react"

const InputTitle = ({
  defaultTitle,
  updateTitleAction,
  className,
}: {
  defaultTitle: string
  updateTitleAction: (title: string) => void
  className?: string
}) => {
  const [title, setTitle] = useState(defaultTitle || "")

  const handleSetTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim()
    setTitle(val)
  }
  return (
    <Input
      type="text"
      className={cn("w-full font-bold rounded-none", className)}
      value={title}
      onChange={handleSetTitle}
      onBlur={() => {
        if (title !== defaultTitle) {
          updateTitleAction(title)
        }
      }}
    />
  )
}

export default InputTitle
