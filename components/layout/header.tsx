"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const { items } = useCart()
  const { wishlistCount } = useWishlist() // Use the wishlist count from the context
  const pathname = usePathname()
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])
  
  const linkClass = (href: string) =>
    pathname === href
      ? "text-[#33BDC7] font-medium transition-colors"
      : "text-gray-700 hover:text-[#33BDC7] transition-colors"
      
  const renderUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">{user?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        <DropdownMenuContent asChild align="end" className="w-56">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          >
            {user?.role != "admin" &&    
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
              </DropdownMenuItem>
            }
        
            <DropdownMenuItem asChild>
              <Link href="/wishlist" className={linkClass("/wishlist")}>Wishlist</Link>
            </DropdownMenuItem>
            {user?.role === "admin" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className={linkClass("/admin")}>Admin Panel</Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
          </motion.div>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  )
  
  return (
    <>
      {/* Fixed Header */}
      <header className="bg-white shadow-sm border-b w-full z-50 fixed top-0 left-0">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-1">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Vettedge Logo"
                  width={60}
                  height={30}
                  className="object-contain"
                />
                <span className="text-md sm:text-lg md:text-xl font-semibold text-gray-900 ml-2">
                  Vettedge.domains
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation - Hidden on mobile and tablet */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <Link href="/domains" className={linkClass("/domains")}>
                Buy Domains
              </Link>
              <Link href="/vetting-process" className={linkClass("/vetting-process")}>
                Vetting Process
              </Link>
              <Link href="/blog" className={linkClass("/blog")}>
                Blog
              </Link>
              <Link href="/about" className={linkClass("/about")}>
                About Us
              </Link>
              <Link href="/contact" className={linkClass("/contact")}>
                Contact Us
              </Link>
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Wishlist */}
              <Link href="/wishlist" className="relative">
                <Button variant="ghost" size="sm">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute bg-[#33BDC7] -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {/* Cart */}
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute bg-[#33BDC7] -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {/* Desktop Profile or Auth Buttons - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2">
                {loading ? (
                  <span className="flex items-center text-gray-500 text-sm ms-4">
                    Loading
                    <span className="ml-1 flex space-x-1">
                      <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></span>
                    </span>
                  </span>
                ) : user ? (
                  renderUserMenu()
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/auth/signin" className={linkClass("/auth/signin")}>
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/auth/signup" className='hover:text-white'>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
              
              {/* Mobile Menu Toggle - Visible on mobile and tablet */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full sm:w-4/5 max-w-md h-full bg-white z-50 shadow-lg lg:hidden overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                      <Image
                        src="/logo.png"
                        alt="Vettedge Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      Vettedge.domains
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                
                {/* Tablet Navigation - Visible only in tablet view */}
                <nav className="hidden md:flex flex-col space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <Link href="/domains" className={linkClass("/domains")} onClick={() => setIsMenuOpen(false)}>
                    Buy Domains
                  </Link>
                  <Link href="/vetting-process" className={linkClass("/vetting-process")} onClick={() => setIsMenuOpen(false)}>
                    Vetting Process
                  </Link>
                  <Link href="/blog" className={linkClass("/blog")} onClick={() => setIsMenuOpen(false)}>
                    Blog
                  </Link>
                  <Link href="/about" className={linkClass("/about")} onClick={() => setIsMenuOpen(false)}>
                    About Us
                  </Link>
                  <Link href="/contact" className={linkClass("/contact")} onClick={() => setIsMenuOpen(false)}>
                    Contact Us
                  </Link>
                </nav>
                
                {/* Mobile Navigation - Visible only in mobile view */}
                <nav className="md:hidden flex flex-col space-y-4">
                  <Link href="/domains" className={linkClass("/domains")} onClick={() => setIsMenuOpen(false)}>
                    Buy Domains
                  </Link>
                  <Link href="/vetting-process" className={linkClass("/vetting-process")} onClick={() => setIsMenuOpen(false)}>
                    Vetting Process
                  </Link>
                  <Link href="/blog" className={linkClass("/blog")} onClick={() => setIsMenuOpen(false)}>
                    Blog
                  </Link>
                  <Link href="/about" className={linkClass("/about")} onClick={() => setIsMenuOpen(false)}>
                    About Us
                  </Link>
                  <Link href="/contact" className={linkClass("/contact")} onClick={() => setIsMenuOpen(false)}>
                    Contact Us
                  </Link>
                </nav>
                
                {/* User menu for mobile and tablet */}
                {user && (
                  <div className="pt-4 border-t mt-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="h-5 w-5" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <Link href="/dashboard" className={linkClass("/dashboard")} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                      
                      <Link href="/wishlist" className={linkClass("/wishlist")} onClick={() => setIsMenuOpen(false)}>Wishlist</Link>
                      {user?.role === "admin" && (
                        <Link href="/admin" className={linkClass("/admin")} onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                      )}
                      <Button variant="ghost" className="justify-start p-0 h-auto" onClick={() => { signOut(); setIsMenuOpen(false); }}>Sign Out</Button>
                    </div>
                  </div>
                )}
                
                {!loading && !user && (
                  <div className="pt-4 flex flex-col space-y-3 border-t mt-4">
                    <Link href="/auth/signin" className={linkClass("/auth/signin")} onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}