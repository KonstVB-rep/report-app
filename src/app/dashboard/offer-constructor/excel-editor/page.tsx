"use client"

import { Workbook } from "@fortune-sheet/react"
import "@fortune-sheet/react/dist/index.css"
import { useMemo, useRef } from "react"
import { useOfferStore } from "../store"

const ExcelEditor = () => {
  const dataParts = useOfferStore((state) => state.dataParts)
  const updateRow = useOfferStore((state) => state.updateRow)

  const workbookRef = useRef<any>(null)

  const handlePrint = () => {
    // Вызываем системную печать браузера для области таблицы
    if (workbookRef.current) {
      // В FortuneSheet обычно используется стандартный window.print()
      // Но предварительно нужно скрыть лишние элементы интерфейса (меню, сайдбары) через CSS
      window.print()
    }
  }

  // 1. Формируем данные (как и раньше)
  const sheets = useMemo(() => {
    const celldata: any[] = []
    let r = 0

    dataParts.parts.forEach((part) => {
      // Строка раздела
      celldata.push({ r, c: 1, v: { m: part.name, bl: 1 } })
      r++

      part.sections.forEach((section) => {
        section.subSections.forEach((sub) => {
          // Строка подраздела
          celldata.push({ r, c: 1, v: { m: sub.name, bg: "#f0f0f0" } })
          r++

          sub.rows.forEach((row) => {
            // Создаем объект метаданных
            const meta = {
              partId: part.id,
              sectionId: section.id,
              subId: sub.id,
              rowId: row.id,
            }

            // Записываем данные в ячейки и ПРИКРЕПЛЯЕМ meta
            celldata.push({
              r,
              c: 1,
              v: { v: row.name, m: row.name, custom: meta },
            })
            celldata.push({
              r,
              c: 2,
              v: { v: row.price, m: String(row.price), custom: meta },
            })
            celldata.push({
              r,
              c: 3,
              v: { v: row.count, m: String(row.count), custom: meta },
            })
            celldata.push({
              r,
              c: 4,
              v: {
                v: row.totalPrice,
                m: String(row.totalPrice),
                custom: meta,
                readOnly: true,
              },
            })
            r++
          })
        })
      })
    })

    return [{ name: "Offer", celldata }]
  }, [dataParts])

  // 2. Ловим изменения через onOp
  // onOp срабатывает на каждое действие (вставка, удаление, ввод)
  const handleOp = (ops: any[]) => {
    ops.forEach((op) => {
      // 'v' означает изменение значения ячейки
      if (op.op === "v") {
        const r = op.path[1] // индекс строки
        const c = op.path[2] // индекс колонки
        const newValue = op.v // объект новой ячейки {v, m, custom...}

        // ДОСТАЕМ НАШ СКРЫТЫЙ ID
        const meta = newValue?.custom

        if (meta) {
          const { partId, sectionId, subId, rowId } = meta

          // Маппинг колонок на поля в сторе
          const fields: Record<number, string> = {
            1: "name",
            2: "price",
            3: "count",
          }

          const field = fields[c]

          if (field) {
            // Вызываем твой экшен обновления в Zustand
            // newValue.v — это чистое значение (строка или число)
            updateRow(partId, sectionId, subId, rowId, field as any, newValue.v)
          }
        }
      }
    })
  }

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <button onClick={handlePrint}>Распечатать КП</button>
      <Workbook
        data={sheets}
        showToolbar={true}
        onOp={handleOp} // Используем onOp вместо несуществующего onAfterChangeCell
      />
    </div>
  )
}

export default ExcelEditor
