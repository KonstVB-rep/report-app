import ExcelJS from "exceljs"
import type { DataOffer } from "../store"
import { BASE_FONT_COLOR, FONT_FAMILY } from "./constants"
import { format } from "./excelUtils"

export const exportOfferToExcel = async (
  offerData: DataOffer,
  columnSizing: Record<string, number>,
) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("КП")

  worksheet.addRow({})

  worksheet.columns = [
    { key: "margin", width: 4 },
    { key: "name", width: (columnSizing?.name || 250) / 10 },
    { key: "description", width: (columnSizing?.description || 200) / 10 },
    { key: "price", width: 12 },
    { key: "count", width: 8 },
    { key: "totalPrice", width: 14 },
    { key: "purchasePrice", width: 12 },
    { key: "purchaseAmount", width: 14 },
    { key: "delta", width: 12 },
  ]

  worksheet.columns.forEach((column) => {
    column.font = {
      name: FONT_FAMILY,
      size: 11,
      bold: false,
      color: { argb: BASE_FONT_COLOR },
    }
  })

  const headerLabels = [
    "Наименование",
    "Описание",
    "Цена,руб.",
    "Кол-во",
    "Итого, руб.",
    "Цена закупки",
    "Закупка сумма",
    "Дельта",
  ]

  for (const [pIdx, part] of offerData.parts.entries()) {
    let partTotalOffer = 0
    let partTotalPurchase = 0
    let partTotalDelta = 0

    // --- РАЗДЕЛ (PART) ---
    worksheet.addRow({})
    const blurLine = worksheet.addRow({})

    blurLine.height = 8

    for (let i = 2; i <= 9; i++) {
      const cell = blurLine.getCell(i)

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0070C0" },
      }

      cell.border = {}
    }

    const partOrderNumber = `${pIdx + 1}.`

    const partRow = worksheet.addRow({
      name: `${partOrderNumber} ${part.name.toUpperCase()}`,
    })
    worksheet.mergeCells(partRow.number, 2, partRow.number, 9)

    // Проходим по всем ячейкам строки раздела, чтобы задать границы
    for (let i = 2; i <= 9; i++) {
      const cell = partRow.getCell(i)
      cell.font = { bold: true, size: 18 }
      cell.border = {
        bottom: { style: "medium" },
        // left: { style: "thin" },
        // right: { style: "thin" },
      }
      cell.alignment = { vertical: "middle", horizontal: "left" }
    }

    const hRow = worksheet.addRow(["", ...headerLabels])
    hRow.eachCell((cell, i) => {
      if (i < 2) return
      cell.font = {
        bold: true,
        size: 16,
      }
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF2F2F2" },
      }
    })

    for (const [sIdx, section] of part.sections.entries()) {
      const sectionOrderNumber = `${pIdx + 1}.${sIdx + 1}.`

      const secRow = worksheet.addRow({
        name: `${sectionOrderNumber} ${section.name}`,
      })

      worksheet.mergeCells(secRow.number, 2, secRow.number, 9)

      for (let i = 2; i <= 9; i++) {
        const cell = secRow.getCell(i)
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0070C0" },
        }
        cell.font = {
          bold: true,
          size: 18,
          color: { argb: "FFFFFFFF" },
        }
        cell.border = {
          // top: { style: "thin" },
          // left: { style: "thin" },
          // bottom: { style: "thin" },
          // right: { style: "thin" },
        }
        cell.alignment = { vertical: "middle", horizontal: "left" }
      }

      for (const row of section.rows) {
        partTotalOffer += Number(row.totalPrice || 0)
        partTotalPurchase += Number(row.purchaseAmount || 0)
        partTotalDelta += Number(row.delta || 0)

        const startRowIdx = (worksheet.lastRow?.number ?? 0) + 1
        const mainRow = worksheet.addRow({
          name: row.name,
          description: row.description,
          price: Number(row.price || 0),
          count: Number(row.count || 0),
          totalPrice: Number(row.totalPrice || 0),
          purchasePrice: Number(row.purchasePrice || 0),
          purchaseAmount: Number(row.purchaseAmount || 0),
          delta: Number(row.delta || 0),
        })

        if (row.image) {
          const imgRow = worksheet.addRow({})
          imgRow.height = 100
          const endRowIdx = imgRow.number

          for (let col = 2; col <= 9; col++) {
            worksheet.mergeCells(startRowIdx, col, endRowIdx, col)
            const cell = worksheet.getCell(startRowIdx, col)
            cell.font = {
              size: 16,
            }
            cell.alignment = {
              vertical: "top",
              horizontal: col === 2 || col === 3 ? "left" : col === 5 ? "center" : "right",
              wrapText: true,
              indent: col === 2 ? 1 : 0,
            }
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            }
            if (col >= 4 && col !== 5) cell.numFmt = format
          }

          try {
            const res = await fetch(row.image)
            const buf = await res.arrayBuffer()
            const imgId = workbook.addImage({ buffer: buf, extension: "png" })
            const colWidth = (worksheet.getColumn(2).width || 35) * 7.5
            const leftPad = Math.max(0, (colWidth - 90) / 2)

            worksheet.addImage(imgId, {
              tl: {
                col: 1,
                row: startRowIdx - 1,
                nativeColOff: leftPad * 9525,
                nativeRowOff: 450000,
              },
              ext: { width: 90, height: 90 },
            })
          } catch (e) {
            console.error(e)
          }
        } else {
          mainRow.height = 30
          mainRow.eachCell((cell, i) => {
            if (i < 2) return
            cell.font = {
              size: 16,
            }

            cell.alignment = {
              vertical: "middle",
              horizontal: i === 2 || i === 3 ? "left" : i === 5 ? "center" : "right",
              wrapText: true,
            }
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            }
            if (i >= 4 && i !== 5) cell.numFmt = format
          })
        }
      }
    }

    // --- ИТОГО ПО РАЗДЕЛУ ---
    const beforeTotalRow = worksheet.addRow({})
    beforeTotalRow.height = 10
    for (let i = 2; i <= 9; i++) {
      const cell = worksheet.getCell(beforeTotalRow.number, i)
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
      }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      }
    }
    const totalRow = worksheet.addRow({
      name: `ИТОГО ${part.name.toUpperCase()}:`,
      totalPrice: partTotalOffer,
      purchaseAmount: partTotalPurchase,
      delta: partTotalDelta,
    })
    worksheet.mergeCells(totalRow.number, 2, totalRow.number, 5)
    totalRow.height = 25

    // 1. Сначала проходим по всем ячейкам для задания общих стилей (бордеры, фон)
    totalRow.eachCell({ includeEmpty: true }, (cell, i) => {
      if (i < 2) return

      cell.font = { bold: true, size: 16 }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" },
      }

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
      if (i >= 4) cell.numFmt = format
      cell.border = {
        top: { style: "medium" },
        bottom: { style: "thin" },
      }

      // Стандартное выравнивание для числовых ячеек (6, 7, 8, 9)
      cell.alignment = { vertical: "middle", horizontal: "right" }
    })

    const mergedCell = totalRow.getCell(2)
    mergedCell.alignment = {
      vertical: "middle",
      horizontal: "right", // Строго вправо
      indent: 1, // Небольшой отступ от ПРАВОЙ границы (чтобы не липло к линии)
    }

    // 3. Формат чисел для сумм (F, G, H, I)
    for (let i = 6; i <= 9; i++) {
      totalRow.getCell(i).numFmt = format
    }
    worksheet.addRow([])
  }

  // --- НАСТРОЙКИ ПЕЧАТИ (ОБЯЗАТЕЛЬНЫ ДЛЯ PDF) ---
  const lastRow = worksheet.lastRow ? worksheet.lastRow.number : 100

  // 1. Область печати: только полезные колонки (A-F)
  worksheet.pageSetup.printArea = `A1:F${lastRow}`

  // 2. Убираем поля (Margins). Если не указать - Excel поставит свои по 2 см.
  worksheet.pageSetup.margins = {
    left: 0, // Даем отступы, чтобы таблица не растягивалась на весь лист
    right: 0,
    top: 0,
    bottom: 0,
    header: 0,
    footer: 0,
  }

  // 3. Центрируем таблицу на листе
  worksheet.pageSetup.horizontalCentered = true

  // 4. Масштабирование (вместить всё в одну страницу по ширине)
  worksheet.pageSetup.fitToPage = true
  worksheet.pageSetup.fitToWidth = 1
  worksheet.pageSetup.fitToHeight = 0

  // for (let i = 2; i <= 9; i++) {
  //   const cell = worksheet.getCell(2, i);
  //   cell.border = { ...cell.border, top: { style: "medium" } };
  // }

  // // 2. Нижняя граница (последняя строка, от B до I)
  // for (let i = 2; i <= 9; i++) {
  //   const cell = worksheet.getCell(lastRow, i);
  //   cell.border = { ...cell.border, bottom: { style: "medium" } };
  // }

  // // 3. Левая граница (колонка B, от 2 строки до последней)
  // for (let i = 2; i <= lastRow; i++) {
  //   const cell = worksheet.getCell(i, 2);
  //   cell.border = { ...cell.border, left: { style: "medium" } };
  // }

  // // 4. Правая граница (колонка I, от 2 строки до последней)
  // for (let i = 2; i <= lastRow; i++) {
  //   const cell = worksheet.getCell(i, 9);
  //   cell.border = { ...cell.border, right: { style: "medium" } };
  // }

  const buffer = await workbook.xlsx.writeBuffer()
  // saveAs(new Blob([buffer]), `Offer_${offerData.number || "export"}.xlsx`);

  return buffer
}
