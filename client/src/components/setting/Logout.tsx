// Logout.tsx
"use client"

import { Button } from "@/components/ui/button"

export function Logout() {
  function handleLogout() {
    // Clear token/session (example)
    localStorage.removeItem("token")
    // Redirect to login or home
    window.location.href = "/login"
  }

  return (
    <div className="p-4 bg-transparent border-1 rounded-xl flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Are you sure you want to log out?
      </p>
      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
