import { ColumnDef, Table } from '@tanstack/react-table';
import ExcelJS from 'exceljs';

import {
  DeliveryProjectLabels,
  DeliveryRetailLabels,
  DirectionProjectLabels,
  DirectionRetailLabels,
  StatusProjectLabels,
  StatusRetailLabels,
} from '@/feature/deals/lib/constants';
import { formatterCurrency } from '@/shared/lib/utils';
import {
  typeofDelivery,
  typeofDirections,
  typeofStatus,
} from '@/widgets/deal/model/columns-data-project';
import {
  typeofDelivery as RetailDelivery,
  typeofDirections as RetailDirection,
  typeofStatus as RetailStatus,
} from '@/widgets/deal/model/columns-data-retail';

import { TOAST } from '../../../shared/custom-components/ui/Toast';

const colsDefaultValue = ['phone', 'nameDeal', 'nameObject', 'comments'];

type ProjectTableType = 'PROJECT';
function isProjectType(type: string | undefined): type is ProjectTableType {
  return !!type && ['PROJECT'].includes(type);
}

type RetailTableType = 'RETAIL';
function isRetailType(type: string | undefined): type is RetailTableType {
  return !!type && ['RETAIL'].includes(type);
}

/** Сериал Excel-даты (число дней с 1899-12-30) */
function dateToExcelSerial(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  return (
    Math.floor((Date.UTC(y, m, d) - Date.UTC(1899, 11, 30)) / 86400000)
  );
}

/** Преобразование значения для Excel */
function transformExcelValue(
  value: unknown,
  columnId?: string,
  tableType?: string
): string | number | boolean | Date {
  if (value == null) return '';

  if (isProjectType(tableType)) {
    if (typeof value === 'string') {
      if (columnId && colsDefaultValue.includes(columnId)) {
        return value;
      }
      if (
        columnId === 'direction' &&
        DirectionProjectLabels[value as typeofDirections]
      ) {
        return DirectionProjectLabels[value as typeofDirections];
      }
      if (
        columnId === 'deliveryType' &&
        DeliveryProjectLabels[value as typeofDelivery]
      ) {
        return DeliveryProjectLabels[value as typeofDelivery];
      }
      if (
        columnId === 'dealStatus' &&
        StatusProjectLabels[value as typeofStatus]
      ) {
        return StatusProjectLabels[value as typeofStatus];
      }
    }
  } else if (isRetailType(tableType)) {
    if (typeof value === 'string') {
      if (columnId && colsDefaultValue.includes(columnId)) {
        return value;
      }
      if (
        columnId === 'direction' &&
        DirectionRetailLabels[value as RetailDirection]
      ) {
        return DirectionRetailLabels[value as RetailDirection];
      }
      if (
        columnId === 'deliveryType' &&
        DeliveryRetailLabels[value as RetailDelivery]
      ) {
        return DeliveryRetailLabels[value as RetailDelivery];
      }
      if (
        columnId === 'dealStatus' &&
        StatusRetailLabels[value as RetailStatus]
      ) {
        return StatusRetailLabels[value as RetailStatus];
      }
    }
  } else {
    if (
      typeof value === 'string' &&
      columnId &&
      colsDefaultValue.includes(columnId)
    ) {
      return value;
    }
    if (
      columnId === 'dealStatusR' &&
      StatusRetailLabels[value as RetailStatus]
    ) {
      return StatusRetailLabels[value as RetailStatus];
    }
    if (
      columnId === 'dealStatusP' &&
      StatusProjectLabels[value as typeofStatus]
    ) {
      return StatusProjectLabels[value as typeofStatus];
    }
  }

  // Дата-строка
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return dateToExcelSerial(parsed);
    }
  }

  // Дата-объект
  if (value instanceof Date) {
    return dateToExcelSerial(value);
  }

  // Число
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof numericValue === 'number' && !isNaN(numericValue)) {
    return numericValue; // оставляем число, формат зададим при выводе
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .map((v) => transformExcelValue(v, columnId, tableType))
      .join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

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
      sheetName = 'Sheet1',
      includeHeaders = true,
      tableType,
    } = options || {};

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Видимые колонки
    const visibleColumns = columns.filter((col) => {
      const isVisible =
        col.id === undefined ||
        table.getState().columnVisibility[col.id] !== false;
      return col.id !== 'rowNumber' && isVisible;
    });

    // Заголовки
    if (includeHeaders) {
      const headers = visibleColumns.map((col) => col.header as string);
      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '27272A' },
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
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
        const colId = col.id ?? '';
        const value = row.getValue(colId);
        return transformExcelValue(value, colId, tableType);
      });
      worksheet.addRow(rowData);
    });

    // Форматирование
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // заголовки

      row.eachCell((cell, colNumber) => {
        const columnId = visibleColumns[colNumber - 1]?.id;
        const value = cell.value;

        if (columnId && colsDefaultValue.includes(columnId)) {
          cell.numFmt = '@';
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        } else if (typeof value === 'number' && columnId?.toLowerCase().includes('date')) {
          // Это дата (serial number)
          cell.numFmt = 'dd.mm.yyyy';
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else if (typeof value === 'number') {
          cell.numFmt = '#,##0.00';
          cell.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        if (rowNumber % 2 !== 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D3D3D3' },
          };
        }
      });
    });

    worksheet.columns = visibleColumns.map((col, index) => {
      const isTextColumn = col.id && colsDefaultValue.includes(col.id);
      const isNumericColumn =
        col.id &&
        ['amount', 'price', 'sum', 'total'].some((prefix) =>
          col.id?.toLowerCase().includes(prefix)
        );

      let width = Math.max(10, Math.min(50, String(col.header).length + 2));

      if (isTextColumn) {
        width = 25;
      } else if (isNumericColumn) {
        width = 15;
      }

      return { width };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error('Excel export failed:', error);
    TOAST.ERROR('Не удалось сгенерировать файл Excel');
    throw new Error('Не удалось сгенерировать файл Excel');
  }
};
