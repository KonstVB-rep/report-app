// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";
// import { DataOffer } from "../store";

// export const exportToExcel = async (
//   offerData: DataOffer,
//   columnSizing: Record<string, number>,
// ) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("КП");

//   // 1. Отступы документа
//   worksheet.addRow([]); // Отступ сверху
//   worksheet.getColumn(1).width = 4; // Отступ слева (Колонка A)

//   // 2. Настройка колонок (B-I)
//   worksheet.columns = [
//     { key: "margin", width: 4 }, // A
//     { key: "name", width: (columnSizing?.name || 250) / 7 }, // B
//     { key: "description", width: (columnSizing?.description || 200) / 7 }, // C
//     { key: "price", width: (columnSizing?.price || 100) / 7 }, // D
//     { key: "count", width: (columnSizing?.count || 60) / 7 }, // E
//     { key: "totalPrice", width: (columnSizing?.totalPrice || 100) / 7 }, // F
//     { key: "purchasePrice", width: 15 }, // G
//     { key: "purchaseAmount", width: 15 }, // H
//     { key: "delta", width: 15 }, // I
//   ];

//   const headerLabels = [
//     "Наименование",
//     "Описание",
//     "Цена",
//     "Кол-во",
//     "Итого",
//     "Закупка ед.",
//     "Закупка сумма",
//     "Дельта",
//   ];

//   for (const part of offerData.parts) {
//     // --- ЗАГОЛОВОК РАЗДЕЛА (Part) ---
//     const partRow = worksheet.addRow({ name: part.name.toUpperCase() });
//     worksheet.mergeCells(partRow.number, 2, partRow.number, 9);

//     const partCell = partRow.getCell(2);
//     partCell.font = { bold: true, size: 12 };
//     partCell.border = {
//       top: { style: "thick", color: { argb: "FF0070C0" } },
//       bottom: { style: "medium", color: { argb: "FF000000" } },
//     };

//     // --- ШАПКА ТАБЛИЦЫ (БЕЗ ГРАНИЦ) ---
//     const headerRow = worksheet.addRow(["", ...headerLabels]);
//     headerRow.height = 20;
//     headerRow.eachCell((cell, colNumber) => {
//       if (colNumber < 2) return;
//       cell.font = { bold: true, size: 10, color: { argb: "FF666666" } };
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FFFFFFFF" },
//       };
//       cell.alignment = { horizontal: "center", vertical: "middle" };
//       // Границы (border) здесь НЕ ПРИСВАИВАЕМ
//     });

//     for (const section of part.sections) {
//       // --- ТИТУЛ ПОДРАЗДЕЛА (Section) ---
//       const secRow = worksheet.addRow({ name: section.name });
//       worksheet.mergeCells(secRow.number, 2, secRow.number, 9);
//       const secCell = secRow.getCell(2);
//       secCell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FF0070C0" },
//       };
//       secCell.font = { bold: true, color: { argb: "FFFFFFFF" } };
//       secCell.alignment = { horizontal: "left", vertical: "middle" };

//       // --- СТРОКИ ДАННЫХ ---
//       // --- ВНУТРИ ЦИКЛА СТРОК ---
//       for (const row of section.rows) {
//         // 1. Добавляем переносы строк в название, чтобы текст не сползал вниз к картинке
//         // 4-5 переносов обычно хватает, чтобы освободить место под фото 100px
//         const nameWithPadding = `${row.name}\n\n\n\n\n`;

//         const excelRow = worksheet.addRow({
//           margin: "",
//           name: nameWithPadding,
//           description: row.description,
//           price: Number(row.price || 0),
//           count: Number(row.count || 0),
//           totalPrice: Number(row.totalPrice || 0),
//           purchasePrice: Number(row.purchasePrice || 0),
//           purchaseAmount: Number(row.purchaseAmount || 0),
//           delta: Number(row.delta || 0),
//         });

//         // Высота строки должна быть достаточной для текста + фото
//         excelRow.height = 160;

