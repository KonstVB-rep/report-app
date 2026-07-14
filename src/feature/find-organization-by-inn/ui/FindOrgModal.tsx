// src/features/find-organization-by-inn/ui/FindOrgModal.tsx
"use client"

import { useState } from "react"
import { EllipsisVertical, Search, X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
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
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import { useFindOrganization } from "../api/useFindOrganization"

export const FindOrgModal = () => {
  const [inn, setInn] = useState("")
  const [orgName, setOrgName] = useState("")
  const [searchType, setSearchType] = useState<"inn" | "orgName">("inn")
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, data: organizations, isPending } = useFindOrganization()

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    const searchType = e.currentTarget.dataset.search
    if (searchType === "inn" || searchType === "orgName") {
      setSearchType(searchType)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate(
      { value: inn || orgName, searchType },
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

  const renderContent = () => {
    return (
      <div className="space-y-4">
        {(organizations?.projects?.length || 0) > 0 && (
          <div className="space-y-2">
            <p className="text-sm uppercase text-center">Проекты</p>
            <ul className="space-y-2 p-2 border rounded-md max-h-[20vh] overflow-y-auto">
              {organizations?.projects.map((p) => {
                const [surname, name] = (p.mainManager?.username ?? "").split(" ")
                const nameManager = `${surname[0].toUpperCase()}${surname.slice(1)}.${name[0].toUpperCase()}`
                return (
                  <li className="grid gap-1" key={p.id}>
                    <span className="block text-right px-2 py-1 rounded-2xl bg-muted w-fit text-sm border border-red-500">
                      {nameManager}/{p.mainManager?.position}
                    </span>
                    <div className="space-y-2 p-3">
                      <span className="text-xs">{p.nameObject}</span>
                      <span className="text-xs">{p.nameDeal}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        {(organizations?.retails?.length || 0) > 0 && (
          <div className="space-y-2">
            <p className="text-sm uppercase text-center">Розница</p>
            <ul className="space-y-2 p-2 border rounded-md max-h-[20vh] overflow-y-auto">
              {organizations?.retails.map((r) => {
                const [surname, name] = (r.mainManager?.username ?? "").split(" ")
                const nameManager = `${surname[0].toUpperCase()}${surname.slice(1)}.${name[0].toUpperCase()}`
                return (
                  <li className="grid gap-1" key={r.id}>
                    <span className="block text-right px-2 py-1 rounded-2xl bg-muted w-fit text-sm border border-red-500">
                      {nameManager}/{r.mainManager?.position}
                    </span>
                    <div className="space-y-2 p-3">
                      <span className="p-3 text-xs">{r.nameObject}</span>
                      <span className="p-3 text-xs">{r.nameDeal}</span>
                    </div>
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
      <div className="space-y-4 p-4 md:p-0 select-none">
        <div className="flex items-center">
          <Menubar className="h-10 w-10 text-muted-foreground border-none">
            <MenubarMenu>
              <MenubarTrigger className="h-full w-fullgrid place-items-center">
                <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem data-search="inn" onClick={handleSelect}>
                    ИНН
                  </MenubarItem>
                  <MenubarItem data-search="orgName" onClick={handleSelect}>
                    Название
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Button
                className="absolute left-1 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center text-muted-foreground border-none"
                size="icon"
                type="submit"
                variant="ghost"
              >
                {isPending ? (
                  <LoaderCircle className="h-10 bg-muted rounded-md" classSpin="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5 text-muted-foreground border-none" />
                )}
              </Button>
              {searchType === "inn" ? (
                <Input
                  autoComplete="off"
                  className="pl-11 h-11 rounded-xl text-sm focus-visible:ring-blue-600"
                  inputMode="numeric"
                  maxLength={12}
                  onChange={(e) => setInn(e.target.value.replace(/\D/g, ""))}
                  pattern="[0-9]*"
                  placeholder="ИНН"
                  type="text"
                  value={inn}
                />
              ) : (
                <Input
                  autoComplete="off"
                  className="pl-11 h-11 rounded-xl text-sm focus-visible:ring-blue-600"
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Название"
                  type="text"
                  value={orgName}
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
        <DialogContent className=" sm:max-w-[460px] rounded-2xl p-5 border-border/60 shadow-2xl">
          <Button className="absolute top-2 right-2" onClick={onClose} variant={"ghost"}>
            <X className="h-5 w-5" />
          </Button>
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Поиск организации
            </DialogTitle>
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
