import { saveAs } from "file-saver";
import { toast } from "sonner";
import type { DataOffer } from "../store";

export const handleOfferToExcel = (
  dataOffer: DataOffer,
  columnSizing: Record<string, number>,
) => {
  // Возвращаем промис, чтобы toast.promise его подхватил
  const exportPromise: Promise<DataOffer> = new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../workers/exportOffer.worker.ts", import.meta.url),
    );

    worker.postMessage({ dataOffer, columnSizing });

    worker.onmessage = (e) => {
      const buffer = e.data;
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `КП_${dataOffer.number}.xlsx`);

      // Добавляем микро-паузу (например, 500мс)
      // Чтобы resolve сработал КОГДА браузер уже инициировал скачивание
      setTimeout(() => {
        worker.terminate();
        resolve(dataOffer);
      }, 500);
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(err); // Ошибка! Тост покажет состояние error
    };
  });

  // Внедряем toast.promise
  toast.promise(exportPromise, {
    loading: "Генерация файла Excel...",
    success: (data: DataOffer) =>
      `КП №${data.number} успешно сгенерировано, идет скачивание...`,
    error: "Ошибка при экспорте",
  });
};
