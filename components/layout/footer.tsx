"use client"

import Link from "next/link"
import { useState } from "react"
import { Facebook, Instagram, Mail, Phone, MapPin, Code2, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubscribe = async () => {
    if (!email) return

    setIsLoading(true)
    setSuccess(false)

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSuccess(true)
        setEmail("")
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error(error)
      alert("Failed to subscribe.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="sm:mt-16 mt-2 mb-10 bg-white text-gray-800 dark:text-gray-200">
      <div className="relative z-0 w-11/12 sm:w-5/6 mx-auto px-4 pt-32 sm:pt-20 pb-2 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo & Social */}
          <div className="lg:col-span-2 flex flex-col gap-4 pb-0">
            <Link href="/">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#33BDC7] via-[#38C172] to-[#33BDC7] bg-clip-text text-transparent hover:from-[#38C172] hover:via-[#33BDC7] hover:to-[#38C172] transition-all duration-300 tracking-wide">
                Vettedge.domains
              </h2>
            </Link>
            <p className="text-sm text-[#33BDC7] dark:text-[#33BDC7]/80">
              Premium aged domains with proven SEO value.
            </p>
            <div className="border-l-4 border-[#38C172] pl-4 mt-2 text-sm italic text-gray-700 dark:text-gray-400">
              <p>
                "We're passionate about providing high-quality expired domains to help your business succeed online."
              </p>
              <p className="mt-1 font-semibold not-italic text-[#33BDC7] dark:text-[#33BDC7]/80">
                — VettEdge Team
              </p>
            </div>
            <div className="flex space-x-0 mt-4">
              <Link href="#" target="_blank">
                <Button variant="ghost" size="icon" className="hover:bg-[#33BDC7]/10 dark:hover:bg-[#33BDC7]/20">
                  <Facebook className="w-5 h-5 text-[#33BDC7] dark:text-[#33BDC7]/80" />
                </Button>
              </Link>
              <Link href="#" target="_blank">
                <Button variant="ghost" size="icon" className="hover:bg-[#33BDC7]/10 dark:hover:bg-[#33BDC7]/20">
                  <Instagram className="w-5 h-5 text-[#33BDC7] dark:text-[#33BDC7]/80" />
                </Button>
              </Link>
              <Link href="#" target="_blank">
                <Button variant="ghost" size="icon" className="hover:bg-[#33BDC7]/10 dark:hover:bg-[#33BDC7]/20">
                  <Twitter className="w-5 h-5 text-[#33BDC7] dark:text-[#33BDC7]/80" />
                </Button>
              </Link>
            </div>
          </div>

         {/* Domains */}
<div>
  <h4 className="text-sm font-semibold mb-4 text-[#33BDC7] dark:text-[#33BDC7]/80">Domains</h4>
  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
    <li><Link href="/domains" className="hover:text-[#33BDC7] hover:underline">Browse All</Link></li>
    <li><Link href="/domains/premium" className="hover:text-[#33BDC7] hover:underline">Premium Domains</Link></li>
    <li><Link href="/domains/categories" className="hover:text-[#33BDC7] hover:underline">By Category</Link></li>
    <li><Link href="/domains/new-arrivals" className="hover:text-[#33BDC7] hover:underline">New Arrivals</Link></li>
  </ul>
</div>

{/* Support */}
<div>
  <h4 className="text-sm font-semibold mb-4 text-[#33BDC7] dark:text-[#33BDC7]/80">Support</h4>
  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
    <li><Link href="/vetting-process" className="hover:text-[#33BDC7] hover:underline">Vetting Process</Link></li>
    <li><Link href="/contact" className="hover:text-[#33BDC7] hover:underline">Help Center</Link></li>
    <li><Link href="/faq" className="hover:text-[#33BDC7] hover:underline">FAQ</Link></li>
    <li><Link href="/contact" className="hover:text-[#33BDC7] hover:underline">Contact Us</Link></li>
  </ul>
</div>

{/* Company */}
<div>
  <h4 className="text-sm font-semibold mb-4 text-[#33BDC7] dark:text-[#33BDC7]/80">Company</h4>
  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
    <li><Link href="/about" className="hover:text-[#33BDC7] hover:underline">About Us</Link></li>
    <li><Link href="/blog" className="hover:text-[#33BDC7] hover:underline">Blog</Link></li>
    <li><Link href="/terms" className="hover:text-[#33BDC7] hover:underline">Terms</Link></li>
    <li><Link href="/privacy" className="hover:text-[#33BDC7] hover:underline">Privacy</Link></li>
  </ul>
</div>


          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#33BDC7] dark:text-[#33BDC7]/80">Contact Details</h4>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#38C172]" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#38C172]" />
                <span>support@vettedge.domains</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#38C172]" />
                <span>Available Worldwide</span>
              </li>
            </ul>
          </div>
        </div>
 
        {/* Footer Bottom */}
        <div className="text-center my-6  text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3">
            <div className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              <span>© 2025 Vettedge.domains. All rights reserved.</span>
            </div>
            <span className="hidden sm:inline-block">|</span>
            <span>
              Developed by{" "}
              <Link
                href="https://www.techcognify.com/"
                target="_blank"
                className="hover:underline underline-offset-2 text-[#33BDC7] font-medium transition-colors"
              >
                TECHCOGNIFY
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
