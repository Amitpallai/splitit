"use client"
 
import { DarkModeToggle } from "../DarkModeToggle"

export function Appearance() {
  

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">Appearance</p>
        <p className="text-sm text-muted-foreground">
          Turn Dark mode on or off.
        </p>
      </div>
      <DarkModeToggle/>
    </div>
  )
}
