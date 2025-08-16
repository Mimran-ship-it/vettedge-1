"use client"

import Link from "next/link"
import { useState } from "react"
import { Facebook, Instagram, Mail, Phone, MapPin, Code2, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
    <footer className="border-t sm:mt-16 mt-20 mb-10 dark:border-white/10">
      {/* Newsletter CTA */}
      {/* <div className="relative z-10 w-full flex justify-center">
        <div className="w-10/12 md:w-9/12 lg:w-3/5 mx-auto shadow-lg -mb-20 z-20">
          <div className="bg-gradient-to-r from-[#33BDC7] to-[#38C172] text-white rounded-xl shadow-lg border border-white/30 overflow-visible">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-6 md:px-10 md:py-10 relative">
              <div className="md:pl-48 lg:pl-56 flex flex-col justify-center gap-3 text-center md:text-left">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug">
                  Subscribe to our newsletter
                </h2>
                <p className="text-sm text-white/90 max-w-md mx-auto md:mx-0">
                  Get exclusive domain deals and SEO insights delivered to your inbox. Don't miss out on premium expired domains!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2 justify-center md:justify-start">
                  <Input
                    placeholder="Enter your email"
                    className="rounded-full px-4 py-2 text-[#33BDC7] w-full sm:w-64 bg-white border-white/20 focus:border-white/40"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    onClick={handleSubscribe}
                    disabled={isLoading || !email}
                    className="rounded-full bg-white text-[#33BDC7] hover:bg-gray-50 hover:text-[#33BDC7] px-6 whitespace-nowrap shadow-lg transition-all duration-300"
                  >
                    {isLoading ? "Sending..." : "Subscribe"}
                  </Button>
                </div>
                {success && (
                  <p className="text-xs mt-1 text-white/80">✅ You're subscribed!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="relative z-0 container shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 border border-gray-200 dark:border-gray-800 w-11/12 sm:w-5/6 mx-auto px-4 pt-32 sm:pt-20 pb-2 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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
              <li><Link href="/domains" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Browse All</Link></li>
              <li><Link href="/domains/premium" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Premium Domains</Link></li>
              <li><Link href="/domains/categories" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">By Category</Link></li>
              <li><Link href="/domains/new-arrivals" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">New Arrivals</Link></li>
              <li><Link href="/domains/bulk-deals" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Bulk Deals</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#33BDC7] dark:text-[#33BDC7]/80">Services</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
              <li><Link href="/vetting-process" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Vetting Process</Link></li>
              <li><Link href="/domain-appraisal" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Domain Appraisal</Link></li>
              <li><Link href="/seo-analysis" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">SEO Analysis</Link></li>
              <li><Link href="/transfer-service" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Transfer Service</Link></li>
              <li><Link href="/consultation" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Free Consultation</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#33BDC7] dark:text-[#33BDC7]/80">Support</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
              <li><Link href="/help" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Help Center</Link></li>
              <li><Link href="/faq" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Blog</Link></li>
              <li><Link href="/terms" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-[#33BDC7] dark:hover:text-[#33BDC7]/80 hover:underline transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-700 dark:text-gray-400">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#38C172]" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#38C172]" />
                <span>support@vettedge.domains</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#38C172]" />
                <span>Available Worldwide</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              24/7 Support Available
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
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
                className="hover:underline underline-offset-2 text-[#33BDC7] dark:text-[#33BDC7]/80 font-medium transition-colors"
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
