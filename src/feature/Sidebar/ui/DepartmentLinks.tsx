import { DealType, PermissionEnum } from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";

import { Fragment, memo, useMemo } from "react";

import Link from "next/link";

import { BookText, ChartColumnBig, TableProperties } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SummaryTableLink from "@/entities/deal/ui/SummaryTableLink";
import { DepartmentUserItem } from "@/entities/department/types";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";

import MarketActiveItemSidebar from "./MarketActiveItemSidebar";

type DealsType = {
  id: string;
  title: string;
};

const dealsSalesDepartment: DealsType[] = [
  { id: "projects", title: "Проекты" },
  { id: "retails", title: "Розница" },
  { id: "contracts", title: "Договора" }
];

const namePagesByDealType = [DealType.PROJECT, DealType.RETAIL];

const pagesMarkretingDepartment: DealsType[] = [
  { id: "statistics/request-source", title: "Источники сделок" },
];

type DepartmentLinksProps = {
  departmentId: number;
  user: DepartmentUserItem;
  userId: string;
  dealType?: string;
  pathName?: string;
};

const LinkItem = memo(
  ({
    href,
    title,
    icon: Icon,
    isActive,
    onClick,
  }: {
    href: string;
    title: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
    isActive: boolean;
    onClick: (e: React.MouseEvent) => void;
  }) => (
    <Fragment>
      <Link
        href={href}
        onClick={onClick}
        className={`${
          !isActive && "text-primary dark:text-stone-400"
        } relative flex items-center gap-2 overflow-hidden rounded-md p-1 transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground`}
      >
        <p className="relative z-[1] flex h-full w-full items-center gap-2 rounded-sm p-2">
          <Icon size={isActive ? 16 : 12} className="shrink-0" />
          {title}
        </p>
        {isActive && (
          <div className="absolute right-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-md bg-blue-600" />
        )}
      </Link>
      <Separator className="my-[1px] h-[1px] bg-stone-600" />
    </Fragment>
  )
);

LinkItem.displayName = "LinkItem";

export const DepartmentLinks = memo(
  ({
    departmentId,
    user,
    userId,
    dealType,
    pathName,
  }: DepartmentLinksProps) => {
    const getDealLinks = useMemo(
      () =>
        departmentId === 1 ? dealsSalesDepartment : pagesMarkretingDepartment,
      [departmentId]
    );

    const renderLinks = useMemo(
      () =>
        getDealLinks.map((deal) => {
          const isActive = dealType === deal.id && user.id === userId;
          const href =
            departmentId === 1
              ? `${user.url}/${deal.id}/${user.id}`
              : `${user.url}/${departmentId}/${user.id}`;
          return (
            <LinkItem
              key={deal.id}
              href={href}
              title={deal.title}
              icon={departmentId === 1 ? BookText : ChartColumnBig}
              isActive={isActive}
              onClick={(e) => e.stopPropagation()}
            />
          );
        }),
      [dealType, user.id, user.url, userId, getDealLinks, departmentId]
    );

    if (departmentId === 2) {
      return (
        <>
          {renderLinks}
          <ProtectedByPermissions
            permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="p-1 rounded-md transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground">
                  <p className="flex h-full w-full items-center gap-2 rounded-sm p-2 text-primary dark:text-stone-400">
                    <TableProperties size="12px" />
                    <span>Сводные таблицы</span>
                  </p>
                </AccordionTrigger>
                <AccordionContent className="grid w-full gap-1 pl-5 relative">
                  {namePagesByDealType.map((type, index) => (
                    <Fragment key={type}>
                      <div className="relative rounded-sm overflow-hidden">
                        {pathName?.includes("summary-table") &&
                          pathName?.includes(type.toLocaleLowerCase()) &&
                          user.id === userId && <MarketActiveItemSidebar />}
                        <SummaryTableLink
                          type={type}
                          departmentId="1"
                          className="flex border p-3 text-primary dark:text-stone-400 border-solid border-transparent rounded-md transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground"
                        />
                      </div>
                      {index !== namePagesByDealType.length - 1 && (
                        <Separator className="my-[1px] h-[1px] bg-stone-600" />
                      )}
                    </Fragment>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator className="my-[1px] h-[1px] bg-stone-600" />
          </ProtectedByPermissions>
        </>
      );
    }

    return <>{renderLinks}</>;
  }
);

DepartmentLinks.displayName = "DepartmentLinks";
