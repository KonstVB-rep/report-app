// src/features/find-organization-by-inn/ui/FindOrgModal.tsx
"use client"

import { useState } from "react"
import { PermissionEnum } from "@prisma/client"
import { EllipsisVertical, Search } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
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
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import { useFindOrganization } from "../api/useFindOrganization"
import { findOrgSchema, type SearchType } from "../model/schema"

const SearchResult = dynamic(() => import("./SearchResult").then((mod) => mod.SearchResult), {
  ssr: false,
})

export const FindOrgModal = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchType, setSearchType] = useState<SearchType>("inn")
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, data: organizations, isPending } = useFindOrganization()

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type)
    setSearchQuery("")
  }

  console.log("organizations", organizations)

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
          <div className="flex-1 flex flex-col min-h-0 min-w-0 border rounded-lg bg-muted/5 overflow-hidden">
            <div className="p-3 font-semibold uppercase text-center text-xs tracking-wider text-muted-foreground shrink-0 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
              Проекты ({organizations?.projects?.length})
            </div>
            <ul className="flex-1 min-h-0 max-h-[75%] overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {organizations?.projects.map((p) => {
                const searchQuery = p.inn || p.phone || p.email || p.nameObject || p.contact || ""

                const hrefLink =
                  searchQuery && p.userId
                    ? `/dashboard/table/1/projects/${
                        p.userId
                      }?${new URLSearchParams({ search: searchQuery }).toString()}`
                    : undefined
                return (
                  <li
                    className="grid gap-2 border p-3 bg-card rounded-md shadow-sm hover:shadow-md transition-shadow relative"
                    key={p.id}
                  >
                    {hrefLink && (
                      <ProtectedByPermissions permission={PermissionEnum.VIEW_USER_REPORT}>
                        <Link
                          aria-label="Посмотреть подробнее"
                          className="absolute inset-0"
                          href={hrefLink}
                          onClick={() => {
                            requestAnimationFrame(() => {
                              onClose()
                            })
                          }}
                        />
                      </ProtectedByPermissions>
                    )}
                    <div className="flex flex-col justify-start items-start gap-2">
                      <span className="text-sm px-2 py-0.5 rounded-full text-blue-500 border border-red-200 whitespace-nowrap shrink-0">
                        {formatManagerName(p.mainManager?.username, p.mainManager?.position)}
                      </span>
                      <span className="font-medium text-base leading-tight text-foreground">
                        Объект: {p.nameObject}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      Сделка: {p.nameDeal}
                    </span>

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
                        <span className="text-wrap">{p.email || "-"}</span>
                      </div>
                      <div className="flex flex-col justify-start text-sm">
                        <span className="text-muted-foreground">Коментарий:</span>
                        <span className="text-wrap">{p.comments || "-"}</span>
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
                )
              })}
            </ul>
          </div>
        )}

        {hasRetails && (
          <div className="flex-1 flex flex-col min-w-0  min-h-0 border rounded-lg bg-muted/5 overflow-hidden">
            <div className="p-3 font-semibold uppercase text-center text-xs tracking-wider text-muted-foreground shrink-0 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
              Розница ({organizations?.retails?.length})
            </div>
            <ul className="flex-1 max-h-[75%] min-h-0 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {organizations?.retails.map((r) => {
                const searchQuery = r.inn || r.phone || r.email || r.nameObject || r.contact || ""

                const hrefLink =
                  searchQuery && r.userId
                    ? `/dashboard/table/1/retails/${
                        r.userId
                      }?${new URLSearchParams({ search: searchQuery }).toString()}`
                    : undefined
                return (
                  <li
                    className="grid gap-2 border p-3 bg-card rounded-md shadow-sm hover:shadow-md transition-shadow relative"
                    key={r.id}
                  >
                    {hrefLink && (
                      <ProtectedByPermissions permission={PermissionEnum.VIEW_USER_REPORT}>
                        <Link
                          aria-label="Посмотреть подробнее"
                          className="absolute inset-0"
                          href={hrefLink}
                          onClick={() => {
                            requestAnimationFrame(() => {
                              onClose()
                            })
                          }}
                        />
                      </ProtectedByPermissions>
                    )}
                    <div className="flex flex-col justify-start items-start gap-2">
                      <span className="text-sm px-2 py-0.5 rounded-full text-blue-500 border border-red-200 whitespace-nowrap shrink-0">
                        {formatManagerName(r.mainManager?.username, r.mainManager?.position)}
                      </span>
                      <span className="font-medium text-base leading-tight text-foreground">
                        Объект: {r.nameObject}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      Сделка: {r.nameDeal}
                    </span>

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
                        <span className="text-wrap">{r.email || "-"}</span>
                      </div>
                      <div className="flex flex-col justify-start text-sm">
                        <span className="text-muted-foreground">Коментарий:</span>
                        <span className="text-wrap">{r.comments || "-"}</span>
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
                )
              })}
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

      <SearchResult isOpen={isOpen} onClose={onClose} renderContent={renderContent} />
    </>
  )
}
