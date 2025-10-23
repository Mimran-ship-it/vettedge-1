"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X, Home, ShoppingCart, Settings, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

type DashboardLayoutProps = {
  children: React.ReactNode
}

const sidebarItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Orders",
    href: "/dashboard",
    icon: ShoppingCart,
  },
  {
    title: "Account Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Wishlist",
    href: "/dashboard/wishlist",
    icon: Heart,
  },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          isMobileSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setIsMobileSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50 transition-opacity" />
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <h1 className="text-xl font-bold">Vettedge.domains</h1>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#33BDC7] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden w-64 border-r bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-4">
            <h1 className="text-xl font-bold">VettEdge</h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#33BDC7] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-16 items-center border-b bg-white px-4 lg:hidden">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="mr-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-medium">
            {sidebarItems.find((item) => item.href === pathname)?.title || 'Dashboard'}
          </h2>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
