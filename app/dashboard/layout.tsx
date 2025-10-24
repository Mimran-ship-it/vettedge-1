"use client"

import { DashboardSidebar, MobileSidebar, MobileMenuButton } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block fixed left-0 top-0 h-full z-30">
        <DashboardSidebar />
      </div>
      <MobileSidebar />
      <div className="flex-1 flex flex-col min-h-screen md:pl-64 transition-all duration-300 ease-in-out">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <MobileMenuButton />
              <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
