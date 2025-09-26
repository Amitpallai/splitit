"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {   LogOut } from "lucide-react"

export function LogoutDialog() {
  const [open, setOpen] = useState(false)

  function handleLogout() {
    // Clear token/session
    localStorage.removeItem("token")
    // Redirect to login
    window.location.href = "/login"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-start flex gap-2 px-2 text-sm hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-[#2B2B2B] py-1 rounded-md"><LogOut className="w-4"/>Logout</button>
      </DialogTrigger>

      <DialogContent className="max-w-sm p-4">
        <DialogTitle className="text-lg font-semibold">Logout</DialogTitle>
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to log out?
          </p>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
