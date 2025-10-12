"use client"

import { Fragment, memo, useState } from "react"
import { PermissionEnum } from "@prisma/client"
import { FilePenLine, FileText, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/components/ui/context-menu"
import { Dialog } from "@/shared/components/ui/dialog"

const ProtectedByPermissions = dynamic(() => import("../Protect/ProtectedByPermissions"), {
  ssr: false,
})

type ContextMenuTableProps = {
  children: React.ReactNode
  hasEditDeleteActions?: boolean
  modals?: (setOpenModal: React.Dispatch<React.SetStateAction<"delete" | "edit" | null>>) => {
    edit?: React.ReactNode
    delete?: React.ReactNode
    [key: string]: React.ReactNode | undefined
  }
  path?: string
}

const ContextRowTable = ({
  children,
  hasEditDeleteActions = true,
  modals = () => ({}),
  path = "",
}: ContextMenuTableProps) => {
  const [openModal, setOpenModal] = useState<"edit" | "delete" | null>(null)

  const renderedModals = modals(setOpenModal)

  return (
    <Dialog onOpenChange={() => setOpenModal(null)} open={!!openModal}>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

        <ContextMenuContent className="grid gap-1 bg-background">
          {path && (
            <ContextMenuItem className="flex gap-2 p-0">
              <Link
                className="flex w-full items-center justify-start gap-2 p-2"
                href={path}
                prefetch={false}
                scroll={false}
              >
                <FileText size="14" /> Подробнее
              </Link>
            </ContextMenuItem>
          )}

          {hasEditDeleteActions && (
            <>
              <ContextMenuItem
                className="flex cursor-pointer gap-2"
                onClick={() => setOpenModal("edit")}
              >
                <FilePenLine size="14" /> Редактировать
              </ContextMenuItem>

              <ProtectedByPermissions permission={PermissionEnum.DEAL_MANAGEMENT}>
                <ContextMenuItem
                  className="flex cursor-pointer gap-2"
                  onClick={() => setOpenModal("delete")}
                >
                  <Trash2 size="14" /> Удалить
                </ContextMenuItem>
              </ProtectedByPermissions>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      {Object.entries(renderedModals).map(
        ([key, modal]) => key === openModal && <Fragment key={key}>{modal}</Fragment>,
      )}
    </Dialog>
  )
}

export default memo(ContextRowTable)
