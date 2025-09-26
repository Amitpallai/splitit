"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Bell } from "lucide-react"

export function NotificationDialog() {
  const [open, setOpen] = useState(false)
  const [enabled, setEnabled] = useState(false)

  const handleToggle = (checked: boolean) => {
    setEnabled(checked)
    toast(`Notifications ${checked ? "On" : "Off"}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         <button className="w-full text-start flex gap-2 px-2 text-sm hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-[#2B2B2B] py-1 rounded-md"><Bell className="w-4"/>Notification</button>
      </DialogTrigger>

      <DialogContent className="max-w-sm p-4">
        <DialogTitle className="text-lg font-semibold">Notifications</DialogTitle>

        <div className="mt-4 flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Notifications</p>
            <p className="text-sm text-muted-foreground">
              Turn app notifications on or off.
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={handleToggle} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
