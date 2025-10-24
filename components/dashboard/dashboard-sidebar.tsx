"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ShoppingCart, Settings, Heart, Home, Menu } from "lucide-react"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider, 
  useSidebar, 
  SidebarTrigger 
} from "@/components/ui/sidebar"

interface SidebarItem {
  title: string
  href: string
  icon: React.ElementType
}

const sidebarItems: SidebarItem[] = [
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

export function DashboardSidebar() {
  const pathname = usePathname()
  const { open, setOpen } = useSidebar()

  // On mobile, only show if open
  const shouldShow = window.innerWidth >= 768 || open
  if (!shouldShow) return null

  return (
    <div className={`${!open ? 'hidden md:block' : ''} fixed left-0 top-0 h-full z-40`}>
      <SidebarContent className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-6">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-[#33BDC7] text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </SidebarContent>
    </div>
  )
}

export function MobileSidebar() {
  const pathname = usePathname()
  const { open, setOpen } = useSidebar()
  
  if (!open) return null
  
  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-10 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent className="p-6">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-[#33BDC7] text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              )
            })}
          </div>
        </SidebarContent>
      </div>
    </div>
  )
}

export function MobileMenuButton() {
  const { open, setOpen } = useSidebar()
  
  return (
    <button
      type="button"
      className="md:hidden p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
      onClick={() => setOpen(!open)}
      aria-label={open ? 'Close sidebar' : 'Open sidebar'}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">{open ? 'Close sidebar' : 'Open sidebar'}</span>
    </button>
  )
}
