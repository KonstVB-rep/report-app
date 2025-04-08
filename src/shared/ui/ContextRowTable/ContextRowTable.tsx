"use client";
import { memo, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog } from "@/components/ui/dialog";
import { Project, Retail } from "@prisma/client";
import Link from "next/link";
import { FilePenLine, FileText, Trash2 } from "lucide-react";
import EditDealContextMenu from "@/entities/deal/ui/Modals/EditDealContextMenu";
import DelDealContextMenu from "@/entities/deal/ui/Modals/DelDealContextMenu";

type ContextMenuTableProps<T> = {
  children: React.ReactNode;
  rowData: T;
};

const ContextRowTable = <T,>({
  children,
  rowData,
}: ContextMenuTableProps<T>) => {
  const [openModal, setOpenModal] = useState<"edit" | "delete" | null>(null);

  return (
    <>
      <Dialog open={!!openModal} onOpenChange={() => setOpenModal(null)}>
        <ContextMenu>
          <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

          <ContextMenuContent className="grid gap-1 bg-background">
            <ContextMenuItem className="flex gap-2 p-0">
              <Link
                className="flex w-full gap-2 items-center justify-start p-2"
                href={`/deal/${(
                  rowData as Project | Retail
                ).type.toLowerCase()}/${(rowData as Project | Retail).id}`}
              >
                <FileText size="14" /> Подробнее
              </Link>
            </ContextMenuItem>

            <ContextMenuItem
              onClick={() => setOpenModal("edit")}
              className="flex gap-2 cursor-pointer"
            >
              <FilePenLine size="14" /> Редактировать
            </ContextMenuItem>

            <ContextMenuItem
              onClick={() => setOpenModal("delete")}
              className="flex gap-2 cursor-pointer"
            >
              <Trash2 size="14" /> Удалить
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {openModal === "edit" && (
          <EditDealContextMenu
            close={() => setOpenModal(null)}
            id={(rowData as Project | Retail).id}
            type={(rowData as Project | Retail).type}
          />
        )}
        {openModal === "delete" && (
          <DelDealContextMenu
            close={() => setOpenModal(null)}
            id={(rowData as Project | Retail).id}
            type={(rowData as Project | Retail).type}
          />
        )}
      </Dialog>
    </>
  );
};

export default memo(ContextRowTable);
