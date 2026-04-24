"use client"

import { Button } from "@/shared/components/ui/button"
import { set } from "idb-keyval"
import { exportToExcel } from "./ExportToExcel"
import List from "./List"
import { addPart, addSection, selectItemStoreId, useOfferStore } from "./store"

const storageKey = "offer_global_column_sizing"

const OfferConstructor = () => {
  const selectedChapter = useOfferStore(selectItemStoreId)
  const dataParts = useOfferStore.getState().dataParts

  const columnSizing = JSON.parse(localStorage.getItem(storageKey) || "{}")

  // 3. Собираем всё в один объект
  const fullPayload = {
    dataParts,
    columnSizing,
  }
  const encodedData = encodeURIComponent(JSON.stringify(fullPayload))

  const handlePreview = async () => {
    const payload = {
      dataParts: useOfferStore.getState().dataParts,
      columnSizing: JSON.parse(localStorage.getItem("offerConstructor_global_sizing") || "{}"),
    }

    // 1. Сохраняем в IndexedDB (лимитов почти нет)
    await set("pdf_preview_payload", payload)

    // 2. Открываем вкладку
    window.open("/dashboard/offer-constructor/preview", "_blank")
  }

  // const handlePreview = () => {
  //   // 1. Создаем канал связи
  //   const channel = new BroadcastChannel("pdf_preview_data");

  //   // 2. Открываем вкладку превью (она пока будет пустая)
  //   window.open("/dashboard/offer-constructor/preview", "_blank");

  //   // 3. Слушаем сигнал от той вкладки
  //   channel.onmessage = (event) => {
  //     if (event.data === "READY_TO_RECEIVE") {
  //       // 4. Как только та вкладка сказала "Готова", шлем ей всё добро
  //       const payload = {
  //         dataParts: useOfferStore.getState().dataParts,
  //         columnSizing: JSON.parse(
  //           localStorage.getItem("offerConstructor_global_sizing") || "{}",
  //         ),
  //       };

  //       channel.postMessage(payload);
  //       channel.close(); // Закрываем за собой рацию
  //     }
  //   };
  // };

  // const handleDownload = async () => {
  //   // 1. Берем ВЕСЬ стейт из стора (через .getState())
  //   const fullData = useOfferStore.getState().dataParts;

  //   // 2. Шлем JSON на наш серверный Puppeteer
  //   const res = await fetch("/api/pdf", {
  //     method: "POST",
  //     body: JSON.stringify(fullData),
  //   });

  //   const blob = await res.blob();
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "Commercial_Offer.pdf";
  //   a.click();
  // };

  return (
    <>
      <List />

      <div className="fixed flex gap-1 bottom-0 left-1/2 transform -translate-x-1/2 p-4 bg-black rounded-tl-2xl rounded-tr-2xl z-50">
        <Button
          onClick={() => {
            addPart()
          }}
        >
          Добавить раздел
        </Button>
        <Button onClick={() => addSection(selectedChapter)}>Добавить подраздел</Button>
        {/* <Button variant="secondary" onClick={handleDownloadPdf}>
          Скачать PDF
        </Button> */}

        {/* <Link
          href={`/dashboard/offer-constructor/preview?data=${encodedData}`}
          target="_blank"
        >
          Посмотреть PDF
        </Link> */}

        <Button variant="secondary" onClick={handlePreview}>
          Посмотреть PDF
        </Button>
        <Button onClick={() => exportToExcel(dataParts, columnSizing)}>Экспорт в Excel</Button>
      </div>
    </>
  )
}

export default OfferConstructor
