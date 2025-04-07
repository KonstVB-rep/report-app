import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  CellContext,
  Row,
  Table,
  Column,
} from "@tanstack/react-table";

function toRenderedValue(value: unknown): string | number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return String(value);
}


interface ExcelCellContext<TData, TValue> {
    getValue: () => TValue;
    row: Row<TData>;
    column: Column<TData, TValue>;
    table: Table<TData>;
  }

export const downloadToExcel = <
  TData extends Record<string, unknown>,
  TValue = unknown
>(
  data: TData[],
  columns: ColumnDef<TData, TValue>[],
  columnFilters: ColumnFiltersState,
  columnVisibility: VisibilityState
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Table Data");

  const allCols = columns.map((col) => ({ id: col.id, header: col.header }));

  const columnsToExclude = Object.keys(columnVisibility).filter(
    (col) => !columnVisibility[col as keyof TData & string]
  );

  const colsVisible = allCols.filter(
    (col) => !columnsToExclude.includes(col.id as string)
  );

  const filteredData = data.filter((item) =>
    columnFilters.every((filter) => {
      const value = item[filter.id as keyof TData];

      if (filter.value) {
        if (filter.id === "dateRequest") {
          if (typeof value !== "string" && typeof value !== "number")
            return false;

          const dateValue = new Date(value);
          const { from, to } = filter.value as { from?: Date; to?: Date };

          if (from && to) return dateValue >= from && dateValue <= to;
          if (from) return dateValue >= from;
          if (to) return dateValue <= to;
        }

        return value
          ?.toString()
          .toLowerCase()
          .includes(
            typeof filter.value === "string"
              ? filter.value.toLowerCase()
              : ""
          );
      }

      return true;
    })
  );

  const transformedData = filteredData.map((row) => {
    const newRow: Partial<Record<string, string | number | null>> = {};

    colsVisible.forEach((col) => {
      const rawValue = row[col.id as keyof TData] as TValue;
      let renderedValue: string | number | null = toRenderedValue(rawValue);

      const columnDef = columns.find((c) => c.id === col.id);
      if (!columnDef) return;

      if (columnDef.cell) {
        try {
          const cellContext: ExcelCellContext<TData, TValue> = {
            getValue: () => rawValue,
            row: { original: row } as Row<TData>,
            column: {} as Column<TData, TValue>,
            table: {} as Table<TData>,
          };

          const rendered =
            typeof columnDef.cell === "function"
              ? columnDef.cell(cellContext as CellContext<TData, TValue>)
              : columnDef.cell;

          if (typeof rendered === "string" || typeof rendered === "number") {
            renderedValue = rendered;
          } else if (React.isValidElement(rendered)) {
            const child = (rendered.props as { children?: React.ReactNode })
              .children;
            renderedValue =
              typeof child === "string" || typeof child === "number"
                ? child
                : JSON.stringify(child);
          }
        } catch (e) {
          console.warn(`Не удалось отрендерить ячейку ${col.id}`, e);
        }
      }

      newRow[col.id as string] = renderedValue;
    });

    return newRow;
  });

  worksheet.columns = colsVisible.map((col) => ({
    header: col.header as string,
    key: col.id,
    width: 20,
  }));

  transformedData.forEach((item) => {
    worksheet.addRow(item);
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "table-data.xlsx");
  });
};