//         excelRow.eachCell((cell, colNumber) => {
//           if (colNumber < 2) return;
//           cell.border = {
//             top: { style: "thin", color: { argb: "FFCCCCCC" } },
//             left: { style: "thin", color: { argb: "FFCCCCCC" } },
//             bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
//             right: { style: "thin", color: { argb: "FFCCCCCC" } },
//           };
//           // Прижимаем текст строго к верху (vertical: 'top')
//           cell.alignment = {
//             vertical: "top",
//             horizontal: "left",
//             wrapText: true,
//             indent: 1,
//           };
//         });

//         if (row.image) {
//           try {
//             const res = await fetch(row.image);
//             const arrayBuffer = await res.arrayBuffer();
//             const imageId = workbook.addImage({
//               buffer: arrayBuffer,
//               extension: "png",
//             });

//             worksheet.addImage(imageId, {
//               tl: {
//                 col: 1, // Колонка B
//                 row: excelRow.number - 1,
//                 // nativeRowOff: сдвигаем картинку вниз на ~45-50 пикселей (450000 EMU)
//                 // чтобы она оказалась под первой-второй строкой текста
//                 // @ts-ignore
//                 nativeRowOff: 450000,
//                 // @ts-ignore
//                 nativeColOff: 100000,
//               },
//               ext: { width: 100, height: 100 },
//               editAs: "oneCell",
//             });
//           } catch (e) {
//             console.error("Image error", e);
//           }
//         }
//       }
//     }
//     worksheet.addRow([]); // Пробел после каждого раздела
//   }

//   // Форматирование чисел
//   [4, 6, 7, 8, 9].forEach((idx) => {
//     worksheet.getColumn(idx).numFmt = "#,##0.00";
//   });

//   const buffer = await workbook.xlsx.writeBuffer();
//   saveAs(new Blob([buffer]), `Offer_${offerData.number || "new"}.xlsx`);
// };

// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";
// import { DataOffer } from "../store";

// export const exportOfferToExcel = async (
//   offerData: DataOffer,
//   columnSizing: Record<string, number>,
// ) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("КП");

//   // 1. ОТСТУПЫ
//   worksheet.addRow([]);
//   worksheet.getColumn(1).width = 4;

//   // 2. КОЛОНКИ
//   worksheet.columns = [
//     { key: "margin", width: 4 },
//     { key: "name", width: (columnSizing?.name || 250) / 7 },
//     { key: "description", width: (columnSizing?.description || 200) / 7 },
//     { key: "price", width: (columnSizing?.price || 100) / 7 },
//     { key: "count", width: (columnSizing?.count || 60) / 7 },
//     { key: "totalPrice", width: (columnSizing?.totalPrice || 100) / 7 },
//     { key: "purchasePrice", width: 15 },
//     { key: "purchaseAmount", width: 15 },
//     { key: "delta", width: 15 },
//   ];

//   const headerLabels = [
//     "Наименование",
//     "Описание",
//     "Цена",
//     "Кол-во",
//     "Итого",
//     "Цена закупки",
//     "Закупка сумма",
//     "Дельта",
//   ];

//   for (const part of offerData.parts) {
//     // РАЗДЕЛ
//     const partRow = worksheet.addRow({ name: part.name.toUpperCase() });
//     worksheet.mergeCells(partRow.number, 2, partRow.number, 9);
//     const partCell = partRow.getCell(2);
//     partCell.font = { bold: true, size: 12 };

//     // ПРАВИЛЬНЫЙ ТИП Borders
//     partCell.border = {
//       top: { style: "thick", color: { argb: "FF0070C0" } },
//       bottom: { style: "medium", color: { argb: "FF000000" } },
//       left: { style: "thin", color: { argb: "FFCCCCCC" } },
//       right: { style: "thin", color: { argb: "FFCCCCCC" } },
//     };
//     partCell.alignment = { vertical: "top", horizontal: "left" };

//     // ШАПКА ТАБЛИЦЫ
//     const headRow = worksheet.addRow(["", ...headerLabels]);
//     headRow.eachCell((cell, colNum) => {
//       if (colNum < 2) return;
//       cell.font = { bold: true, size: 10, color: { argb: "FF666666" } };
//       cell.alignment = { vertical: "top", horizontal: "center" };
//     });

