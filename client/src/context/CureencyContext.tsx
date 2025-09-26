"use client"

import{ createContext, useContext, useState, useEffect,type ReactNode } from "react"

interface CurrencyContextType {
  currency: string
  setCurrency: (value: string) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("currency") || "USD"
    setCurrency(saved)
  }, [])

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (currency) {
      localStorage.setItem("currency", currency)
    }
  }, [currency])

  // Don't render children until currency is loaded
  if (!currency) return null

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

// Custom hook for easy access
export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
