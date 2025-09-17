"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

export function NotificationSwitch() {
  const [enabled, setEnabled] = useState(false)

  const handleToggle = (checked: boolean) => {
    setEnabled(checked)
    toast(`Notifications ${checked ? "On" : "Off"}`)
  }

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">Notifications</p>
        <p className="text-sm text-muted-foreground">
          Turn app notifications on or off.
        </p>
      </div>
      <Switch checked={enabled} onCheckedChange={handleToggle} />
    </div>
  )
}
