"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Users,
  MessageSquare,
  LayoutDashboard,
  Globe,
  Newspaper,
  CreditCard,
  Mail,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Domains", url: "/admin/domains", icon: Globe },
  { title: "Blogs", url: "/admin/blogs", icon: Newspaper },
  { title: "Customers", url: "/admin/customers", icon: Users },
  { title: "Orders", url: "/admin/orders", icon: CreditCard },
  { title: "Live Chat", url: "/admin/chat", icon: MessageSquare },
  { title: "Contacts", url: "/admin/contacts", icon: Mail },
]

export function AdminSidebar() {
  const { user, signOut } = useAuth()
  const { theme } = useTheme()

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <Link href="/">
            <Image
              src={"/logo.png"}
              alt="Vettedge Logo"
              width={75}
              height={75}
              priority
              className="scale-125"
            />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut}>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
