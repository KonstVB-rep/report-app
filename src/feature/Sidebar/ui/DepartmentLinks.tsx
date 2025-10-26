import { Fragment, memo, useMemo } from "react"
import { DealType, PermissionEnum } from "@prisma/client"
import { Separator } from "@radix-ui/react-separator"
import { BookText, ChartColumnBig, TableProperties } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import SummaryTableLink from "@/entities/deal/ui/SummaryTableLink"
import { NOT_MANAGERS_POSITIONS } from "@/entities/department/lib/constants"
import type { DepartmentUserItem } from "@/entities/department/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import MarketActiveItemSidebar from "./MarketActiveItemSidebar"

const ProtectedByPermissions = dynamic(
  () => import("@/shared/custom-components/ui/Protect/ProtectedByPermissions"),
  {
    ssr: false,
    loading: () => <LoaderCircle className="h-10 bg-muted rounded-md w-full" classSpin="h-6 w-6" />,
  },
)

type DealsType = {
  id: string
  title: string
}

const dealsSalesDepartment: DealsType[] = [
  { id: "projects", title: "Проекты" },
  { id: "retails", title: "Розница" },
  { id: "contracts", title: "Договора" },
]

const namePagesByDealType = [DealType.PROJECT, DealType.RETAIL]

const pagesMarkretingDepartment: DealsType[] = [
  { id: "statistics/request-source", title: "Источники сделок" },
]

type DepartmentLinksProps = {
  departmentId: number
  user: DepartmentUserItem
  userId: string | undefined
  dealType?: string
  pathName?: string
}

const LinkItem = memo(
  ({
    href,
    title,
    icon: Icon,
    isActive,
    onClick,
  }: {
    href: string
    title: string
    icon: React.ComponentType<{ size: number; className?: string }>
    isActive: boolean
    onClick: (e: React.MouseEvent) => void
  }) => (
    <Fragment>
      <Link
        className={`${
          !isActive && "text-primary dark:text-stone-400"
        } relative flex items-center gap-2 overflow-hidden rounded-md p-1 transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground`}
        href={href}
        onClick={onClick}
        prefetch={false}
      >
        <p className="relative z-1 flex h-full w-full items-center gap-2 rounded p-2">
          <Icon className="shrink-0" size={isActive ? 24 : 16} />
          {title}
        </p>
        {isActive && (
          <div className="absolute right-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-md bg-blue-600" />
        )}
      </Link>
      <Separator className="my-px h-px bg-stone-600" />
    </Fragment>
  ),
)

LinkItem.displayName = "LinkItem"

export const DepartmentLinks = memo(
  ({ departmentId, user, userId, dealType, pathName }: DepartmentLinksProps) => {
    const getDealLinks = useMemo(() => {
      switch (departmentId) {
        case 1:
          return dealsSalesDepartment
        case 2:
          return pagesMarkretingDepartment
        default:
          return []
      }
    }, [departmentId])

    const renderLinks = useMemo(
      () =>
        getDealLinks.map((deal) => {
          const isActive = dealType === deal.id && user.id === userId
          const href =
            departmentId === 1
              ? `${user.url}/${deal.id}/${user.id}`
              : `${user.url}/${departmentId}/${user.id}`
          return (
            <LinkItem
              href={href}
              icon={departmentId === 1 ? BookText : ChartColumnBig}
              isActive={isActive}
              key={deal.id}
              onClick={(e) => e.stopPropagation()}
              title={deal.title}
            />
          )
        }),
      [dealType, user.id, user.url, userId, getDealLinks, departmentId],
    )

    if (user.position === NOT_MANAGERS_POSITIONS.DEVELOPER) {
      return null
    }

    if (user.position === NOT_MANAGERS_POSITIONS.ASSISTANT_MANAGER) {
      // return (
      //   <LinkItem
      //     key={user.id}
      //     href={`${user.url}/orders`}
      //     title={table.orders.title}
      //     icon={departmentId === 1 ? BookText : ChartColumnBig}
      //     isActive={
      //       departmentId === user.departmentId &&
      //       user.id === userId &&
      //       dealType === table.orders.id
      //     }
      //     onClick={(e) => e.stopPropagation()}
      //   />
      // );
      return null
    }

    if (departmentId === 2) {
      return (
        <>
          {renderLinks}
          <ProtectedByPermissions permission={PermissionEnum.VIEW_UNION_REPORT}>
            <Accordion className="w-full" collapsible type="single">
              <AccordionItem value="item-1">
                <AccordionTrigger className="p-1 rounded-md transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground">
                  <p className="flex h-full w-full items-center gap-2 rounded p-2 text-primary dark:text-stone-400">
                    <TableProperties size="12px" />
                    <span>Сводные таблицы</span>
                  </p>
                </AccordionTrigger>
                <AccordionContent className="grid w-full gap-1 pl-5 relative">
                  {namePagesByDealType.map((type, index) => {
                    const isActiveSummaryTable =
                      pathName?.includes("summary-table") &&
                      pathName?.includes(type.toLocaleLowerCase()) &&
                      user.id === userId
                    return (
                      <Fragment key={type}>
                        <div className="relative rounded overflow-hidden">
                          {isActiveSummaryTable && <MarketActiveItemSidebar />}
                          <SummaryTableLink
                            className="flex border p-3 text-primary dark:text-stone-400 border-solid border-transparent rounded-md transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground"
                            departmentId="1"
                            protect={false}
                            type={type}
                          />
                        </div>
                        {index !== namePagesByDealType.length - 1 && (
                          <Separator className="my-px h-px bg-stone-600" />
                        )}
                      </Fragment>
                    )
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator className="my-px h-px bg-stone-600" />
          </ProtectedByPermissions>
        </>
      )
    }

    return <>{renderLinks}</>
  },
)

DepartmentLinks.displayName = "DepartmentLinks"
