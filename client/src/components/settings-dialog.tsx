

import * as React from "react"
import {
  Bell,
  Keyboard,
  Lock,
  User,
  Paintbrush,
  LogOut,
  Settings,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { NotificationSwitch } from "./setting/Notification"
import { Logout } from "./setting/Logout"
import { Appearance } from "./setting/Appearance"
import { ChangePassword } from "./setting/ChangePassword"
const data = {
  nav: [
    { name: "Profile", icon: User },
    { name: "Notifications", icon: Bell },
    { name: "Appearance", icon: Paintbrush },
    { name: "Accessibility", icon: Keyboard },
    { name: "Privacy & visibility", icon: Lock },
    { name: "Logout", icon: LogOut  },
  ],
}

export function SettingsDialog() {
  const [open, setOpen] = React.useState(false) // dialog state
  const [activePage, setActivePage] = React.useState("Notifications") // 👈 active menu

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-white text-start text-sm px-4 py-2 flex gap-3 items-center">
      <Settings className="w-4"/>
          Setting
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          {/* Left Sidebar */}
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={activePage === item.name}
                        >
                          <button
                            onClick={() => setActivePage(item.name)}
                            className="flex items-center gap-2"
                          >
                            <item.icon />
                            <span>{item.name}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Right Content */}
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activePage}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            {/* Dynamic content */}
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {activePage === "Notifications" && <NotificationSwitch />}
              {activePage === "Appearance" && ( <Appearance /> )}
              {activePage === "Privacy & visibility" && <ChangePassword />}
              {activePage === "Logout" && ( <Logout /> )}
              
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
