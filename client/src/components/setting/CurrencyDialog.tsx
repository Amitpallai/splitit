"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Coins } from "lucide-react"
import { useCurrency } from "@/context/CureencyContext"

const CURRENCIES = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
]

export function CurrencyDialog() {
  const [open, setOpen] = React.useState(false)
  const { currency, setCurrency } = useCurrency()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-start flex gap-2 px-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2B2B2B] py-1 rounded-md">
          <Coins className="w-4" /> Currency
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm p-4">
        <DialogTitle className="text-lg font-semibold">Currency Settings</DialogTitle>
        
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Select your preferred currency</p>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  )
}
