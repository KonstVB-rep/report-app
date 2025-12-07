"use client"

import { UnionDealTypeParams } from "@/entities/deal/lib/constants"
import { DepartmentLabels } from "@/entities/department/lib/constants"
import type {
  DepartmentListItemType,
  DepartmentsUnionIds,
  DepartmentUserItem,
} from "@/entities/department/types"
import useStoreUser from "@/entities/user/store/useStoreUser"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/shared/components/ui/sidebar"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import { PermissionEnum } from "@prisma/client"
import clsx from "clsx"
import { ChevronRight } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { memo, type PropsWithChildren, useCallback, useState } from "react"
import z from "zod"
import { DepartmentLinks } from "./DepartmentLinks"
import LinkProfile from "./LinkProfile"

const pageParamsSchema = z.object({
  dealType: z.enum(UnionDealTypeParams).optional(),
  userId: z.string().optional(),
  departmentId: z.coerce
    .number()
    .positive()
    .transform((value) => {
      return value as DepartmentsUnionIds
    })
    .optional(),
})

const DepartmentPersonsList = ({ item }: { item: DepartmentListItemType }) => {
  const { departmentId } = useTypedParams(pageParamsSchema)

  const { authUser } = useStoreUser()

  const router = useRouter()

  const [open, setOpen] = useState(false)

  const isActiveDepartment = item.id === Number(departmentId)

  const handleDepartmentClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      router.push(item.url)
    },
    [router, item.url],
  )

  if (!authUser) return null

  const currentUser = item.items.find((user) => user.id === authUser.id)

  return (
    <ProtectedByPermissions
      defaultNode={currentUser ? <SideBarMenuItemWrapper user={currentUser} /> : null}
      permission={PermissionEnum.VIEW_USER_REPORT}
    >
      <Collapsible asChild onOpenChange={() => setOpen((prev) => !prev)} open={open}>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className={clsx(
              "h-max border-2 border-border",
              isActiveDepartment && "border-blue-600 text-primary dark:text-stone-400",
            )}
            onClick={handleDepartmentClick} // Используем мемоизированную функцию
            tooltip={item.title}
          >
            <div
              className={clsx(!item.icon && "grid gap-0.5", "cursor-pointer")}
              style={{ width: "calc(100% - 45px)" }}
            >
              {item.icon ?? null}
              <span className="text-primary">
                {DepartmentLabels[item.title as keyof typeof DepartmentLabels]}
              </span>
            </div>
          </SidebarMenuButton>

          {item.items?.length ? (
            <DrppdownSidebarItem isActiveDepartment={isActiveDepartment} item={item} />
          ) : null}
        </SidebarMenuItem>
      </Collapsible>
    </ProtectedByPermissions>
  )
}

export default memo(DepartmentPersonsList)

const SideBarMenuItemWrapper = ({ user }: { user: DepartmentUserItem }) => {
  const { dealType, userId } = useTypedParams(pageParamsSchema)
  const pathname = usePathname()

  const isActiveUser = user.id === userId
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={clsx(
          "h-max items-start",
          isActiveUser && "bg-zinc-300 text-primary dark:bg-background",
        )}
        tooltip={user.username}
      >
        <Accordion className="w-full pr-1!" collapsible type="single">
          <AccordionItem className="group/item w-full border-none" value="item-1">
            <AccordionTrigger className="mr-0.5 w-full py-1 hover:no-underline">
              <div className="relative flex flex-col gap-0.5">
                <span className="font-semibold capitalize">{user.username}</span>
                <span className="text-xs text-zinc-500">{user.position}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="grid w-full gap-1 p-2">
              <DepartmentLinks
                dealType={dealType}
                departmentId={user.departmentId}
                pathName={pathname}
                user={user}
                userId={userId}
              />

              <LinkProfile user={user} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const DrppdownSidebarItem = ({
  item,
  isActiveDepartment,
}: {
  item: DepartmentListItemType
  isActiveDepartment: boolean
}) => {
  return (
    <>
      <CollapsibleTrigger
        asChild
        className="top-[1.25px]! h-[38px]! w-[38px]! border! border-stone-800 dark:border-stone-400"
      >
        <SidebarMenuAction className="h-6 w-6 border-2 data-[state=open]:rotate-90">
          <ChevronRight
            className={clsx(
              "h-max rounded",
              isActiveDepartment && "h-full! w-full! p-1.5 text-primary dark:text-stone-400",
            )}
          />
          <span className="sr-only">Toggle</span>
        </SidebarMenuAction>
      </CollapsibleTrigger>

      <DropdownSidebarItemContent>
        {item.items.map((user) => {
          return <SideBarMenuItemWrapper key={user.id} user={user} />
        })}
      </DropdownSidebarItemContent>
    </>
  )
}

const DropdownSidebarItemContent = ({ children }: PropsWithChildren) => {
  return (
    <CollapsibleContent>
      <SidebarMenuSub className="mr-auto mt-2 pr-1">{children}</SidebarMenuSub>
    </CollapsibleContent>
  )
}
