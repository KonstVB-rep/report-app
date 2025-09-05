import { ColumnDef, Table } from "@tanstack/react-table";

import ExcelJS from "exceljs";

import {
  DeliveryProjectLabels,
  DeliveryRetailLabels,
  DirectionProjectLabels,
  DirectionRetailLabels,
  StatusProjectLabels,
  StatusRetailLabels,
} from "@/feature/deals/lib/constants";
import { formatterCurrency } from "@/shared/lib/utils";
import {
  typeofDelivery,
  typeofDirections,
  typeofStatus,
} from "@/widgets/deal/model/columns-data-project";
import {
  typeofDelivery as RetailDelivery,
  typeofDirections as RetailDirection,
  typeofStatus as RetailStatus,
} from "@/widgets/deal/model/columns-data-retail";

import { TOAST } from "../../../shared/custom-components/ui/Toast";

export const downloadToExcel = async <TData>(
  table: Table<TData>,
  columns: ColumnDef<TData>[],
  options?: {
    fileName?: string;
    sheetName?: string;
    includeHeaders?: boolean;
    tableType?: string;
  }
) => {
  try {
    const {
      fileName = `export-${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName = "Sheet1",
      includeHeaders = true,
      tableType,
    } = options || {};

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Берём только видимые колонки
    const visibleColumns = columns.filter((col) => {
      const isVisible =
        col.id === undefined ||
        table.getState().columnVisibility[col.id] !== false;
      return col.id !== "rowNumber" && isVisible;
    });

    // Добавляем заголовки
    if (includeHeaders) {
      const headers = visibleColumns.map((col) => col.header as string);
      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "27272A" },
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: visibleColumns.length },
      };
    }

    // Данные
    const rows = table.getFilteredRowModel().rows;
    rows.forEach((row) => {
      const rowData = visibleColumns.map((col) => {
        const colId = col.id ?? "";
        const value = row.getValue(colId);
        return transformExcelValue(value, colId, tableType);
      });
      worksheet.addRow(rowData);
    });

    // Стили для всех ячеек
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (rowNumber % 2 !== 0 && rowNumber !== 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D3D3D3" }, // Серый цвет
          };
        }
      });
    });

    // Автоматическая ширина колонок
    worksheet.columns = visibleColumns.map((col) => ({
      header: col.header as string,
      width: Math.max(10, Math.min(50, String(col.header).length + 2)),
    }));

    // Скачивание файла без дополнительной библиотеки
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error("Excel export failed:", error);
    TOAST.ERROR("Не удалось сгенерировать файл Excel");
    throw new Error("Не удалось сгенерировать файл Excel");
  }
};
type ProjectTableType = "PROJECT";
function isProjectType(type: string | undefined): type is ProjectTableType {
  return !!type && ["PROJECT"].includes(type);
}

type RetailTableType = "RETAIL";
function isRetailType(type: string | undefined): type is RetailTableType {
  return !!type && ["RETAIL"].includes(type);
}

// Маппинг значений под PROJECT и RETAIL
function transformExcelValue(
  value: unknown,
  columnId?: string,
  tableType?: string
): string | number | boolean | Date {
  if (value == null) return "";

  if (isProjectType(tableType)) {
    if (typeof value === "string") {
      if (
        columnId === "direction" &&
        DirectionProjectLabels[value as typeofDirections]
      ) {
        return DirectionProjectLabels[value as typeofDirections];
      }
      if (
        columnId === "deliveryType" &&
        DeliveryProjectLabels[value as typeofDelivery]
      ) {
        return DeliveryProjectLabels[value as typeofDelivery];
      }
      if (
        columnId === "dealStatus" &&
        StatusProjectLabels[value as typeofStatus]
      ) {
        return StatusProjectLabels[value as typeofStatus];
      }
    }
  } else if (isRetailType(tableType)) {
    if (typeof value === "string") {
      if (
        columnId === "direction" &&
        DirectionRetailLabels[value as RetailDirection]
      ) {
        return DirectionRetailLabels[value as RetailDirection];
      }
      if (
        columnId === "deliveryType" &&
        DeliveryRetailLabels[value as RetailDelivery]
      ) {
        return DeliveryRetailLabels[value as RetailDelivery];
      }
      if (
        columnId === "dealStatus" &&
        StatusRetailLabels[value as RetailStatus]
      ) {
        return StatusRetailLabels[value as RetailStatus];
      }
    }
  }

  // Преобразуем строку в число, если это возможно
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  // Проверка на числа
  if (typeof numericValue === "number" && !isNaN(numericValue)) {
    return formatterCurrency.format(numericValue); // Форматируем как валюту
  }

  // Проверка на дату (если значение является строкой, пытаемся преобразовать в Date)
  if (typeof value === "string") {
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
      return dateValue; // Возвращаем дату, если строка успешно преобразована в объект Date
    }
  }

  // Если значение уже объект Date
  if (value instanceof Date) {
    return value; // Форматируем дату через numFmt
  }

  // Для строк и булевых значений
  if (typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  // Для массивов
  if (Array.isArray(value)) {
    return value
      .map((v) => transformExcelValue(v, columnId, tableType))
      .join(", ");
  }

  // Для объектов
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  // По умолчанию возвращаем строку
  return String(value);
}
