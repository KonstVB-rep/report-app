import type { PermissionEnum, User } from "@prisma/client"
import type { CheckedState } from "@radix-ui/react-checkbox"
import type { CellContext, ColumnDef } from "@tanstack/react-table"
import { endOfDay, startOfDay } from "date-fns"
import { UserCheck } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { DepartmentLabelsById } from "@/entities/department/lib/constants"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { cn } from "@/shared/lib/utils"
import { PermissionUser, RolesUser } from "./objectTypes"

export type UserTypeTable = User & {
  permissions: PermissionEnum[]
  telegramInfo: string
  lastlogin: Date
}

export const columnsDataUsers: ColumnDef<UserTypeTable, unknown>[] = [
  {
    id: "rowNumber",
    header: "№",
    cell: ({ row }) => Number(row.index) + 1,
    enableHiding: false,
    enableSorting: false,
    accessorFn: () => "",
    minSize: 80,
    maxSize: 80,
  },
  {
    id: "id",
    header: "",
    cell: (info) => info.getValue(),
    enableHiding: true,
    meta: {
      hidden: true,
    },
    filterFn: (row, _, filterValues) => {
      if (!filterValues || filterValues.length === 0) {
        return true
      }

      const userIdOfProject = row.original.id
      return filterValues.includes(userIdOfProject)
    },
    accessorFn: (row: UserTypeTable) => row.id,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Label className={cn("flex items-center justify-center cursor-pointer gap-1")}>
        {table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected() ? (
          <UserCheck />
        ) : (
          "Выбрать"
        )}
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="opacity-0 w-0 h-0"
          onCheckedChange={(value: CheckedState) => table.toggleAllPageRowsSelected(!!value)}
        />
      </Label>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value: CheckedState) => row.toggleSelected(!!value)}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    minSize: 80,
    maxSize: 80,
  },
  {
    id: "username",
    header: "Имя",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const value = info.getValue() as string
      return value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    },
    accessorFn: (row: UserTypeTable) => {
      return row.username
    },
  },
  {
    id: "email",
    header: "Элетронная почта",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const value = info.getValue() as string
      return value
    },
    accessorFn: (row: UserTypeTable) => {
      return row.email
    },
  },
  {
    id: "phone",
    header: "Телефон",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const value = info.getValue() as string
      return value
    },
    accessorFn: (row: UserTypeTable) => row.phone,
    minSize: 140,
    maxSize: 140,
  },
  {
    id: "position",
    header: "Должность",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const value = info.getValue() as string
      return value.split(" ")[0].charAt(0).toUpperCase() + value.split(" ")[0].slice(1)
    },
    accessorFn: (row: UserTypeTable) => row.position,
  },
  {
    id: "telegramInfo",
    header: "телеграм данные",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const value = info.getValue() as string
      return value
    },
    accessorFn: (row: UserTypeTable) => row.telegramInfo,
  },
  {
    id: "departmentId",
    header: "Отдел",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const value = info.getValue() as string
      return DepartmentLabelsById[value]
    },
    accessorFn: (row: UserTypeTable) => row.departmentId,
  },
  {
    id: "role",
    header: "Роль",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const value = info.getValue() as string
      return RolesUser[value as keyof typeof RolesUser]
    },
    accessorFn: (row: UserTypeTable) => row.role,
  },
  {
    id: "permissions",
    header: "Разрешения",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const value = info.getValue() as string[]
      if (Array.isArray(value))
        return (
          <span className="block text-left" style={{ whiteSpace: "break-spaces" }}>
            {value.map((item) => PermissionUser[item as PermissionEnum]).join(",\n")}
          </span>
        )
      return value
    },
    accessorFn: (row: UserTypeTable) => row.permissions,
  },
  {
    id: "lastlogin",
    header: "Последняя сессия",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const date = info.getValue() as Date
      return date.toLocaleDateString("ru-RU")
    },
    enableHiding: true,
    meta: {
      isDateFilter: true,
    },
    enableResizing: false,
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId) as Date
      const dateAtStartOfDay = startOfDay(date)

      if (filterValue) {
        const { from, to } = filterValue as DateRange

        if (from && to) {
          const toAtEndOfDay = endOfDay(to)
          return dateAtStartOfDay >= startOfDay(from) && dateAtStartOfDay <= toAtEndOfDay
        }

        if (from) {
          return dateAtStartOfDay >= startOfDay(from)
        }
        if (to) {
          return dateAtStartOfDay <= endOfDay(to)
        }
        return false
      }

      return true
    },
    accessorFn: (row: UserTypeTable) => row.lastlogin,
    minSize: 120,
    maxSize: 120,
  },
  {
    id: "createdAt",
    header: "Дата регистрации",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const date = info.getValue() as Date
      return date.toLocaleDateString("ru-RU")
    },
    enableHiding: true,
    meta: {
      isDateFilter: true,
    },
    enableResizing: false,
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId) as Date
      const dateAtStartOfDay = startOfDay(date)

      if (filterValue) {
        const { from, to } = filterValue as DateRange

        if (from && to) {
          const toAtEndOfDay = endOfDay(to)
          return dateAtStartOfDay >= startOfDay(from) && dateAtStartOfDay <= toAtEndOfDay
        }

        if (from) {
          return dateAtStartOfDay >= startOfDay(from)
        }
        if (to) {
          return dateAtStartOfDay <= endOfDay(to)
        }
        return false
      }

      return true
    },
    accessorFn: (row: UserTypeTable) => row.createdAt,
    minSize: 120,
    maxSize: 120,
  },
  {
    id: "updatedAt",
    header: "Дата обновления",
    cell: (info: CellContext<UserTypeTable, unknown>) => {
      const date = info.getValue() as Date
      return date.toLocaleDateString("ru-RU")
    },
    enableHiding: true,
    meta: {
      isDateFilter: true,
    },
    // size: 100, // Фиксированная ширина
    enableResizing: false,
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId) as Date
      const dateAtStartOfDay = startOfDay(date)

      if (filterValue) {
        const { from, to } = filterValue as DateRange

        if (from && to) {
          const toAtEndOfDay = endOfDay(to)
          return dateAtStartOfDay >= startOfDay(from) && dateAtStartOfDay <= toAtEndOfDay
        }

        if (from) {
          return dateAtStartOfDay >= startOfDay(from)
        }
        if (to) {
          return dateAtStartOfDay <= endOfDay(to)
        }
        return false
      }

      return true
    },
    accessorFn: (row: UserTypeTable) => row.updatedAt,
    minSize: 120,
    maxSize: 120,
  },
]
