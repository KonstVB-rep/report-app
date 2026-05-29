import { useEffect } from "react"
import { PowerOff, Trash2 } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import { useDeleteOfferTemplate } from "../hooks/mutate"
import { useGetOfferTemplates } from "../hooks/query"
import { selectSetData } from "../store"

const SelectOfferTemplate = () => {
  const { data } = useGetOfferTemplates()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentTemplateName = searchParams.get("templateName") || ""

  useEffect(() => {
    if (currentTemplateName && data) {
      const selected = data.find((t) => t.name === currentTemplateName)
      if (selected) {
        const dataParse = JSON.parse(selected.json)
        selectSetData({
          ...dataParse,
          date: new Date(dataParse.date),
        })
      }
    }
  }, [currentTemplateName, data])

  const updateUrl = (name: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (name === "reset") {
      params.delete("templateName")
      selectSetData({
        date: new Date(),
        number: "",
        parts: [],
        vat: 5,
      })
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
      return
    }
    if (name) {
      params.set("templateName", name)
    } else {
      params.delete("templateName")
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (!data || data?.length === 0) return null

  return (
    <Select
      defaultValue={currentTemplateName || ""}
      onValueChange={(name) => {
        updateUrl(name)
      }}
      value={currentTemplateName || undefined}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Выберите шаблон" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Выберите шаблон</SelectLabel>
          {data?.map((t) => {
            return <SelectItemOfferTemplate id={t.id} key={t.id} name={t.name} />
          })}
          <SelectSeparator />
          <SelectItem className="cursor-pointer" value="reset">
            <span className="flex gap-2">
              <PowerOff size={16} />
              <span>Сбросить шаблон</span>
            </span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectOfferTemplate

const SelectItemOfferTemplate = ({ id, name }: { id: string; name: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { mutate: delOfferTemplate, isPending: isPendingDelete } = useDeleteOfferTemplate()
  const deleteOfferTemplate = (id: string, name: string) => {
    delOfferTemplate(id)
    const params = new URLSearchParams(searchParams.toString())
    if (params.get("templateName") === name) {
      params.delete("templateName")
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }
  return (
    <div className="flex items-center justify-between gap-1 hover:bg-muted px-1" key={id}>
      <SelectItem className="cursor-pointer" value={name}>
        {name}
      </SelectItem>
      <Button
        className="p-0 h-6 w-6 shrink-0 text-white"
        onClick={() => deleteOfferTemplate(id, name)}
        size="icon"
        title="Удалить шаблон"
        variant="destructive"
      >
        {isPendingDelete ? <LoaderCircle className="h-6 w-6" /> : <Trash2 size={10} />}
      </Button>
    </div>
  )
}
