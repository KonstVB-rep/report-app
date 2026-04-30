import ExcelJS, { Fill, ImagePosition } from "exceljs"
import { saveAs } from "file-saver"
import { DataOffer, DataPart } from "../store"

export const exportcСalculationToExcel = async (data: DataOffer, headerImageBase64?: string) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("КП", {
    pageSetup: { paperSize: 9, orientation: "portrait" },
  })

  // Строка формата: разряды, 2 знака, рубль
  const rubleFormat = '#,##0.00" ₽"'
  const percentFormat = "0.00%"

  const grayFill: Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF2F2F2" },
  }

  worksheet.columns = [
    { key: "name", width: 65 }, // A
    { key: "total", width: 25 }, // B
    { key: "cost", width: 18 }, // C
    { key: "deltaRub", width: 18 }, // D
    { key: "deltaPct", width: 12 }, // E
  ]

  // КАРТИНКА
  if (headerImageBase64) {
    try {
      const imageId = workbook.addImage({
        base64: headerImageBase64,
        extension: "png",
      })

      worksheet.addImage(imageId, {
        tl: {
          col: 0,
          row: 0,
          nativeCol: 0,
          nativeColOff: 0,
          nativeRow: 0,
          nativeRowOff: 0,
        },
        br: {
          col: 2,
          row: 6,
          nativeCol: 2,
          nativeColOff: 0,
          nativeRow: 6,
          nativeRowOff: 0,
        },
        ext: { width: 0, height: 0 },
        editAs: "oneCell",
      } as unknown as ImagePosition)

      for (let i = 0; i < 5; i++) worksheet.addRow([])
    } catch (e) {
      console.error("Logo error", e)
    }
  }

  // ТИТУЛЬНЫЙ ЗАГОЛОВОК
  const titleRow = worksheet.addRow([`КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ № ${data.number}`])
  worksheet.mergeCells(titleRow.number, 1, titleRow.number, 2)
  titleRow.height = 40
  titleRow.getCell(1).font = { size: 20, bold: true }
  titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" }

  worksheet.addRow([])

  data.parts.forEach((part: DataPart) => {
    const partRow = worksheet.addRow([part.name.toUpperCase()])
    worksheet.mergeCells(partRow.number, 1, partRow.number, 2)
    partRow.getCell(1).font = {
      size: 14,
      color: { argb: "FF1C398E" },
      bold: true,
    }

    // Серый фон для расчетных заголовков
    ;[3, 4, 5].forEach((c) => {
      partRow.getCell(c).fill = grayFill
    })

    part.sections.forEach((section) => {
      if (section.name) {
        const secRow = worksheet.addRow([section.name])
        secRow.getCell(1).font = { bold: true, italic: true }
        ;[3, 4, 5].forEach((c) => {
          secRow.getCell(c).fill = grayFill
        })
      }

      section.rows.forEach((row) => {
        const total = Number(row.totalPrice || 0)
        const purchase = Number(row.purchaseAmount || 0) // Берем сумму закупки
        const delta = total - purchase
        const deltaPct = total > 0 ? delta / total : 0

        const excelRow = worksheet.addRow([
          row.name,
          total, // B
          purchase, // C
          delta, // D
          deltaPct, // E
        ])

        // ПРИМЕНЯЕМ ФОРМАТЫ
        excelRow.getCell(2).numFmt = rubleFormat // Итого продажа
        excelRow.getCell(3).numFmt = rubleFormat // Закупка
        excelRow.getCell(4).numFmt = rubleFormat // Дельта руб
        excelRow.getCell(5).numFmt = percentFormat // Дельта %

        // Выравнивание для сумм
        ;[2, 3, 4, 5].forEach((c) => {
          excelRow.getCell(c).alignment = { horizontal: "right" }
        })

        // Стили для расчетных колонок (C, D, E)
        ;[3, 4, 5].forEach((c) => {
          const cell = excelRow.getCell(c)
          cell.fill = grayFill
          cell.font = { color: { argb: "FF808080" }, size: 9 }
        })
      })
    })

    worksheet.addRow([])
  })

  worksheet.pageSetup.printArea = `A1:E${worksheet.rowCount}`

  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), `Расчет_${data.number}.xlsx`)
}
