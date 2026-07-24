// src/features/find-organization-by-inn/ui/FindOrgModal.tsx
"use client"

import { useState } from "react"
import { EllipsisVertical, Search, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog"
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
    const hasProjects = (organizations?.projects?.length || 0) > 0
    const hasRetails = (organizations?.retails?.length || 0) > 0

    if (!hasProjects && !hasRetails) {
      return (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Ничего не найдено
        </div>
      )
    }

    return (
      <div className="flex flex-col sm:flex-row gap-4 max-h-[80vh] w-full overflow-hidden">
        {hasProjects && (
          <div className="flex-1 flex flex-col min-w-0 border rounded-lg bg-muted/5 overflow-hidden">
            <div className="p-3 font-semibold uppercase text-center text-xs tracking-wider text-muted-foreground shrink-0 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
              Проекты ({organizations?.projects?.length})
            </div>
            <ul className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {organizations?.projects.map((p) => (
                <li
                  className="grid gap-2 border p-3 bg-card rounded-md shadow-sm hover:shadow-md transition-shadow"
                  key={p.id}
                >
                  <div className="flex flex-col justify-start items-start gap-2">
                    <span className="text-sm px-2 py-0.5 rounded-full text-blue-500 border border-red-200 whitespace-nowrap shrink-0">
                      {formatManagerName(p.mainManager?.username, p.mainManager?.position)}
                    </span>
                    <span className="font-medium text-base leading-tight text-foreground">
                      {p.nameObject}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground line-clamp-1">{p.nameDeal}</span>

                  <div className="mt-1 text-sm grid gap-1.5 pt-2 border-t border-dashed">
                    <div className="flex justify-start gap-2 text-sm">
                      <span className="text-muted-foreground">Контакт:</span>
                      <span className="text-foreground font-medium">{p.contact}</span>
                    </div>
                    <div className="flex justify-start gap-2 text-sm">
                      <span className="text-muted-foreground">Тел:</span>
                      <span className="text-foreground">{p.phone || "-"}</span>
                    </div>
                    <div className="flex justify-start gap-2 text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="truncate max-w-[150px]">{p.email || "-"}</span>
                    </div>
                  </div>

                  {p.additionalContacts?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-dashed text-xs text-muted-foreground space-y-2 bg-muted/30 p-2 rounded">
                      <p className="font-medium text-blue-600">Доп. контакты:</p>
                      {p.additionalContacts.map((c) => (
                        <div className="pl-2 border-l-2 border-blue-200" key={c.id}>
                          <div className="font-semibold text-foreground flex items-center gap-1">
                            {c.name}
                            {c.position && (
                              <span className="text-sm text-gray-400">({c.position})</span>
                            )}
                          </div>
                          <div className="mt-0.5 flex flex-wrap gap-x-2">
                            {c.phone && <span>{c.phone}</span>}
                            {c.email && <span className="text-blue-500">{c.email}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasRetails && (
          <div className="flex-1 flex flex-col min-w-0 border rounded-lg bg-muted/5 overflow-hidden">
            <div className="p-3 font-semibold uppercase text-center text-xs tracking-wider text-muted-foreground shrink-0 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
              Розница ({organizations?.retails?.length})
            </div>
            <ul className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {organizations?.retails.map((r) => (
                <li
                  className="grid gap-2 border p-3 bg-card rounded-md shadow-sm hover:shadow-md transition-shadow"
                  key={r.id}
                >
                  <div className="flex flex-col justify-start items-start gap-2">
                    <span className="text-sm px-2 py-0.5 rounded-full text-blue-500 border border-red-200 whitespace-nowrap shrink-0">
                      {formatManagerName(r.mainManager?.username, r.mainManager?.position)}
                    </span>
                    <span className="font-medium text-base leading-tight text-foreground">
                      {r.nameObject}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground line-clamp-1">{r.nameDeal}</span>

                  <div className="mt-1 text-sm grid gap-1.5 pt-2 border-t border-dashed">
                    <div className="flex justify-start gap-2 text-sm">
                      <span className="text-muted-foreground">Контакт:</span>
                      <span className="text-foreground font-medium">{r.contact}</span>
                    </div>
                    <div className="flex justify-start gap-2 text-sm">
                      <span className="text-muted-foreground">Тел:</span>
                      <span className="text-foreground">{r.phone || "-"}</span>
                    </div>
                    <div className="flex justify-start gap-2 text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="truncate max-w-[150px]">{r.email || "-"}</span>
                    </div>
                  </div>

                  {r.additionalContacts?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-dashed text-xs text-muted-foreground space-y-2 bg-muted/30 p-2 rounded">
                      <p className="font-medium text-blue-600">Доп. контакты:</p>
                      {r.additionalContacts.map((c) => (
                        <div className="pl-2 border-l-2 border-blue-200" key={c.id}>
                          <div className="font-semibold text-foreground flex items-center gap-1">
                            {c.name}
                            {c.position && (
                              <span className="text-sm text-gray-400">({c.position})</span>
                            )}
                          </div>
                          <div className="mt-0.5 flex flex-wrap gap-x-2">
                            {c.phone && <span>{c.phone}</span>}
                            {c.email && <span className="text-blue-500">{c.email}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                placeholder="Организация"
                type="text"
                value={searchQuery}
              />
            )}
            {searchType === "phone" && (
              <PhoneInput
                className="pl-11 h-11 rounded-xl text-sm focus-visible:ring-blue-600"
                onAccept={(value) => setSearchQuery(value)}
                placeholder="Телефон"
                value={searchQuery}
              />
            )}

            {searchType === "email" && (
              <Input
                autoComplete="off"
                className="pl-11 h-11 rounded-xl text-sm focus-visible:ring-blue-600"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Email"
                type="email"
                value={searchQuery}
              />
            )}
          </div>
        </form>
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
        <DialogContent className="sm:max-w-[min(900px,95vw)] rounded-2xl p-0 border-border/60 shadow-2xl max-h-[80dvh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b bg-background/50 backdrop-blur-sm shrink-0">
            <DialogTitle className="text-lg font-semibold">Результаты поиска</DialogTitle>
            <Button className="rounded-full" onClick={onClose} size="icon" variant={"ghost"}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Контент без общего скролла, скролл внутри колонок */}
          <div className="p-5 flex-1 min-h-0 bg-muted/10">{renderContent()}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DrawerContent className="rounded-t-2xl px-0 flex flex-col data-[vaul-drawer-direction=bottom]:max-h-[90dvh]">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 my-3 shrink-0" />

        <DrawerHeader className="text-left px-5 pt-1 pb-3 shrink-0 border-b">
          <DrawerTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Поиск организации
          </DrawerTitle>
        </DrawerHeader>

        {/* Контент без общего скролла, скролл внутри колонок */}
        <div className="flex-1 p-4 min-h-0 bg-muted/10">{renderContent()}</div>
      </DrawerContent>
    </Drawer>
  )
}
