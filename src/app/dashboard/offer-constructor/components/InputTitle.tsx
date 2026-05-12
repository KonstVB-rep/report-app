import { type ChangeEvent, useState } from "react"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"

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
      className={cn("w-full font-bold rounded-none", className)}
      onBlur={() => {
        if (title !== defaultTitle) {
          updateTitleAction(title)
        }
      }}
      onChange={handleSetTitle}
      type="text"
      value={title}
    />
  )
}

export default InputTitle
