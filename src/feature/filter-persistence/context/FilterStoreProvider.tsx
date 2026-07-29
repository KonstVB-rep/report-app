"use client"

import type React from "react"
import { createContext, useContext, useRef } from "react"
import { createFilterStore, type FilterStoreInstanceType } from "../store/filterStore"

const FilterStoreContext = createContext<FilterStoreInstanceType | null>(null)

export const FilterStoreProvider = ({
  children,
  storageName,
}: {
  children: React.ReactNode
  storageName: string
}) => {
  const storeRef = useRef<FilterStoreInstanceType | null>(null)
  if (!storeRef.current) {
    storeRef.current = createFilterStore(storageName)
  }

  return (
    <FilterStoreContext.Provider value={storeRef.current}>{children}</FilterStoreContext.Provider>
  )
}

// Внутренний хук для безопасного извлечения стора из контекста
export const useFilterStoreInstance = () => {
  const context = useContext(FilterStoreContext)
  if (!context) throw new Error("useFilterStoreInstance must be used within FilterStoreProvider")
  return context
}
