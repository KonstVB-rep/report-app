"use client";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog } from "@/components/ui/dialog";
import DelProject from "@/entities/deal/ui/Modals/DelProject";
import EditProject from "@/entities/deal/ui/Modals/EditProject";
import { Project } from "@prisma/client";

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

          <ContextMenuContent>
            <ContextMenuItem onClick={() => setOpenModal("edit")} className="hover:border-muted-foreground focus-visible:border-muted-foreground">
              Редактировать
            </ContextMenuItem>

            <ContextMenuItem onClick={() => setOpenModal("delete")}>
              Удалить
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {openModal === "edit" && (
          <EditProject
            close={() => setOpenModal(null)}
            id={(rowData as Project).id}
            type = {(rowData as Project).type}
          />
        )}
        {openModal === "delete" && (
          <DelProject
            close={() => setOpenModal(null)}
            id={(rowData as Project).id}
            type = {(rowData as Project).type}
          />
        )}
      </Dialog>
    </>
  );
};

export default ContextRowTable;
