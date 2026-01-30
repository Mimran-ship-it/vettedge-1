"use client"

import { DashboardSidebar, MobileSidebar, MobileMenuButton } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Desktop Sidebar - Fixed width with distinct separation */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 z-30 border-r border-slate-800">
        <DashboardSidebar />
      </div>
      <MobileSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300 ease-in-out">
        {/* Header Bar - Distinct top navigation */}
        <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center">
              <MobileMenuButton />
              <h1 className="ml-3 text-xl font-semibold text-white font-inter">Dashboard</h1>
            </div>
          </div>
        </header>
        
        {/* Main Content - Constrained width with proper padding */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
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
