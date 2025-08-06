"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()



  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <SidebarInset>
          <AdminDashboard />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
