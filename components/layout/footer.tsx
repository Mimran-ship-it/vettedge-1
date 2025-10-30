"use client"

import Link from "next/link"
import { useState } from "react"
import { Facebook, Instagram, Mail, Phone, MapPin, Code2, Twitter, Linkedin, MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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
    <footer className="pt-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="relative z-0 w-11/12 sm:w-5/6 mx-auto ps-0 pe-3 pt-10 pb-2 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo & Social */}
          <div className="lg:col-span-2 flex flex-col gap-4 pb-0">
            <Link href="/" className="flex items-center space-x-">
              <Image
                src="/logo.png"
                alt="Vettedge Logo"
                width={55}
                height={60}
                className="rounded-lg scale-125"
              />
              <h2 className="text-xl text-black dark:text-white transition-all duration-300 tracking-wide">
                Vettedge.domains
              </h2>
            </Link>
 
            <div className="border-l-4 border-[#38C172] pl-4 mt-2 text-sm italic text-gray-700 dark:text-gray-400">
              <p>
                "We're passionate about providing high-quality Aged Domains to help your business succeed online."
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
              <Link href="https://www.linkedin.com/company/vettedge-domains/" target="_blank">
                <Button variant="ghost" size="icon" className="hover:bg-[#33BDC7]/10 dark:hover:bg-[#33BDC7]/20">
                  <Linkedin className="w-5 h-5 text-[#33BDC7] dark:text-[#33BDC7]/80" />
                </Button>
              </Link>
              <Link href="https://whatsapp.com/channel/0029VbBLngqJpe8n9JJLzu3x" target="_blank">
                <Button variant="ghost" size="icon" className="hover:bg-[#33BDC7]/10 dark:hover:bg-[#33BDC7]/20">
                  <MessageCircle className="w-5 h-5 text-[#33BDC7] dark:text-[#33BDC7]/80" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Domains */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#33BDC7] dark:text-[#33BDC7]/80">Domains</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li><Link href="/domains" className="hover:text-[#33BDC7] hover:underline">Browse All</Link></li>
              <li><Link href="/hot-deals" className="hover:text-[#33BDC7] hover:underline">Hot Deals</Link></li>
              <li><Link href="/vetting-process" className="hover:text-[#33BDC7] hover:underline">Vetting Process</Link></li>
              <li><Link href="/return-policy" className="hover:text-[#33BDC7] hover:underline">Return Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#33BDC7] dark:text-[#33BDC7]/80">Support</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li><Link href="/transfer-process" className="hover:text-[#33BDC7] hover:underline">Transfer Process</Link></li>
              <li><Link href="/contact" className="hover:text-[#33BDC7] hover:underline">Help Center</Link></li>
              <li><Link href="/contact#faq" className="hover:text-[#33BDC7] hover:underline">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-[#33BDC7] hover:underline">Contact Us</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#33BDC7] dark:text-[#33BDC7]/80">Company</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li><Link href="/about" className="hover:text-[#33BDC7] hover:underline">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-[#33BDC7] hover:underline">Blog</Link></li>
              <li><Link href="/terms" className="hover:text-[#33BDC7] hover:underline">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-[#33BDC7] hover:underline">Privacy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#33BDC7] dark:text-[#33BDC7]/80">Contact Details</h4>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300"> 
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

        {/* Trustpilot Review Section */}
        <div className="mt-6 mb-8 flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your Feedback Matters</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Help us improve by sharing your experience</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
            <div 
              data-locale="en-GB" 
              data-template-id="56278e9abfbbba0bdcd568bc" 
              data-businessunit-id="68e8254f4257ef8404e61249" 
              data-style-height="52px" 
              data-style-width="300px" 
              data-token="87a62d8c-4680-45b5-b69a-df54c620cd39"
              className="flex items-center justify-center"
            >
              <a 
                href="https://uk.trustpilot.com/review/vettedge.domains" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-full px-4 py-2 bg-[#00B67A] hover:bg-[#008654] text-white font-medium rounded-md transition-colors duration-300"
              >
                <Star className="w-4 h-4 fill-current" />
                <span>Review us on Trustpilot</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-6 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-2">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3">
            <div className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              <span>© 2025 Vettedge.domains. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}