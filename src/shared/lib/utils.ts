import { TableType, DealsUnionType } from "@/entities/deal/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatterCurrency = new Intl.NumberFormat("ru", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatPhoneNumber = (value: string): string => {
  if (!value) return ""

  // Очищаем от всего, кроме цифр
  let cleaned = value.replace(/\D/g, "")

  if (cleaned.length > 11) {
    cleaned = cleaned.substring(0, 11)
  }

  // Форматируем: +7 (999) 123-45-67
  if (cleaned.length === 0) return ""

  if (cleaned.startsWith("7")) {
    cleaned = `7${cleaned.substring(1)}`
  } else if (cleaned.startsWith("8")) {
    cleaned = `7${cleaned.substring(1)}`
  }

  let formatted = "+7"

  if (cleaned.length > 1) {
    formatted += ` (${cleaned.substring(1, 4)}`
  }
  if (cleaned.length > 4) {
    formatted += `) ${cleaned.substring(4, 7)}`
  }
  if (cleaned.length > 7) {
    formatted += `-${cleaned.substring(7, 9)}`
  }
  if (cleaned.length > 9) {
    formatted += `-${cleaned.substring(9, 11)}`
  }

  return formatted
}

export const normalizePhone = (phone: string): string => {
  if (!phone) {
    return ""
  } else {
    const normalized = phone.replace(/\D/g, "") // убираем всё, кроме цифр
    return `+${normalized}`
  }
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function capitalizeFullName(fullName: string): string {
  if (!fullName) return ""

  return fullName
    .split(" ")
    .map((word) => capitalizeFirstLetter(word))
    .join(" ")
}

export function toMoscowISOString(date: Date): string {
  const moscowTime = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))

  return moscowTime.toISOString()
}

export async function subscribeUser() {
  if (!("serviceWorker" in navigator)) return null

  const reg = await navigator.serviceWorker.ready

  return await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  })
}

export const TAB_TO_DEAL_TYPE: Record<TableType, DealsUnionType> = {
  projects: "projects",
  retails: "retails",
  contracts: "projects",
}

// export const mapTabToDealType = (tab: TableType): DealsUnionType => {
//   return TAB_TO_DEAL_TYPE[tab]
// }
