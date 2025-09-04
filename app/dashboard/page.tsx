"use client"

import dynamic from 'next/dynamic'

import { SidebarProvider } from "@/components/ui/sidebar"

// Dynamically import the dashboard component with no SSR
const UserDashboard = dynamic(() => import('@/components/user-dashboard').then(mod => mod.UserDashboard), {
  ssr: false,
 
})

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <UserDashboard />
    </SidebarProvider>
  )
}