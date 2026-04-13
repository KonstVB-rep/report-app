import type { ColumnDef, Table } from "@tanstack/react-table"
import ExcelJS from "exceljs"
import {
  DeliveryProjectLabels,
  DeliveryRetailLabels,
  DirectionProjectLabels,
  DirectionRetailLabels,
  StatusProjectLabels,
  StatusRetailLabels,
} from "@/feature/deals/lib/constants"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import type {
  typeofDelivery,
  typeofDirections,
  typeofStatus,
} from "@/widgets/deal/model/columns-data-project"
import type {
  typeofDelivery as RetailDelivery,
  typeofDirections as RetailDirection,
  typeofStatus as RetailStatus,
} from "@/widgets/deal/model/columns-data-retail"

const colsDefaultValue = ["phone", "nameDeal", "nameObject", "comments"]

// type ProjectTableType = "PROJECT";
// function isProjectType(type: string | undefined): type is ProjectTableType {
//   return !!type && ["PROJECT"].includes(type);
// }

// type RetailTableType = "RETAIL";
// function isRetailType(type: string | undefined): type is RetailTableType {
//   return !!type && ["RETAIL"].includes(type);
// }

function dateToExcelSerial(date: Date): number {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  return Math.floor((Date.UTC(y, m, d) - Date.UTC(1899, 11, 30)) / 86400000)
}

function transformExcelValue(
  value: unknown,
  columnId?: string,
  tableType?: string,
): string | number | boolean | Date | null {
  if (value == null) return ""

  // 1. Специальная обработка ИНН — всегда как текст
  if (columnId === "inn") {
    return String(value).trim()
  }

  // 2. Суммы — как целое число (без копеек)
  if (["amountCP", "amountWork", "amountPurchase", "delta"].includes(columnId || "")) {
    const num = parseFloat(String(value))
    return Number.isNaN(num) ? 0 : num // округляем до целого
  }

  // 3. Остальные строки из списка
  if (typeof value === "string") {
    if (columnId && colsDefaultValue.includes(columnId)) {
      return value.trim()
    }

    // Лейблы направлений, статусов и т.д.
    if (columnId === "direction") {
      if (tableType === "PROJECT" && DirectionProjectLabels[value as typeofDirections]) {
        return DirectionProjectLabels[value as typeofDirections]
      }
      if (tableType === "RETAIL" && DirectionRetailLabels[value as RetailDirection]) {
        return DirectionRetailLabels[value as RetailDirection]
      }
    }

    if (columnId === "deliveryType") {
      if (tableType === "PROJECT" && DeliveryProjectLabels[value as typeofDelivery]) {
        return DeliveryProjectLabels[value as typeofDelivery]
      }
      if (tableType === "RETAIL" && DeliveryRetailLabels[value as RetailDelivery]) {
        return DeliveryRetailLabels[value as RetailDelivery]
      }
    }

    if (columnId === "dealStatus") {
      if (tableType === "PROJECT" && StatusProjectLabels[value as typeofStatus]) {
        return StatusProjectLabels[value as typeofStatus]
      }
      if (tableType === "RETAIL" && StatusRetailLabels[value as RetailStatus]) {
        return StatusRetailLabels[value as RetailStatus]
      }
    }
  }

  // 4. Преобразование дат
  if (typeof value === "string") {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return dateToExcelSerial(parsed)
    }
  }

  if (value instanceof Date) {
    return dateToExcelSerial(value)
  }

  // 5. Числа
  if (typeof value === "number") {
    return value
  }

  // 6. Остальное
  if (typeof value === "boolean") return value
  if (Array.isArray(value)) {
    return value.map((v) => transformExcelValue(v, columnId, tableType)).join(", ")
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value)
  }

  return String(value).trim()
}

export const downloadToExcel = async <TData>(
  table: Table<TData>,
  columns: ColumnDef<TData>[],
  options?: {
    fileName?: string
    sheetName?: string
    includeHeaders?: boolean
    tableType?: string
  },
) => {
  const {
    fileName = `export-${new Date().toISOString().slice(0, 10)}.xlsx`,
    sheetName = "Sheet1",
    includeHeaders = true,
    tableType,
  } = options || {}

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  const visibleColumns = columns.filter((col) => {
    const isVisible = col.id === undefined || table.getState().columnVisibility[col.id] !== false
    return col.id !== "rowNumber" && isVisible
  })

  if (includeHeaders) {
    const headers = visibleColumns.map((col) => col.header as string)
    worksheet.addRow(headers)
    const headerRow = worksheet.getRow(1)
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "27272A" },
      }
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    })
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: visibleColumns.length },
    }
  }

  const rows = table.getFilteredRowModel().rows
  rows.forEach((row) => {
    const rowData = visibleColumns.map((col) =>
      transformExcelValue(row.getValue(col.id ?? ""), col.id, tableType),
    )
    worksheet.addRow(rowData)
  })

  // Форматирование ячеек
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    row.eachCell((cell, colNumber) => {
      const columnId = visibleColumns[colNumber - 1]?.id
      const value = cell.value

      if (columnId === "email" || (columnId && colsDefaultValue.includes(columnId))) {
        cell.numFmt = "@"
        cell.alignment = { vertical: "middle", horizontal: "left" }
      } else if (typeof value === "number" && columnId?.toLowerCase().includes("date")) {
        cell.numFmt = "dd.mm.yyyy"
        cell.alignment = { vertical: "middle", horizontal: "center" }
      } else if (typeof value === "number") {
        cell.numFmt = "#,##0.00"
        cell.alignment = { vertical: "middle", horizontal: "right" }
      } else {
        cell.alignment = { vertical: "middle", horizontal: "left" }
      }

      if (columnId === "inn") {
        cell.numFmt = "@"
        cell.alignment = { vertical: "middle", horizontal: "right" }
      }

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }

      if (rowNumber % 2 !== 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D3D3D3" },
        }
      }
    })
  })

  worksheet.columns = visibleColumns.map((col) => {
    const isTextColumn = col.id && colsDefaultValue.includes(col.id)
    const isNumericColumn =
      col.id &&
      ["amount", "price", "sum", "total"].some((prefix) => col.id?.toLowerCase().includes(prefix))
    let width = Math.max(10, Math.min(50, String(col.header).length + 2))
    if (isTextColumn) width = 25
    else if (isNumericColumn) width = 15
    return { width }
  })

  // Асинхронная операция — после всех циклов
  try {
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: "application/octet-stream" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click()
  } catch (error) {
    console.error("Excel export failed:", error)
    TOAST.ERROR("Не удалось сгенерировать файл Excel")
    throw new Error("Не удалось сгенерировать файл Excel")
  }
}