//     for (const section of part.sections) {
//       // ПОДРАЗДЕЛ
//       const secRow = worksheet.addRow({ name: section.name });
//       worksheet.mergeCells(secRow.number, 2, secRow.number, 9);
//       const secCell = secRow.getCell(2);
//       secCell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FF0070C0" },
//       };
//       secCell.font = { bold: true, color: { argb: "FFFFFFFF" } };
//       secCell.alignment = { vertical: "top", horizontal: "left" };

//       let sTotal = 0;
//       let sPurch = 0;
//       let sDelta = 0;

//       for (const row of section.rows) {
//         sTotal += Number(row.totalPrice || 0);
//         sPurch += Number(row.purchaseAmount || 0);
//         sDelta += Number(row.delta || 0);

//         const start = worksheet.lastRow!.number + 1;
//         const mainRow = worksheet.addRow({
//           name: row.name,
//           description: row.description,
//           price: Number(row.price || 0),
//           count: Number(row.count || 0),
//           totalPrice: Number(row.totalPrice || 0),
//           purchasePrice: Number(row.purchasePrice || 0),
//           purchaseAmount: Number(row.purchaseAmount || 0),
//           delta: Number(row.delta || 0),
//         });

//         // ИСПРАВЛЕННЫЙ ОБЪЕКТ ГРАНИЦ
//         const dataBorder: Partial<ExcelJS.Borders> = {
//           top: { style: "thin", color: { argb: "FFCCCCCC" } },
//           left: { style: "thin", color: { argb: "FFCCCCCC" } },
//           bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
//           right: { style: "thin", color: { argb: "FFCCCCCC" } },
//         };

//         if (row.image) {
//           const imageRow = worksheet.addRow({});
//           imageRow.height = 110;
//           const end = imageRow.number;

//           worksheet.mergeCells(`B${start}:B${end}`);
//           const nameCell = worksheet.getCell(`B${start}`);
//           nameCell.alignment = { vertical: "top", wrapText: true, indent: 1 };

//           ["C", "D", "E", "F", "G", "H", "I"].forEach((col) => {
//             worksheet.mergeCells(`${col}${start}:${col}${end}`);
//             const c = worksheet.getCell(`${col}${start}`);
//             c.alignment = {
//               vertical: "top",
//               horizontal: "center",
//               wrapText: true,
//             };
//             c.border = dataBorder;
//           });

//           nameCell.border = dataBorder;

//           try {
//             const res = await fetch(row.image);
//             const arrayBuffer = await res.arrayBuffer();
//             const imageId = workbook.addImage({
//               buffer: arrayBuffer,
//               extension: "png",
//             });
//             const colWidth = columnSizing?.name || 250;
//             const imgWidth = 100;
//             const leftOffset = Math.max(0, (colWidth - imgWidth) / 2) * 9525;

//             worksheet.addImage(imageId, {
//               tl: {
//                 col: 1,
//                 row: end - 1,
//                 // @ts-ignore
//                 nativeRowOff: 100000,
//                 // @ts-ignore
//                 nativeColOff: leftOffset,
//               },
//               ext: { width: imgWidth, height: 100 },
//               editAs: "oneCell",
//             });
//           } catch (e) {
//             console.error(e);
//           }
//         } else {
//           mainRow.eachCell((cell, colNum) => {
//             if (colNum < 2) return;
//             cell.border = dataBorder;
//             cell.alignment = {
//               vertical: "top",
//               horizontal: colNum === 2 ? "left" : "center",
//               wrapText: true,
//               indent: colNum === 2 ? 1 : 0,
//             };
//           });
//         }
//       }

//       // ИТОГО ПО СЕКЦИИ
//       const totalRow = worksheet.addRow({
//         name: `ИТОГО: ${section.name}`,
//         totalPrice: sTotal,
//         purchaseAmount: sPurch,
//         delta: sDelta,
//       });
//       worksheet.mergeCells(totalRow.number, 2, totalRow.number, 5);

