import CardInfo from "./CardInfo"

const CardMainContact = ({
  contact,
  phone,
  email,
}: {
  contact: string
  phone: string | null
  email: string | null | undefined
}) => {
  const fields: {
    label: string
    value?: string | null
    type: "name" | "phone" | "email"
  }[] = [
    { label: "Имя", value: contact, type: "name" },
    { label: "Телефон", value: phone, type: "phone" },
    { label: "Email", value: email, type: "email" },
  ]
  return (
    <div className="grid w-full">
      <div className="flex items-center justify-start gap-4">
        <div className="w-full flex flex-col items-start justify-start text-md gap-2">
          {fields.map(({ label, value, type }) => (
            <CardInfo
              classNameData="flex items-center gap-4"
              data={value}
              key={label}
              title={label}
              type={type || undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardMainContact
