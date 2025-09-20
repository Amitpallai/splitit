"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconUsers,
} from "@tabler/icons-react"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

// Import all dialogs
import { NotificationDialog } from "./setting/Notification"
import { AppearanceDialog } from "./setting/Appearance"
import { ChangePasswordDialog } from "./setting/ChangePassword"
import { LogoutDialog } from "./setting/Logout"

// Map dialog keys to actual components
const dialogComponents: Record<string, React.ReactNode> = {
  Appearance: <AppearanceDialog />,
  Privacy: <ChangePasswordDialog />,
  Notifications: <NotificationDialog />,
  Logout: <LogoutDialog />,
}

const menuItems = [
  { title: "Dashboard", icon: IconDashboard },
  { title: "Profile", icon: IconListDetails },
  { title: "Appearance", icon: IconChartBar },
  { title: "Privacy", icon: IconFolder },
  { title: "Notifications", icon: IconUsers },
  { title: "Logout", icon: IconUsers },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Sidebar header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/" className="flex items-center gap-2">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SPLITit</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const DialogComponent = dialogComponents[item.title]

            return (
              <SidebarMenuItem key={item.title}>
                {DialogComponent ? (
                  // Render the dialog if exists
                  <div>{DialogComponent}</div>
                ) : (
                  <SidebarMenuButton asChild>
                    <button className="flex w-full items-center gap-2 text-start p-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
