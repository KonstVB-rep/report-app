import { exportСalculationToExcel } from "../lib/exportСalculationToExcel"

self.onmessage = async (e) => {
  const { dataOffer, image } = e.data
  // Финализируем
  const buffer = await exportСalculationToExcel(dataOffer, image)

  // Отправляем массив байтов обратно
  self.postMessage(buffer)
}
