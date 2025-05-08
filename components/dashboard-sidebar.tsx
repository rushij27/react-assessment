"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Layers, Images, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { state } = useSidebar()

  const routes = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Drag and Drop",
      href: "/dashboard/drag-and-drop",
      icon: Layers,
    },
    {
      title: "Infinite Scroll",
      href: "/dashboard/infinite-scroll",
      icon: Images,
    },
  ]

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center justify-start py-5">
        <div className="flex justify-start items-center space-x-2">
          <SidebarTrigger />
          <span className={`text-xl font-bold ${state === "collapsed" ? "hidden" : ""}`}>
            Dashboard
          </span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === route.href} 
                tooltip={state === "collapsed" ? route.title : undefined}
              >
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <>
            <SidebarSeparator />
            <div className={`flex items-center justify-between p-4 ${state === "collapsed" ? "hidden" : ""}`}>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                  />
                  <AvatarFallback>{`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </button>
            </div>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}