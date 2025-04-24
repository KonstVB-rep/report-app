import { Separator } from "@radix-ui/react-separator";

import { Fragment, memo } from "react";

import Link from "next/link";

import { BookText, ChartColumnBig } from "lucide-react";

import { DepartmentUserItem } from "@/entities/department/types";

type DealType = {
  id: string;
  title: string;
};

const dealsSalesDepartment: DealType[] = [
  {
    id: "projects",
    title: "Проекты",
  },
  {
    id: "retails",
    title: "Розница",
  },
];

const pagesMarkretingDepartment: DealType[] = [
  {
    id: "statistics/request-source",
    title: "Источники сделок",
  },
];

type DepartmentLinksProps = {
  departmentId: number;
  user: DepartmentUserItem;
  userId: string;
  dealType?: string;
  pathName?: string;
};

export const DepartmentLinks = memo(
  ({
    departmentId,
    user,
    userId,
    dealType,
    pathName,
  }: DepartmentLinksProps) => {
    if (departmentId === 1) {
      return (
        <>
          {dealsSalesDepartment.map((deal) => (
            <Fragment key={deal.id}>
              <Link
                href={`${user.url}/${deal.id}/${user.id}`}
                onClick={(e) => e.stopPropagation()}
                className={`${
                  (dealType !== deal.id || user.id !== userId) &&
                  "text-primary dark:text-stone-400"
                } relative flex items-center gap-2 overflow-hidden rounded-md p-1 transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground`}
              >
                <p className="relative z-[1] flex h-full w-full items-center gap-2 rounded-sm p-2">
                  <BookText
                    size={dealType !== deal.id || user.id !== userId ? 12 : 16}
                    className="shrink-0"
                  />
                  {deal.title}
                </p>
                {dealType === deal.id && user.id === userId && (
                  <div className="absolute right-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-md bg-blue-600" />
                )}
              </Link>
              <Separator className="my-[1px] h-[1px] bg-stone-600" />
            </Fragment>
          ))}
        </>
      );
    }

    if (departmentId === 2) {
      return (
        <>
          {pagesMarkretingDepartment.map((page) => (
            <Fragment key={page.id}>
              <Link
                href={`${user.url}/${departmentId}/${user.id}`}
                onClick={(e) => e.stopPropagation()}
                className={`${
                  (!pathName?.includes(page.id) || user.id !== userId) &&
                  "text-primary dark:text-stone-400"
                } relative flex items-center gap-2 overflow-hidden rounded-md p-1 transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground`}
              >
                <p className="relative z-[1] flex h-full w-full items-center gap-2 rounded-sm p-2">
                  <ChartColumnBig
                    className="shrink-0"
                    size={
                      !pathName?.includes(page.id) || user.id !== userId
                        ? 12
                        : 16
                    }
                  />
                  {page.title}
                </p>
                {pathName?.includes(page.id) && user.id === userId && (
                  <div className="absolute right-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-md bg-blue-600" />
                )}
              </Link>
              <Separator className="my-[1px] h-[1px] bg-stone-600" />
            </Fragment>
          ))}
        </>
      );
    }

    return null;
  }
);
DepartmentLinks.displayName = "DepartmentLinks";
