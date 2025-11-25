import type React from "react"
import type { Contact } from "../../deal/types"
import type { CardInfoType } from "../types"
import CardInfo from "./CardInfo"

const ContactCardInDealInfo: React.FC<{ contact: Contact }> = ({ contact }) => {
  const fields: {
    label: string
    value?: string | null
    type?: CardInfoType
  }[] = [
    { label: "Имя", value: contact.name, type: "name" },
    { label: "Должность", value: contact.position, type: "position" },
    { label: "Телефон", value: contact.phone, type: "phone" },
    { label: "Email", value: contact.email, type: "email" },
  ]

  return (
    <div className="grid flex-1 rounded-md border border-solid min-w-[240px]">
      <div className="flex items-start justify-start gap-4 p-2">
        <div className="text-md flex flex-col gap-1 items-start justify-start w-full">
          {fields
            .filter(({ value }) => value)
            .map(({ label, value, type }) => (
              <CardInfo
                classNameData="flex flex-wrap items-center"
                data={value}
                key={label}
                title={label}
                type={type}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default ContactCardInDealInfo
