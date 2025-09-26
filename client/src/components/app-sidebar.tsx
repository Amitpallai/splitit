"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconUsers,
  IconCurrencyDollar,
} from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Import all dialogs
import { NotificationDialog } from "./setting/Notification"
import { AppearanceDialog } from "./setting/Appearance"
import { ChangePasswordDialog } from "./setting/ChangePassword"
import { LogoutDialog } from "./setting/Logout"
import { CurrencyDialog } from "./setting/CurrencyDialog"

// Map dialog keys to actual components
const dialogComponents: Record<string, React.ReactNode> = {
  Currency: <CurrencyDialog />,
  Appearance: <AppearanceDialog />,
  Privacy: <ChangePasswordDialog />,
  Notifications: <NotificationDialog />,
  Logout: <LogoutDialog />,
}

const menuItems = [
  { title: "Dashboard", icon: IconDashboard },
  { title: "Profile", icon: IconListDetails },
  { title: "Currency", icon: IconCurrencyDollar },
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
                <p className="text-base font-semibold">SPLIT<span className="text-purple-500">it</span></p>
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
                  // Wrap dialog component inside a button trigger
                  <SidebarMenuButton asChild>
                    <div>{DialogComponent}</div>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton asChild>
                    <button className="flex w-full items-center  text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2B2B2B] rounded-md gap-3">
                      {item.icon && <item.icon className="!size-4" />}
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
