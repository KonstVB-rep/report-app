"use client";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog } from "@/components/ui/dialog";
import { Project, Retail } from "@prisma/client";
import DelDeal from "@/entities/deal/ui/Modals/DelProject";
import EditDealForm from "@/entities/deal/ui/Modals/EditDealForm";

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

          <ContextMenuContent className="grid gap-1">
            <ContextMenuItem
              onClick={() => setOpenModal("edit")}
              className="btn_hover"
            >
              Редактировать
            </ContextMenuItem>

            <ContextMenuItem onClick={() => setOpenModal("delete")} className="btn_hover">
              Удалить
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {openModal === "edit" && (
          <EditDealForm
            close={() => setOpenModal(null)}
            id={(rowData as Project | Retail).id}
            type={(rowData as Project | Retail).type}
          />
        )}
        {openModal === "delete" && (
          <DelDeal
            close={() => setOpenModal(null)}
            id={(rowData as Project | Retail).id}
            type={(rowData as Project | Retail).type}
          />
        )}
      </Dialog>
    </>
  );
};

export default ContextRowTable;
