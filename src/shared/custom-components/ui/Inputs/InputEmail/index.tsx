import type React from "react"
import { Input } from "@/shared/components/ui/input"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const InputEmail = (props: InputProps) => {
  return (
    <Input
      {...props}
      className={`w-full ${props.className}`}
      placeholder="m@example.com"
      type="email"
    />
  )
}

export default InputEmail
