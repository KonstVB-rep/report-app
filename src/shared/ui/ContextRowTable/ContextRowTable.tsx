"use client";

// import { Project, Retail } from "@prisma/client";

import { Dispatch, Fragment, memo, SetStateAction, useState } from "react";

import Link from "next/link";

import { FilePenLine, FileText, Trash2 } from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog } from "@/components/ui/dialog";
// import DelDealContextMenu from "@/entities/deal/ui/Modals/DelDealContextMenu";
// import EditDealContextMenu from "@/entities/deal/ui/Modals/EditDealContextMenu";

import ProtectedByDepartmentAffiliation from "../Protect/ProtectedByDepartmentAffiliation";

type ContextMenuTableProps = {
  children: React.ReactNode;
  isExistActionDeal?: boolean;
  modals?: (setOpenModal: React.Dispatch<React.SetStateAction<"delete" | "edit" | null>>) => {
    edit?: React.ReactNode;
    delete?: React.ReactNode;
    [key: string]: React.ReactNode | undefined;
  };
  path?: string
};

const ContextRowTable =({
  children,
  isExistActionDeal = true,
  modals = () => ({}),
  path = ''
}: ContextMenuTableProps) => {
  const [openModal, setOpenModal] = useState<"edit" | "delete" | null>(null);

  return (
    <>
      <Dialog open={!!openModal} onOpenChange={() => setOpenModal(null)}>
        <ContextMenu>
          <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

          <ContextMenuContent className="grid gap-1 bg-background">
            <ContextMenuItem className="flex gap-2 p-0">
              {path && <Link
                className="flex w-full items-center justify-start gap-2 p-2"
                href={path}
              >
                <FileText size="14" /> Подробнее
              </Link>}
            </ContextMenuItem>

            {isExistActionDeal && (
              <ProtectedByDepartmentAffiliation>
                <ContextMenuItem
                  onClick={() => setOpenModal("edit")}
                  className="flex cursor-pointer gap-2"
                >
                  <FilePenLine size="14" /> Редактировать
                </ContextMenuItem>

                <ContextMenuItem
                  onClick={() => setOpenModal("delete")}
                  className="flex cursor-pointer gap-2"
                >
                  <Trash2 size="14" /> Удалить
                </ContextMenuItem>
              </ProtectedByDepartmentAffiliation>
            )}
          </ContextMenuContent>
        </ContextMenu>

        {Object.entries(modals(setOpenModal)).map(([key, modal]) => {
          if (key === openModal) {
            return <Fragment key={key}>{modal}</Fragment>;
          }
          return null;
        })}

        {/* {openModal === "edit" && (
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
        )} */}
      </Dialog>
    </>
  );
};

export default memo(ContextRowTable);
