import type React from "react"
import { Loader } from "lucide-react"
import { useFormStatus } from "react-dom"
import { Button } from "@/shared/components/ui/button"

type SubmitButtonProps = {} & React.ComponentProps<"button">

const SubmitFormActionBtn = ({ title, ...props }: SubmitButtonProps) => {
  const { pending } = useFormStatus()
  return (
    <Button
      aria-label="Отправить форму"
      className="flex w-full items-center"
      type="submit"
      {...props}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader className="h-5 w-5 animate-spin" /> Выполнение...
        </span>
      ) : (
        title
      )}
    </Button>
  )
}

export default SubmitFormActionBtn
