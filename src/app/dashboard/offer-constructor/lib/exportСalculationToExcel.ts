import ExcelJS, { type Fill, type ImagePosition } from "exceljs"
// import { saveAs } from "file-saver";
import type { DataOffer, DataPart } from "../store"
import { format, rubleFormat } from "./excelUtils"

const formattedDate = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export const exportСalculationToExcel = async (data: DataOffer, headerImageBase64?: string) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Расчет", {
    pageSetup: {
      paperSize: 9, // A4
      orientation: "portrait",
      // ВОЗВРАЩАЕМ «УМНОЕ» ВПИСЫВАНИЕ
      fitToPage: true,
      fitToWidth: 1, // Строго 1 страница в ширину
      fitToHeight: 0, // В длину может быть сколько угодно страниц
      margins: {
        left: 0, // Минимизируем поля, чтобы больше влезло
        right: 0,
        top: 0,
        bottom: 0,
        header: 0,
        footer: 0,
      },
    },
  })

  const percentFormat = "0.00%"

  const grayFillPart: Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9D9D9" },
  }
  const grayFill: Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF2F2F2" },
  }

  worksheet.columns = [
    { key: "name", width: 100 },
    { key: "total", width: 35 },
    { key: "cost", width: 35 },
    { key: "deltaRub", width: 35 },
    { key: "deltaPct", width: 35 },
  ]

  // 1. ЛОГОТИП
  if (headerImageBase64) {
    try {
      const imageId = workbook.addImage({
        base64: headerImageBase64,
        extension: "png",
      })

      // Картинка визуально занимает строки с 1 по 5 (индексы 0-4)
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        br: { col: 2, row: 6 },
        editAs: "oneCell",
      } as unknown as ImagePosition)

      // ПРЯМАЯ ЗАПИСЬ В СТРОКУ (БЕЗ addRow)
      // Пишем дату в 6-ю строку (индекс 6), чтобы она была СРАЗУ под картинкой
      const dividerRowNumber = 7
      const dividerRow = worksheet.getRow(dividerRowNumber)

      // 2. Высота строки: 1/3 от стандарта (стандарт ~18-20pt, берём 6pt)
      dividerRow.height = 6

      // 3. Применяем нижнюю границу к нужным ячейкам (например, A и B)
      ;["A", "B"].forEach((col) => {
        const cell = worksheet.getCell(`${col}${dividerRowNumber}`)
        cell.border = {
          bottom: {
            style: "medium",
            color: { argb: "FF000000" },
          },
        }
        cell.value = null
      })
      const dateRowNumber = dividerRowNumber + 1
      const dateCell = worksheet.getCell(`B${dateRowNumber}`)

      dateCell.value = `${formattedDate.format(new Date(data.date))}`
      dateCell.alignment = { horizontal: "right" }

      // Чтобы следующие вызовы addRow не прыгали в начало таблицы на пустые ячейки,
      // "подсказываем" Excel, где мы сейчас находимся, добавив пустую строку вручную в конец
      worksheet.addRow([]) // Это будет 7-я строка
    } catch (e) {
      console.error(e)
    }
  }

  // 2. ЗАГОЛОВОК КП
  const titleRow = worksheet.addRow([`КОММЕРЧЕСКОМУ ПРЕДЛОЖЕНИЮ № ${data.number}`])
  worksheet.mergeCells(titleRow.number, 1, titleRow.number, 2)
  titleRow.height = 45
  titleRow.getCell(1).font = { size: 26, bold: true }
  titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" }
  worksheet.addRow([])

  // Глобальные счетчики
  let grandTotal = 0
  let grandCost = 0
  let grandDelta = 0

  // 3. ЦИКЛ ПО ДАННЫМ
  data.parts.forEach((part: DataPart) => {
    let partTotal = 0
    let partCost = 0
    let partDelta = 0

    // Сначала считаем все суммы внутри раздела (включая все секции)
    part.sections.forEach((sec) => {
      sec.rows.forEach((row) => {
        const t = Number(row.totalPrice || 0)
        const c = Number(row.purchaseAmount || 0)
        partTotal += t
        partCost += c
        partDelta += t - c
      })
    })

    // ВЫВОД СТРОКИ РАЗДЕЛА (Суммы в той же строке)
    const borderRow = worksheet.addRow([])
    borderRow.height = 4 // Контролируемая высота линии

    // 2. Основная строка раздела
    const partRow = worksheet.addRow([
      part.name.toUpperCase(),
      partTotal,
      partCost,
      partDelta,
      partTotal > 0 ? partDelta / partTotal : 0,
    ])
    partRow.height = 35

    // Цикл для настройки ОБЕИХ строк
    for (let i = 1; i <= 5; i++) {
      const isBold = [1, 2, 4].includes(i)
      // КРАСИМ ТОНКУЮ ГРАНИЦУ
      const bCell = borderRow.getCell(i)
      bCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0070C0" }, // Тот самый синий цвет
      }

      const boldCell = [1, 2, 4]

      // СТИЛИ ОСНОВНОЙ СТРОКИ РАЗДЕЛА
      const cell = partRow.getCell(i)
      cell.fill = grayFillPart
      if (boldCell.includes(i)) {
        cell.font = {
          size: 16,
          bold: isBold,
          color: { argb: "FF000000" },
        }
      } else {
        cell.font = {
          size: 16,
          color: { argb: "FF000000" },
        }
      }
      cell.alignment = { vertical: "middle" }
      cell.border = {
        bottom: { style: "medium", color: { argb: "FF000000" } },
      }

      // Твои форматы для чисел
      if (i === 2) cell.numFmt = rubleFormat
      if (i > 2) {
        cell.numFmt = i === 5 ? percentFormat : format
        cell.font = { size: 16, bold: true, color: { argb: "FF000000" } }
      }
    }

    // ЦИКЛ ПО ПОДРАЗДЕЛАМ
    part.sections.forEach((section) => {
      let secTotal = 0
      let secCost = 0
      let secDelta = 0

      // Считаем суммы подраздела
      section.rows.forEach((row) => {
        const t = Number(row.totalPrice || 0)
        const c = Number(row.purchaseAmount || 0)
        secTotal += t
        secCost += c
        secDelta += t - c
      })

      const emptyRow = worksheet.addRow([])
      emptyRow.height = 14

      // ВЫВОД СТРОКИ ПОДРАЗДЕЛА
      const secRow = worksheet.addRow([
        section.name,
        secTotal,
        secCost,
        secDelta,
        secTotal > 0 ? secDelta / secTotal : 0,
      ])
      secRow.height = 35

      for (let i = 1; i <= 5; i++) {
        const cell = secRow.getCell(i)
        cell.font = { size: 16 }
        cell.fill = grayFill
        cell.alignment = { vertical: "middle" }
        cell.border = { top: { style: "thin", color: { argb: "FF000000" } } } // Верхняя черная граница

        if (i === 2) cell.numFmt = rubleFormat
        if (i > 2) {
          cell.fill = grayFill
          cell.numFmt = i === 5 ? percentFormat : format
          cell.font = { size: 16, color: { argb: "FF000000" } }
        }
      }
    })

    // Накапливаем гранд итог
    grandTotal += partTotal
    grandCost += partCost
    grandDelta += partDelta

    worksheet.addRow([]) // Отступ между разделами
  })

  // 4. ИТОГО СТОИМОСТЬ (Гранд итог)
  const grandRow = worksheet.addRow([
    "ИТОГО СТОИМОСТЬ КОММЕРЧЕСКОГО ПРЕДЛОЖЕНИЯ:",
    grandTotal,
    grandCost,
    grandDelta,
    grandTotal > 0 ? grandDelta / grandTotal : 0,
  ])
  grandRow.height = 40

  for (let i = 1; i <= 5; i++) {
    const cell = grandRow.getCell(i)
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0070C0" },
    } // Синий фон
    cell.font = { bold: true, size: 16, color: { argb: "FFFFFF00" } } // Желтый текст
    cell.alignment = {
      vertical: "middle",
      horizontal: "right",
    }

    if (i === 2) cell.numFmt = rubleFormat
    if (i > 2) {
      cell.numFmt = i === 5 ? percentFormat : format
    }
  }

  // Область печати: только Наименование (A) и Итого (B)
  worksheet.pageSetup.printArea = `A1:B${worksheet.rowCount}`

  const buffer = await workbook.xlsx.writeBuffer()

  return buffer
  // saveAs(new Blob([buffer]), `Расчет_сводный_${data.number}.xlsx`);
}
