export enum StatusProject {
  INVOICE_ISSUED = "Выставлен счет",
  ACTUAL = "Актуально",
  REJECT = "Не актуально / Отказ",
  PAID = "Оплачено",
  APPROVAL = "Согласование договора",
  UNDER_APPROVAL = "На согласовании",
  FIRST_CP_APPROVAL = "1-е КП на согласовании",
  CONTRACT_ADVANCE_PAYMENT = "Договор / Авансирование",
  // PROGRESS = "Проект в работе / Закупка / Производство",
  // DELIVERY_WORKS = "Поставка / Выполнение работ",
  // SIGN_ACTS_PAYMENT = "Подписание актов / Оплата",
  CLOSED = "Закрыт",
}

export enum StatusRetail {
  FIRST_CP_APPROVAL = "1-е КП на согласовании",
  APPROVAL = "На согласовании",
  ACTUAL = "Актуально",
  REJECT = "Не актуально / Отказ",
  INVOICE_ISSUED = "Выставлен счёт / Авансирование",
  PROGRESS = "В работе / Закупка / Производство",
  PAID = "Оплачено",
  CLOSED = "Закрыт",
}

export type AllStatusKeys =
  | keyof typeof StatusProject
  | keyof typeof StatusRetail;
