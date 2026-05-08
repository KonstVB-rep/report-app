import { saveAs } from "file-saver";
import { toast } from "sonner";
import type { DataOffer } from "../store";

export const handleСalculationToExcel = (
  dataOffer: DataOffer,
  image: string,
) => {
  const exportPromise: Promise<DataOffer> = new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../workers/exportCalculation.worker.ts", import.meta.url),
    );

    worker.postMessage({ dataOffer, image });

    worker.onmessage = (e) => {
      const buffer = e.data;
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `Расчет_${dataOffer.number}.xlsx`);

      setTimeout(() => {
        worker.terminate();
        resolve(dataOffer);
      }, 500);
    };

    worker.onerror = (_err) => {
      toast.error("Ошибка в экспорта");
      worker.terminate();
    };
  });
  toast.promise(exportPromise, {
    loading: "Генерация файла Excel...",
    success: (data: DataOffer) => `Расчет №${data.number} успешно скачан`,
    error: "Ошибка при экспорте",
  });
};
