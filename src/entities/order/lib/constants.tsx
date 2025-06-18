export const STATUS_ORDER = {
  SUBMITTED_TO_WORK: "Передано в работу",
  AT_WORK: "В работе"
} as const;

export const defaultOrderValues = {
  dateRequest: "",
    nameDeal: "",
    contact: "",
    email: "",
    manager: "",
    comments: "",
    phone: "",
    resource: ""
}