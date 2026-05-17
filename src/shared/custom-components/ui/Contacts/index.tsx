import { Mail, Phone } from "lucide-react"

type Props = {
  email: string
  phone: string
  className: string
}

const Contacts = ({ email, phone, className }: Props) => {
  const baseClass = `flex h-14 flex-1 shrink-0 sm:aspect-square items-center justify-center border border-solid border-transparent bg-muted p-2.5 ${className}`

  return (
    <>
      {email && (
        <a
          className={`${baseClass} hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background`}
          href={`mailto:${email}`}
        >
          <Mail size="24" />
        </a>
      )}

      {phone && (
        <a
          className={`${baseClass} hover:bg-blue-600 hover:text-white focus-visible:bg-blue-600 focus-visible:text-white`}
          href={`tel:+${phone.replace(/[^0-9]/g, "")}`}
        >
          <Phone size="24" />
        </a>
      )}
    </>
  )
}

export default Contacts
