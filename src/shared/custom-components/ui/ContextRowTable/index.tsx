"use client"

import { memo } from "react"
import { PermissionEnum } from "@prisma/client"
import { FilePenLine, FileText, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"
import { ACTUAL_STATUS_DEAL } from "@/entities/deal/lib/constants"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/components/ui/context-menu"

const ProtectedByPermissions = dynamic(() => import("../Protect/ProtectedByPermissions"), {
  ssr: false,
})

type ContextMenuTableProps = {
  children: React.ReactNode
  hasEditDeleteActions?: boolean
  openModal?: () => {
    edit: {
      onClick: () => void
    }
    delete: { onClick: () => void }
    more: { onClick: () => void }
    color?: { onClick: () => void }
  }
  path?: string
  dealStatus?: string | null
}

const ContextRowTable = ({
  children,
  hasEditDeleteActions = true,
  openModal,
  path = "",
  dealStatus = "",
}: ContextMenuTableProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="grid gap-1 bg-background">
        {path && (
          <ContextMenuItem
            className="flex w-full items-center justify-start gap-2 p-2 cursor-pointer"
            onClick={() => openModal?.().more.onClick()}
          >
            <FileText size="14" /> Подробнее
          </ContextMenuItem>
        )}

        {hasEditDeleteActions && (
          <>
            <ContextMenuItem
              className="flex cursor-pointer gap-2"
              onClick={() => openModal?.().edit.onClick()}
            >
              <FilePenLine size="14" /> Редактировать
            </ContextMenuItem>

            <ProtectedByPermissions permission={PermissionEnum.DEAL_DELETE}>
              <ContextMenuItem
                className="flex cursor-pointer gap-2"
                onClick={() => openModal?.().delete.onClick()}
              >
                <Trash2 size="14" /> Удалить
              </ContextMenuItem>
            </ProtectedByPermissions>

            {dealStatus === ACTUAL_STATUS_DEAL && (
              <ContextMenuItem
                className="flex cursor-pointer gap-2"
                onClick={() => {
                  const actions = openModal?.()
                  actions?.color?.onClick()
                }}
              >
                <FilePenLine size="14" /> Цвет
              </ContextMenuItem>
            )}
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default memo(ContextRowTable)
