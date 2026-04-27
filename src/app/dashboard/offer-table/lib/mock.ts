import type { DataOffer } from "@/app/dashboard/offer-table/store"

export const mockOfferData: DataOffer = {
  date: new Date(),
  number: "КП-2024-001",
  parts: [
    {
      id: "part-1",
      name: "Система видеонаблюдения",
      sections: [
        {
          id: "section-1",
          name: "Камеры уличные", // Это был твой SubSection, теперь это просто Секция
          rows: [
            {
              id: "row-1",
              name: "IP-камера Hikvision DS-2CD2043G2-I",
              description: "4Мп уличная цилиндрическая IP-камера с EXIR-подсветкой до 40м",
              price: "12500",
              count: 4,
              totalPrice: "50000",
              purchasePrice: "8500",
              purchaseAmount: "34000",
              delta: "12500",
            },
            {
              id: "row-2",
              name: "Кронштейн для крепления на столб",
              description: "Универсальный стальной кронштейн",
              price: "1500",
              count: 4,
              totalPrice: "6000",
              purchasePrice: "900",
              purchaseAmount: "3600",
              delta: "1980",
            },
          ],
        },
        {
          id: "section-2",
          name: "Сетевое оборудование",
          rows: [
            {
              id: "row-3",
              name: "PoE-коммутатор HiWatch DS-S908P",
              description: "8-портовый неуправляемый POE коммутатор",
              price: "8900",
              count: 1,
              totalPrice: "8900",
              purchasePrice: "6200",
              purchaseAmount: "6200",
              delta: "2077",
            },
          ],
        },
      ],
    },
    {
      id: "part-2",
      name: "Монтажные и пусконаладочные работы",
      sections: [
        {
          id: "section-3",
          name: "Услуги и монтаж",
          rows: [
            {
              id: "row-4",
              name: "Установка камеры на высоте до 3м",
              description: "Включая юстировку и настройку",
              price: "3500",
              count: 4,
              totalPrice: "14000",
              purchasePrice: "0",
              purchaseAmount: "0",
              delta: "13020",
            },
          ],
        },
      ],
    },
  ],
}
