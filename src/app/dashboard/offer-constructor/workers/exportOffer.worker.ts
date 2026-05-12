import { exportOfferToExcel } from "../lib/exportOfferToExcel"

self.onmessage = async (e) => {
  const { dataOffer, columnSizing } = e.data
  // Финализируем
  const buffer = await exportOfferToExcel(dataOffer, columnSizing)

  // Отправляем массив байтов обратно
  self.postMessage(buffer)
}
