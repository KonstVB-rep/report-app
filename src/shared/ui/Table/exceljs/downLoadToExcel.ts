import { ColumnDef, Table } from "@tanstack/react-table";

import {
  typeofDelivery,
  typeofDirections,
  typeofStatus,
} from "@/app/dashboard/table/[departmentId]/[dealType]/[userId]/model/columns-data-project";
import {
  typeofDelivery as RetailDelivery,
  typeofDirections as RetailDirection,
  typeofStatus as RetailStatus,
} from "@/app/dashboard/table/[departmentId]/[dealType]/[userId]/model/columns-data-retail";
import {
  DeliveryProjectLabels,
  DeliveryRetailLabels,
  DirectionProjectLabels,
  DirectionRetailLabels,
  StatusProjectLabels,
  StatusRetailLabels,
} from "@/entities/deal/lib/constants";

// import React from "react";

// function toRenderedValue(value: unknown): string | number | null {
//   if (value === null || value === undefined) return null;
//   if (typeof value === "string" || typeof value === "number") return value;
//   return String(value);
// }

// interface ExcelCellContext<TData, TValue> {
//   getValue: () => TValue;
//   row: Row<TData>;
//   column: Column<TData, TValue>;
//   table: Table<TData>;
// }

// export const downloadToExcel = async <
//   TData extends Record<string, unknown>,
//   TValue = unknown,
// >(
//   table: Table<TData>,
//   columns: ColumnDef<TData, TValue>[]
// ) => {
//   const [{ Workbook }, { saveAs }] = await Promise.all([
//     import("exceljs"),
//     import("file-saver"),
//   ]);

//   const workbook = new Workbook();
//   const worksheet = workbook.addWorksheet("Table Data");

//   const allCols = columns.map((col) => ({ id: col.id, header: col.header }));
//   const columnVisibility = table.getState().columnVisibility;

//   const columnsToExclude = Object.keys(columnVisibility).filter(
//     (col) => !columnVisibility[col as keyof TData & string]
//   );

//   const colsVisible = allCols.filter(
//     (col) =>
//       !columnsToExclude.includes(col.id as string) && col.id !== "rowNumber"
//   );

//   const filteredData = table
//     .getFilteredRowModel()
//     .rows.map((row) => row.original);

//   const transformedData = filteredData.map((row) => {
//     const newRow: Partial<Record<string, string | number | null>> = {};

//     colsVisible.forEach((col) => {
//       const rawValue = row[col.id as keyof TData] as TValue;
//       let renderedValue: string | number | null = toRenderedValue(rawValue);

//       const columnDef = columns.find((c) => c.id === col.id);
//       if (!columnDef) return;

//       if (columnDef.cell) {
//         try {
//           const cellContext: ExcelCellContext<TData, TValue> = {
//             getValue: () => rawValue,
//             row: { original: row } as Row<TData>,
//             column: {} as Column<TData, TValue>,
//             table: {} as Table<TData>,
//           };

//           const rendered =
//             typeof columnDef.cell === "function"
//               ? columnDef.cell(cellContext as CellContext<TData, TValue>)
//               : columnDef.cell;

//           if (typeof rendered === "string" || typeof rendered === "number") {
//             renderedValue = rendered;
//           } else if (React.isValidElement(rendered)) {
//             const child = (rendered.props as { children?: React.ReactNode })
//               .children;
//             renderedValue =
//               typeof child === "string" || typeof child === "number"
//                 ? child
//                 : JSON.stringify(child);
//           }
//         } catch (e) {
//           console.warn(`Не удалось отрендерить ячейку ${col.id}`, e);
//         }
//       }

//       newRow[col.id as string] = renderedValue;
//     });

//     return newRow;
//   });

//   worksheet.columns = colsVisible.map((col) => ({
//     header: col.header as string,
//     key: col.id,
//     width: 20,
//   }));

//   transformedData.forEach((item) => {
//     worksheet.addRow(item);
//   });

//   workbook.xlsx.writeBuffer().then((buffer) => {
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(blob, "table-data.xlsx");
//   });
// };

export const downloadToExcel = async <
  TData extends Record<string, unknown>,
  TValue = unknown,
