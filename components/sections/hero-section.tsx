"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Variants } from "framer-motion"
import Image from "next/image"
import {
  Search,
  TrendingUp,
  ShoppingBag,
  Zap,
  Globe,
  Star,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

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
    <section className="relative bg-white min-h-screen flex flex-col overflow-hidden text-gray-800">
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
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
                variant="secondary"
                className="bg-[#33BDC7]/10 text-[#33BDC7] border-[#33BDC7]/30 px-4 py-2 mx-auto lg:mx-0"
              >
                🔥 Premium Domain Marketplace
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight break-words">
                <span className="block">Expired Domains With</span>
                <span className="block text-[#33BDC7]">Real Authority</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Get the edge with VettEdge — where expired domains mean business.
                Supercharge your brand with SEO-rich domains.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="bg-gray-100 rounded-2xl p-6 border border-gray-200 max-w-2xl mx-auto lg:mx-0"
              variants={fadeUp}
              custom={0.4}
            >
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <Input
                    placeholder="Search for your perfect domain... (e.g., tech, marketing, health)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg bg-white border border-gray-300 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#33BDC7]"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto flex-1 bg-[#38C172] hover:bg-[#30c97c] text-white font-semibold h-12 text-lg shadow hover:shadow-md transition-all duration-200"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search Domains
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-gray-300 text-[#33BDC7] hover:bg-[#33BDC7]/10 h-12 px-8 font-semibold"
                    asChild
                  >
                    <Link href="/domains">
                      Browse All
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-gray-600 text-sm sm:text-base"
              variants={fadeUp}
              custom={0.6}
            >
              {[
                { icon: Star, text: "15,000+ Domains Sold", color: "text-yellow-500" },
                { icon: Zap, text: "98% Success Rate", color: "text-[#33BDC7]" },
                { icon: Globe, text: "24/7 Support", color: "text-green-500" },
              ].map(({ icon: Icon, text, color }, i) => (
                <motion.div
                  key={i}
                  className="flex items-center space-x-2"
                  variants={fadeUp}
                  custom={0.7 + i * 0.1}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span className="font-medium">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="lg:pl-8 px-4 sm:px-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <Card className="bg-white text-gray-800 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
              <CardContent className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
                
                {/* Features */}
                <motion.div
                  className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="flex items-center justify-center">
                    <Image
                      src="/logo.jpg"
                      alt="Vettedge Logo"
                      width={55}
                      height={55}
                      priority
                      className="bg-[#FAFAFA]"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold">Discover & Buy</h3>
                    <p className="text-gray-500 text-sm sm:text-base">Premium Expired Domains</p>
                  </div>
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
                    title: "Search Expired Domains",
                    desc: "Browse thousands of valuable domains"
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
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${bg} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className={`h-5 w-5 sm:h-8 sm:w-8 ${color}`} />
                      </div>
                      <h4 className="font-semibold text-sm sm:text-base">{title}</h4>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Live Metrics */}
                <motion.div
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs sm:text-sm"
                  variants={fadeUp}
                  custom={0.8}
                >
                  <h4 className="font-medium text-gray-600 mb-3">Live Domain Metrics Preview</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Domain Authority:</span>
                      <span className="text-green-600 font-medium">65+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Backlinks:</span>
                      <span className="text-[#33BDC7] font-medium">1,250+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Traffic:</span>
                      <span className="text-purple-500 font-medium">15K+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Domain Age:</span>
                      <span className="text-orange-500 font-medium">5+ years</span>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div variants={fadeUp} custom={1}>
                  <Button
                    className="w-full bg-[#38C172] hover:bg-[#30c97c] text-white font-semibold h-12 sm:h-14 text-base sm:text-lg shadow hover:shadow-md transform hover:scale-[1.02] transition-all duration-200"
                    size="lg"
                    asChild
                  >
                    <Link href="/domains">
                      Start Your Search Now
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}