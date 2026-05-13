import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { selectSetVat } from "../store"

const vatData = [5, 22]

const SelectVat = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentTemplateName = searchParams.get("templateName") || ""

  useEffect(() => {
    if (currentTemplateName && vatData) {
      const selected = vatData.find((v) => String(v) === currentTemplateName)

      if (selected ?? !Number.isNaN(selected)) {
        selectSetVat(Number(selected))
      }
    }
  }, [currentTemplateName])

  const updateUrl = (name: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (name) {
      params.set("vat", name)
    } else {
      params.delete("vat")
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Select
      defaultValue={currentTemplateName || ""}
      onValueChange={(name) => {
        updateUrl(name)
      }}
      value={currentTemplateName || undefined}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="НДС" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>НДС</SelectLabel>
          {vatData?.map((value) => {
            return (
              <div
                className="flex items-center justify-between gap-1 hover:bg-muted px-1"
                key={value}
              >
                <SelectItem className="cursor-pointer" value={String(value)}>
                  {value} %
                </SelectItem>
              </div>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectVat
