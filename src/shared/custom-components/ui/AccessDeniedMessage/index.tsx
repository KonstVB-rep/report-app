import { ShieldAlert } from "lucide-react"

interface AccessDeniedMessageProps {
  error?: {
    message: string
  }
}

const AccessDeniedMessage = ({ error }: AccessDeniedMessageProps) => {
  return (
    <section className="relative flex h-full flex-col items-center justify-center gap-5 p-4">
      <ShieldAlert className="h-56 w-56 opacity-10" strokeWidth={1.25} />
      <h1 className="relative z-1 rounded-md bg-muted p-5 text-center text-xl font-bold first-letter:capitalize">
        {error ? error?.message : "Неизвестная ошибка"}
      </h1>
    </section>
  )
}

export default AccessDeniedMessage

AccessDeniedMessage.displayName = "AccessDeniedMessage"
