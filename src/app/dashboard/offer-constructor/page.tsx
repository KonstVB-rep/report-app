"use client";

import { Button } from "@/shared/components/ui/button";
import List from "./List";
import { addPart, addSection, selectItemStoreId, useOfferStore } from "./store";

const OfferConstructor = () => {
  const selectedChapter = useOfferStore(selectItemStoreId);

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

  const handleDownloadPdf = async () => {
    const dataParts = useOfferStore.getState().dataParts;
    const columnSizing = JSON.parse(
      localStorage.getItem("offerConstructor_global_sizing") || "{}",
    );

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataParts, columnSizing }),
      });

      if (!response.ok) throw new Error("Server Error");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Commercial_Offer.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Ошибка скачивания");
    }
  };

  // const handleDownloadPdf = async () => {
  //   const state = useOfferStore.getState().dataParts;

  //   try {
  //     const response = await fetch("/api/pdf", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(state),
  //     });

  //     if (!response.ok) throw new Error("Ошибка генерации PDF");

  //     // 1. Получаем ответ как Blob (массив байтов)
  //     const blob = await response.blob();

  //     // 2. Создаем временную ссылку в памяти браузера
  //     const url = window.URL.createObjectURL(blob);

  //     // 3. Создаем невидимую ссылку и программно кликаем по ней
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `Offer_${state.number || "new"}.pdf`; // Имя файла
  //     document.body.appendChild(link);
  //     link.click();

  //     // 4. Подчищаем за собой
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Ошибка при скачивании:", error);
  //     alert("Не удалось скачать PDF. Проверь консоль.");
  //   }
  // };

  return (
    <>
      <List />

      <div className="fixed flex gap-1 bottom-0 left-1/2 transform -translate-x-1/2 p-4 bg-black rounded-tl-2xl rounded-tr-2xl z-50">
        <Button
          onClick={() => {
            addPart();
          }}
        >
          Добавить раздел
        </Button>
        <Button onClick={() => addSection(selectedChapter)}>
          Добавить подраздел
        </Button>
        <Button variant="secondary" onClick={handleDownloadPdf}>
          Скачать PDF
        </Button>
        {/* <Button variant="secondary" onClick={handleDownload}>
          Только чтение
        </Button> */}
      </div>
    </>
  );
};

export default OfferConstructor;
