"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DarkModeToggle } from "../DarkModeToggle"
import { Moon } from "lucide-react"

export function AppearanceDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-start flex gap-2 px-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2B2B2B] py-1 rounded-md"><Moon className="w-4"/>Appearance</button>
      </DialogTrigger>

      <DialogContent className="max-w-sm p-4">
        <DialogTitle className="text-lg font-semibold">Appearance</DialogTitle>
        <div className="mt-4 flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Appearance</p>
            <p className="text-sm text-muted-foreground">
              Turn Dark mode on or off.
            </p>
          </div>
          <DarkModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}
