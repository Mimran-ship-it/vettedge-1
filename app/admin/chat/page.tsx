"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminChatInterface } from "@/components/admin/admin-chat-interface"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AdminChatPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
    } else if (user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminChatInterface />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
