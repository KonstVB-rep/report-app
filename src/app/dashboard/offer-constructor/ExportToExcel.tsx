import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { DataOffer } from "./store"

// export const exportToExcel = async (data: DataOffer, columnSizing: any) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Коммерческое предложение");

//   // 1. Настройка колонок (используем твой ресайз)
//   // В Excel ширина измеряется в "знаках", поэтому делим пиксели на 7-10
//   worksheet.columns = [
//     {
//       header: "Наименование",
//       key: "name",
//       width: (columnSizing.name || 200) / 7,
//     },
//     {
//       header: "Описание",
//       key: "description",
//       width: (columnSizing.description || 250) / 7,
//     },
//     { header: "Цена", key: "price", width: (columnSizing.price || 100) / 7 },
//     { header: "Кол-во", key: "count", width: (columnSizing.count || 60) / 7 },
//     {
//       header: "Итого",
//       key: "totalPrice",
//       width: (columnSizing.totalPrice || 100) / 7,
//     },
//   ];

//   // 2. Стилизация шапки
//   worksheet.getRow(1).font = { bold: true };
//   worksheet.getRow(1).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FF1C398E" }, // Твой синий цвет
//   };
//   worksheet.getRow(1).font = { color: { argb: "FFFFFFFF" }, bold: true };

//   // 3. Наполнение данными
//   data.parts.forEach((part) => {
//     // Добавляем строку с названием раздела
//     const partRow = worksheet.addRow({ name: `РАЗДЕЛ: ${part.name}` });
//     partRow.font = { bold: true, size: 14 };
//     worksheet.mergeCells(`A${partRow.number}:E${partRow.number}`);

//     part.sections.forEach((section) => {
//       section.subSections.forEach((sub) => {
//         // Добавляем подраздел
//         const subRow = worksheet.addRow({ name: sub.name });
//         subRow.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FFE9ECEF" },
//         };

//         // Добавляем товары
//         sub.rows.forEach((row) => {
//           worksheet.addRow({
//             name: row.name,
//             description: row.description,
//             price: row.price,
//             count: row.count,
//             totalPrice: row.totalPrice,
//           });

//           // Картинки в ExcelJS добавляются отдельно по координатам,
//           // если нужно - это чуть сложнее через workbook.addImage
//         });
//       });
//     });
//   });

//   // 4. Генерация и скачивание
//   const buffer = await workbook.xlsx.writeBuffer();
//   saveAs(new Blob([buffer]), `Offer_${data.number}.xlsx`);
// };

export const exportToExcel = async (data: DataOffer, columnSizing: any) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("КП")

  // 1. Настройка колонок
  worksheet.columns = [
    { header: "Фото", key: "image", width: 15 }, // Колонка под фото
    {
      header: "Наименование",
      key: "name",
      width: (columnSizing.name || 200) / 7,
    },
    {
      header: "Описание",
      key: "description",
      width: (columnSizing.description || 250) / 7,
    },
    { header: "Цена", key: "price", width: (columnSizing.price || 100) / 7 },
    { header: "Кол-во", key: "count", width: (columnSizing.count || 60) / 7 },
    {
      header: "Итого",
      key: "totalPrice",
      width: (columnSizing.totalPrice || 100) / 7,
    },
  ]

  // 2. Стили заголовка (как делали раньше)
  worksheet.getRow(1).height = 30
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1C398E" },
  }
  worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" }

  // Цикл по данным
  for (const part of data.parts) {
    worksheet.addRow({ name: `РАЗДЕЛ: ${part.name}` }).font = { bold: true }

    for (const section of part.sections) {
      for (const sub of section.subSections) {
        worksheet.addRow({ name: sub.name }).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE9ECEF" },
        }

        // Проходим по строкам данных
        for (const row of sub.rows) {
          // Добавляем строку с данными (картинку в объект не пишем, добавим её отдельно)
          const excelRow = worksheet.addRow({
            name: row.name, // Текст названия
            description: row.description,
            price: row.price,
            count: row.count,
            totalPrice: row.totalPrice,
          })

          // Увеличиваем высоту строки, чтобы влез и текст, и картинка (примерно 120-150)
          excelRow.height = row.image ? 140 : 30

          // Выравнивание текста по верхнему краю, чтобы картинка была ПОД ним
          excelRow.getCell("name").alignment = {
            vertical: "top",
            horizontal: "left",
            wrapText: true,
            indent: 1,
          }

          // Если есть картинка
          if (row.image && row.image.startsWith("data:image")) {
            try {
              const imageId = workbook.addImage({
                base64: row.image,
                extension: "png", // ExcelJS переварит и jpeg
              })

              // Добавляем картинку в ячейку name (это столбец №2, индекс 1)
              worksheet.addImage(imageId, {
                tl: {
                  col: 1, // Столбец B (индекс 1)
                  row: excelRow.number - 1 + 0.3, // Смещение 0.3 строки вниз, чтобы быть под текстом
                },
                ext: { width: 110, height: 110 }, // Размер картинки в пикселях
                editAs: "oneCell",
              })
            } catch (e) {
              console.error("Ошибка вставки картинки:", e)
            }
          }
        }
      }
    }
  }

  // Авто-выравнивание текста во всех ячейках
  worksheet.eachRow((row) => {
    row.alignment = { vertical: "middle", wrapText: true }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), `Offer_${data.number}.xlsx`)
}