>(
  table: Table<TData>,
  columns: ColumnDef<TData, TValue>[],
  options?: {
    fileName?: string;
    sheetName?: string;
    includeHeaders?: boolean;
    tableType?: string;
  }
) => {
  try {
    // Динамический импорт с fallback для tree-shaking
    const xlsx = await import('xlsx/dist/xlsx.mini.min');
    const { utils, writeFile } = xlsx;

    // Настройки по умолчанию
    const {
      fileName = `export-${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName = "Sheet1",
      includeHeaders = true,
      tableType,
    } = options || {};

    // Фильтрация и подготовка колонок
    const visibleColumns = columns.filter((col) => {
      const isVisible =
        col.id === undefined ||
        table.getState().columnVisibility[col.id] !== false;
      return col.id !== "rowNumber" && isVisible;
    });

    // Подготовка данных
    const rows = table.getFilteredRowModel().rows;

    // Оптимизированное преобразование данных
    const data = rows.map((row) => {
      const rowData: Record<string, unknown> = {};
      visibleColumns.forEach((col) => {
        try {
          // Получаем значение с обработкой complex-данных
          const colId = col.id ?? "";
          const value = row.getValue(colId);
          rowData[col.header as string] = transformExcelValue(
            value,
            colId,
            tableType
          );
        } catch (error) {
          console.warn(`Error processing column ${col.id}:`, error);
          rowData[col.header as string] = "ERROR";
        }
      });
      return rowData;
    });

    // Создание книги
    const ws = utils.json_to_sheet(data, {
      skipHeader: !includeHeaders, // Пропуск заголовков если нужно
    });

    if (includeHeaders) {
      const headerStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "F0F0F0" } },
        alignment: { horizontal: "center" },
      };

      visibleColumns.forEach((col, idx) => {
        const cellRef = utils.encode_cell({ c: idx, r: 0 }); // A1, B1, C1...
        if (!ws[cellRef]) {
          ws[cellRef] = { t: "s", v: col.header as string };
        }
        ws[cellRef].s = headerStyle;
      });
    }

    // Настройка ширины колонок
    if (includeHeaders) {
      ws["!cols"] = visibleColumns.map((col) => ({
        wch: Math.max(10, Math.min(50, String(col.header).length + 2)),
      }));
    }

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, sheetName);

    // Запись файла с обработкой ошибок
    writeFile(wb, fileName, {
      compression: true,
      bookType: "xlsx",
    });
  } catch (error) {
    console.error("Excel export failed:", error);
    throw new Error("Failed to generate Excel file");
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

// Вспомогательная функция для преобразования сложных значений
function transformExcelValue(
  value: unknown,
  columnId?: string,
  tableType?: string
): string | number | boolean | Date {
  if (value == null) return "";

  // Для разных таблиц выбираем разные маппинги
  if (isProjectType(tableType)) {
    if (typeof value === "string") {
      if (
        columnId === "direction" &&
        DirectionProjectLabels[value as typeofDirections]
      ) {
        return DirectionProjectLabels[value as typeofDirections]; // Маппинг для статуса задачи
      }
      if (
        columnId === "deliveryType" &&
        DeliveryProjectLabels[value as typeofDelivery]
      ) {
        return DeliveryProjectLabels[value as typeofDelivery]; // Маппинг для приоритета задачи
      }

      if (
        columnId === "dealStatus" &&
        StatusProjectLabels[value as typeofStatus]
      ) {
        return StatusProjectLabels[value as typeofStatus]; // Маппинг для приоритета задачи
      }
    }
  } else if (isRetailType(tableType)) {
    if (typeof value === "string") {
      if (
        columnId === "direction" &&
        DirectionRetailLabels[value as RetailDirection]
      ) {
        return DirectionRetailLabels[value as RetailDirection]; // Маппинг для статуса задачи
      }
      if (
        columnId === "deliveryType" &&
        DeliveryRetailLabels[value as RetailDelivery]
      ) {
        return DeliveryRetailLabels[value as RetailDelivery]; // Маппинг для приоритета задачи
      }

      if (
        columnId === "dealStatus" &&
        StatusRetailLabels[value as RetailStatus]
      ) {
        return StatusRetailLabels[value as RetailStatus]; // Маппинг для приоритета задачи
      }
    }
  }

  // Преобразуем для остальных типов данных
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value
      .map((v) => transformExcelValue(v, columnId, tableType))
      .join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
