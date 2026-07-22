// src/features/find-organization-by-inn/ui/FindOrgModal.tsx
"use client"

import { useState } from "react"
import { EllipsisVertical, Search, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/components/ui/drawer"
import { Input } from "@/shared/components/ui/input"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/shared/components/ui/menubar"
import PhoneInput from "@/shared/custom-components/ui/Inputs/PhoneInput"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import { useFindOrganization } from "../api/useFindOrganization"
import { findOrgSchema, type SearchType } from "../model/schema"

export const FindOrgModal = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchType, setSearchType] = useState<SearchType>("inn")
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, data: organizations, isPending } = useFindOrganization()

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type)
    setSearchQuery("")
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Запускаем валидацию Zod перед отправкой
    const validation = findOrgSchema.safeParse({
      searchType,
      value: searchQuery,
    })

    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      return
    }

    mutate(
      { value: searchQuery, searchType },
      {
        onSuccess: () => {
          setIsOpen(true)
        },
      },
    )
  }

  const onClose = () => {
    setIsOpen(false)
  }

  const formatManagerName = (username?: string, position?: string) => {
    if (!username) return "Менеджер не указан"
    const parts = username.trim().split(" ")
    const surname = parts[0] ? `${parts[0][0].toUpperCase()}${parts[0].slice(1)}` : ""
    const nameInit = parts[1] ? ` ${parts[1][0].toUpperCase()}.` : ""
    return `${surname}${nameInit}${position ? ` / ${position}` : ""}`
  }

  const renderContent = () => {
    return (
      <div className="space-y-4">
        {(organizations?.projects?.length || 0) > 0 && (
          <div className="space-y-2">
            <p className="font-semibold uppercase text-center text-muted-foreground">Проекты</p>
            <ul className="space-y-2 p-4 border rounded-md max-h-[50vh] overflow-y-auto">
              {organizations?.projects.map((p) => (
                <li className="grid gap-1 border-b pb-2 last:border-none" key={p.id}>
                  <span className="block text-right px-3 py-1 rounded-full bg-muted w-fit border border-red-500 font-medium">
                    {formatManagerName(p.mainManager?.username, p.mainManager?.position)}
                  </span>
                  <div className="flex flex-col gap-1 p-2">
                    <span className="font-medium">{p.nameObject}</span>
                    <span className="text-muted-foreground">{p.nameDeal}</span>
                    <div className="mt-1">Контакт: {p.contact}</div>
                    <div className="mt-1">Телефон: {p.phone || "-"}</div>
                    <div className="mt-1">Email: {p.email || "-"}</div>
                    {p.additionalContacts?.length > 0 && (
                      <div className="mt-2 text-muted-foreground space-y-1 border-t pt-1 border-dashed">
                        <p className="font-medium text-blue-600">Доп. контакты:</p>
                        <ul className="space-y-1 pl-2">
                          {p.additionalContacts.map((c) => (
                            <li className="leading-relaxed" key={c.id}>
                              <span className="font-semibold text-foreground">{c.name}</span>
                              {c.position && <span className="text-gray-400"> ({c.position})</span>}

                              {(c.phone || c.email) && " — "}
                              {c.phone && (
                                <span className="bg-muted px-1 rounded mr-1 text-sm">
                                  {c.phone}
                                </span>
                              )}
                              {c.email && (
                                <span className="text-blue-500 underline">{c.email}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(organizations?.retails?.length || 0) > 0 && (
          <div className="space-y-2">
            <p className="font-semibold uppercase text-center text-muted-foreground">Розница</p>
            <ul className="space-y-2 p-2 border rounded-md max-h-[30vh] overflow-y-auto">
              {organizations?.retails.map((r) => (
                <li className="grid gap-1 border-b pb-2 last:border-none" key={r.id}>
                  <span className="block text-right px-3 py-1 rounded-full bg-muted w-fit border border-red-500 font-medium">
                    {formatManagerName(r.mainManager?.username, r.mainManager?.position)}
                  </span>
                  <div className="flex flex-col gap-1 p-2">
                    <span className="font-medium">{r.nameObject}</span>
                    <span className="text-muted-foreground">{r.nameDeal}</span>
                    {r.additionalContacts?.length > 0 && (
                      <div className="mt-1 text-[11px] text-blue-600">
                        Доп. контакты: {r.additionalContacts.map((c) => c.name).join(", ")}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4 p-4 md:p-0 select-none">
        <div className="flex items-center gap-2">
          <Menubar className="h-10 w-10 text-muted-foreground border-none bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="h-full w-full grid place-items-center cursor-pointer">
                <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem onClick={() => handleSearchTypeChange("inn")}>
                    ИНН {searchType === "inn" && "✓"}
                  </MenubarItem>
                  <MenubarItem onClick={() => handleSearchTypeChange("orgName")}>
                    Название {searchType === "orgName" && "✓"}
                  </MenubarItem>
                  <MenubarItem onClick={() => handleSearchTypeChange("phone")}>
                    Телефон {searchType === "phone" && "✓"}
                  </MenubarItem>
                  <MenubarItem onClick={() => handleSearchTypeChange("email")}>
                    Email {searchType === "email" && "✓"}
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <form className="flex-1" onSubmit={handleSubmit}>
            <div className="relative">
              <Button
                className="absolute left-1 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center text-muted-foreground border-none z-10"
                disabled={isPending}
                size="icon"
                type="submit"
                variant="ghost"
              >
                {isPending ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>

              {searchType === "inn" && (
                <Input
                  autoComplete="off"
                  className="pl-11 h-11 rounded-xl text-sm focus-visible:ring-blue-600"
                  inputMode="numeric"
                  maxLength={12}
                  onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, ""))}
                  placeholder="ИНН(10/12 цифр)"
                  type="text"
                  value={searchQuery}
                />
              )}
              {searchType === "orgName" && (
                <Input
                  autoComplete="off"
                  className="pl-11 h-11 rounded-xl text-sm focus-visible:ring-blue-600"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Введите название организации"
                  type="text"
                  value={searchQuery}
                />
              )}
              {searchType === "phone" && (
                <PhoneInput
                  className="pl-11 h-11 rounded-xl text-sm focus-visible:ring-blue-600"
                  onAccept={(value) => setSearchQuery(value)}
                  placeholder="Введите телефон"
                  value={searchQuery}
                />
              )}

              {searchType === "email" && (
                <Input
                  autoComplete="off"
                  className="pl-11 h-11 rounded-xl text-sm focus-visible:ring-blue-600"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Введите email"
                  type="email"
                  value={searchQuery}
                />
              )}
            </div>
          </form>
        </div>
      </div>

      <SerachResult isOpen={isOpen} onClose={onClose} renderContent={renderContent} />
    </>
  )
}

const SerachResult = ({
  isOpen,
  onClose,
  renderContent,
}: {
  isOpen: boolean
  onClose: () => void
  renderContent: () => React.ReactNode
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl p-5 border-border/60 shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle></DialogTitle>
            <DialogDescription className="sr-only">Результаты поиска</DialogDescription>
          </DialogHeader>
          <Button className="absolute top-2 right-2" onClick={onClose} variant={"ghost"}>
            <X className="h-5 w-5" />
          </Button>
          <DialogHeader>
            <DialogTitle className="sr-only">Поиск организации</DialogTitle>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DrawerContent className="rounded-t-2xl pb-6">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 my-2" />
        <DrawerHeader className="text-left px-4 pt-1">
          <DrawerTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Поиск организации
          </DrawerTitle>
        </DrawerHeader>
        {renderContent()}
      </DrawerContent>
    </Drawer>
  )
}
