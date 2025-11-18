"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Variants } from "framer-motion"
import Image from "next/image"
import {
  Search,
  ListChecks,
  Store,
  TrendingUp,
  ShoppingBag,
  Zap,
  Globe,
  Star,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/providers/cart-provider"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { getMostFrequentDomain } = useCart()
  const [topDomain, setTopDomain] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    const loadTop = async () => {
      try {
        const res = await fetch('/api/frequency/top', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (!cancelled && data && data.id) {
            setTopDomain({ id: data.id, name: data.name })
            return
          }
        }
      } catch {
        // ignore and fallback
      }
      // Fallback to localStorage-based frequency
      const topLocal = getMostFrequentDomain()
      if (!cancelled) setTopDomain(topLocal)
    }
    loadTop()
    return () => { cancelled = true }
  }, [getMostFrequentDomain])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/domains?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Animation variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom, duration: 0.6, ease: "easeOut" }
    })
  }

  return (
    <section className="relative bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col overflow-hidden text-gray-800 dark:text-gray-100">
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-2 lg:px-8 py-12">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-y-16 gap-x-10 items-center">
          
          {/* Left Content */}
          <motion.div
            className="space-y-10 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <motion.div className="space-y-6" variants={fadeUp} custom={0.2}>
              <Badge 
                variant="outline"
                className="mb-4 px-4 py-2 border-[#38C172] text-[#38C172] font-medium"
              >
                🔥Premium Aged Domains
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-bold leading-tight break-words">
                <span className="block">Vetted Aged Domains With</span>
                <span className="block text-[#33BDC7]">Real Authority</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Get the edge with VettEdge — where Aged Domains mean business.
                Supercharge your brand with SEO-rich domains.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="px-3 max-w-2xl mx-auto lg:mx-0"
              variants={fadeUp}
              custom={0.4}
            >
         <form onSubmit={handleSearch} className="w-full">
  <div className="relative w-full">
    {/* Search Icon */}
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-6 w-6" />

    {/* Input Field */}
    <input
      type="text"
      placeholder="Search your domain... (e.g., tech, marketing, health)"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full h-14 pl-12 pr-32 text-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#33BDC7] transition-all"
    />

    {/* Inline Search Button */}
    <button
      type="submit"
      className="absolute right-1 top-1/2 transform -translate-y-1/2 sm:h-10 h-9 px-4 bg-[#33BDC7] hover:bg-[#2ba9b8] text-white font-semibold rounded-lg flex items-center justify-center text-lg shadow-md transition-all duration-200"
    >
      <Search className="sm:h-4 sm:w-4 h-3 w-3 mr-2" />
      Search
    </button>
  </div>
</form>

            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="lg:pl-8 px-0 sm:px-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
              <CardContent className="p-4 sm:p-6 md:p-8 space-y-2 md:space-y-8">
                
                {/* Features */}
                <motion.div
                  className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.15 },
                    },
                  }}
                >
                  {[{
                    Icon: Search,
                    color: "text-[#33BDC7]",
                    bg: "from-[#33BDC7]/10 to-[#33BDC7]/20",
                    title: "Search Aged Domains",
                    desc: "Browse hundreds of valuable domains"
                  }, {
                    Icon: TrendingUp,
                    color: "text-purple-500",
                    bg: "from-purple-500/10 to-purple-500/20",
                    title: "View Domain Metrics",
                    desc: "Check SEO, backlinks & authority"
                  }, {
                    Icon: ShoppingBag,
                    color: "text-green-500",
                    bg: "from-green-500/10 to-green-500/20",
                    title: "Buy Instantly",
                    desc: "Secure the perfect domain for your brand"
                  }].map(({ Icon, color, bg, title, desc }, i) => (
                    <motion.div
                      key={i}
                      className="text-center space-y-3 group"
                      variants={fadeUp}
                      custom={i * 0.2}
                    >
                      <div className={`w-8 h-8 sm:w-16 sm:h-10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className={`h-5 w-5 sm:h-8 sm:w-8 ${color}`} />
                      </div>
                      <h4 className="font-semibold text-sm sm:text-base">{title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced Live Metrics */}
                <motion.div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 sm:p-5 border border-gray-200 dark:border-gray-600 shadow-sm"
                  variants={fadeUp}
                  custom={0.8}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                    <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm sm:text-base flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Live Domain Metrics Preview
                    </h4>
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      Real-time
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Domain Authority:", value: "65", color: "text-green-600" },
                      { label: "Authority Links:", value: "4", color: "text-[#33BDC7]" },
                      { label: "Monthly Traffic:", value: "15K", color: "text-purple-500" },
                      { label: "Domain Age:", value: "5+ years", color: "text-orange-500" },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white dark:bg-gray-700/50 p-3 rounded-md"
                      >
                        <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">{metric.label}</span>
                        <span className={`${metric.color} font-bold text-base`}>{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div variants={fadeUp} custom={1}>
                  {!topDomain ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      {/* Loader spinner */}
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#38C172] mb-3"></div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Fetching the most frequent domain...
                      </p>
                    </div>
                  ) : (
                    <>
                      <Button
                        className="w-full  text-black bg-transparent hover:bg-transparent font-semibold h-12 sm:h-14 text-base sm:text-lg  transform hover:scale-[1.02] transition-all duration-200"
                        size="lg"
                        asChild
                      >
                        <Link href={`/domains/${topDomain.id}`}>
                          {topDomain.name}
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                        </Link>
                      </Button>

                      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                        This domain is mostly watched and frequently added to carts — check it out.
                      </p>
                    </>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}