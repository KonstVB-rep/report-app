"use client";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog } from "@/components/ui/dialog";
import EditProject from "../../../entities/project/ui/Modals/EditProject";

import DelProject from "../../../entities/project/ui/Modals/DelProject";
import { Project } from "@/entities/project/types";

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
            <ContextMenuItem onClick={() => setOpenModal("edit")}>
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
          />
        )}
        {openModal === "delete" && (
          <DelProject
            close={() => setOpenModal(null)}
            id={(rowData as Project).id}
          />
        )}
      </Dialog>
    </>
  );
};

export default ContextRowTable;
