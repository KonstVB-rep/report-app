"use client"

import React from "react"
import { Eye, EyeClosed } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement>
const InputPassword = (props: InputPasswordProps) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        className={`w-full placeholder:text-sm ${props.className}`}
        id="user_password"
        placeholder="✱✱✱✱✱✱✱"
        {...props}
        type={visible ? "text" : "password"}
      />
      <Button
        aria-label="Переключить видимость пароля"
        className="absolute bottom-[2px] right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
        onClick={() => setVisible(!visible)}
        size={"icon"}
        type="button"
        variant="ghost"
      >
        {visible ? <Eye /> : <EyeClosed />}
      </Button>
    </div>
  )
}

export default InputPassword