//       const totalBorder: Partial<ExcelJS.Borders> = {
//         top: { style: "thin", color: { argb: "FFCCCCCC" } },
//         bottom: { style: "medium", color: { argb: "FF000000" } },
//         left: { style: "thin", color: { argb: "FFCCCCCC" } },
//         right: { style: "thin", color: { argb: "FFCCCCCC" } },
//       };

//       totalRow.eachCell((cell, colNum) => {
//         if (colNum < 2) return;
//         cell.font = { bold: true };
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FFF5F5F5" },
//         };
//         cell.border = totalBorder;
//         cell.alignment = {
//           vertical: "top",
//           horizontal: colNum === 2 ? "right" : "center",
//         };
//       });
//     }
//     worksheet.addRow([]);
//   }

//   // 4. ФОРМАТИРОВАНИЕ ЧИСЕЛ
//   [4, 6, 7, 8, 9].forEach((idx) => {
//     worksheet.getColumn(idx).numFmt = "#,##0.00";
//   });

//   const buffer = await workbook.xlsx.writeBuffer();
//   saveAs(new Blob([buffer]), `Offer_${offerData.number || "new"}.xlsx`);
// };

import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { DataOffer } from "../store"

export const exportOfferToExcel = async (
  offerData: DataOffer,
  columnSizing: Record<string, number>,
) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("КП")

  // 1. ИНИЦИАЛИЗАЦИЯ КОЛОНОК
  worksheet.columns = [
    { key: "margin", width: 4 }, // A
    { key: "name", width: (columnSizing?.name || 250) / 7.5 },
    { key: "description", width: (columnSizing?.description || 200) / 7.5 },
    { key: "price", width: 15 },
    { key: "count", width: 10 },
    { key: "totalPrice", width: 18 },
    { key: "purchasePrice", width: 15 },
    { key: "purchaseAmount", width: 18 },
    { key: "delta", width: 15 },
  ]

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

  for (const part of offerData.parts) {
    let partTotalOffer = 0
    let partTotalPurchase = 0
    let partTotalDelta = 0

    // --- РАЗДЕЛ (PART) ---
    worksheet.addRow({})
    const partRow = worksheet.addRow({ name: part.name.toUpperCase() })
    worksheet.mergeCells(partRow.number, 2, partRow.number, 9)

    // Проходим по всем ячейкам строки раздела, чтобы задать границы
    for (let i = 2; i <= 9; i++) {
      const cell = partRow.getCell(i)
      cell.font = { bold: true, size: 12 }
      cell.border = {
        top: { style: "thick", color: { argb: "FF0070C0" } },
        bottom: { style: "medium", color: { argb: "FF000000" } },
        left: { style: "thin" },
        right: { style: "thin" },
      }
      cell.alignment = { vertical: "middle", horizontal: "left" }
    }

    for (const section of part.sections) {
      // --- СЕКЦИЯ (ПОДРАЗДЕЛ) ---
      const secRow = worksheet.addRow({ name: section.name })
      worksheet.mergeCells(secRow.number, 2, secRow.number, 9)

      for (let i = 2; i <= 9; i++) {
        const cell = secRow.getCell(i)
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0070C0" },
        }
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
        cell.alignment = { vertical: "middle", horizontal: "left" }
      }

      // --- ШАПКА ТАБЛИЦЫ ---
      const hRow = worksheet.addRow(["", ...headerLabels])
      hRow.eachCell((cell, i) => {
        if (i < 2) return
        cell.font = { bold: true, size: 9, color: { argb: "FF666666" } }
        cell.alignment = { horizontal: "center", vertical: "middle" }
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF2F2F2" },
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      })

      for (const row of section.rows) {
        partTotalOffer += Number(row.totalPrice || 0)
        partTotalPurchase += Number(row.purchaseAmount || 0)
        partTotalDelta += Number(row.delta || 0)

        const startRowIdx = worksheet.lastRow!.number + 1
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
            cell.alignment = {
              vertical: "top",
              horizontal: col === 2 || col === 3 ? "left" : "right",
              wrapText: true,
              indent: col === 2 ? 1 : 0,
            }
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            }
            if (col >= 4 && col !== 5) cell.numFmt = "#,##0.00"
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
            cell.alignment = {
              vertical: "middle",
              horizontal: i === 2 ? "left" : "center",
              wrapText: true,
            }
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            }
            if (i >= 4 && i !== 5) cell.numFmt = "#,##0.00"
          })
        }
      }
    }

    // --- ИТОГО ПО РАЗДЕЛУ ---
    const totalRow = worksheet.addRow({
      name: `ИТОГО "${part.name.toUpperCase()}":`,
      totalPrice: partTotalOffer,
      purchaseAmount: partTotalPurchase,
      delta: partTotalDelta,
    })
    worksheet.mergeCells(totalRow.number, 2, totalRow.number, 5)
    totalRow.height = 25

    // 1. Сначала проходим по всем ячейкам для задания общих стилей (бордеры, фон)
    totalRow.eachCell({ includeEmpty: true }, (cell, i) => {
      if (i < 2) return

      cell.font = { bold: true, size: 10 }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" },
      }

      // Добавляем боковые границы, чтобы сетка не разрывалась
      cell.border = {
        top: { style: "medium" },
        bottom: { style: "thin" },
      }

      // Стандартное выравнивание для числовых ячеек (6, 7, 8, 9)
      cell.alignment = { vertical: "middle", horizontal: "center" }
    })

    // 2. А теперь ЯВНО настраиваем нашу объединенную ячейку (B+C+D+E)
    const mergedCell = totalRow.getCell(2)
    mergedCell.alignment = {
      vertical: "middle",
      horizontal: "right", // Строго вправо
      indent: 1, // Небольшой отступ от ПРАВОЙ границы (чтобы не липло к линии)
    }

    // 3. Формат чисел для сумм (F, G, H, I)
    for (let i = 6; i <= 9; i++) {
      totalRow.getCell(i).numFmt = "#,##0.00"
    }
    worksheet.addRow([])
  }

  // --- НАСТРОЙКИ ПЕЧАТИ (ОБЯЗАТЕЛЬНЫ ДЛЯ PDF) ---
  const lastRow = worksheet.lastRow ? worksheet.lastRow.number : 100

  // 1. Область печати: только полезные колонки (A-F)
  worksheet.pageSetup.printArea = `A1:F${lastRow}`

  // 2. Убираем поля (Margins). Если не указать - Excel поставит свои по 2 см.
  worksheet.pageSetup.margins = {
    left: 0.2,
    right: 0.2,
    top: 0.5,
    bottom: 0.5,
    header: 0,
    footer: 0,
  }

  // 3. Центрируем таблицу на листе
  worksheet.pageSetup.horizontalCentered = true

  // 4. Масштабирование (вместить всё в одну страницу по ширине)
  worksheet.pageSetup.fitToPage = true
  worksheet.pageSetup.fitToWidth = 1
  worksheet.pageSetup.fitToHeight = 0

  for (let i = 2; i <= 9; i++) {
    const cell = worksheet.getCell(2, i)
    cell.border = { ...cell.border, top: { style: "medium" } }
  }

  // 2. Нижняя граница (последняя строка, от B до I)
  for (let i = 2; i <= 9; i++) {
    const cell = worksheet.getCell(lastRow, i)
    cell.border = { ...cell.border, bottom: { style: "medium" } }
  }

  // 3. Левая граница (колонка B, от 2 строки до последней)
  for (let i = 2; i <= lastRow; i++) {
    const cell = worksheet.getCell(i, 2)
    cell.border = { ...cell.border, left: { style: "medium" } }
  }

  // 4. Правая граница (колонка I, от 2 строки до последней)
  for (let i = 2; i <= lastRow; i++) {
    const cell = worksheet.getCell(i, 9)
    cell.border = { ...cell.border, right: { style: "medium" } }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), `Offer_${offerData.number || "export"}.xlsx`)
}
