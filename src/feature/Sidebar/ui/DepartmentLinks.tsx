import { NOT_MANAGERS_POSITIONS } from "@/entities/department/lib/constants"
import type { DepartmentUserItem } from "@/entities/department/types"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import { PermissionEnum } from "@prisma/client"
import { Separator } from "@radix-ui/react-separator"
import { BookText, ChartColumnBig } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Fragment, memo, useMemo } from "react"

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
  resourcePath?: string
}

const dealsSalesDepartment: DealsType[] = [
  { id: "projects", title: "Проекты" },
  { id: "retails", title: "Розница" },
  { id: "contracts", title: "Договора" },
]

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
        getDealLinks.map((link) => {
          const isActive = dealType === link.id && user.id === userId
          const href =
            departmentId === 1
              ? `${user.url}/${link.id}/${user.id}`
              : `${user.url}/${departmentId}/${user.id}${link.resourcePath || ""}`
          return (
            <LinkItem
              href={href}
              icon={departmentId === 1 ? BookText : ChartColumnBig}
              isActive={isActive}
              key={link.id}
              onClick={(e) => e.stopPropagation()}
              title={link.title}
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
            <LinkItem
              href={`dashboard/statistics/request-source/2/${user.id}/tabs`}
              icon={BookText}
              isActive={pathName?.includes("tabs") || false}
              onClick={(e) => e.stopPropagation()}
              title={"Заявки"}
            />
          </ProtectedByPermissions>
        </>
      )
    }

    return <>{renderLinks}</>
  },
)

DepartmentLinks.displayName = "DepartmentLinks"
