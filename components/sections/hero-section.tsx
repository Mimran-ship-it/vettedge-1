"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

  return (
    <section className="relative bg-white min-h-screen flex flex-col overflow-hidden text-gray-800">
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-y-16 gap-x-10 items-center">
          
          {/* Left Content */}
          <div className="space-y-10 text-center lg:text-left">
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="bg-[#3DDC91]/10 text-[#3DDC91] border-[#3DDC91]/30 px-4 py-2 mx-auto lg:mx-0"
              >
                🔥 Premium Domain Marketplace
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight break-words">
                <span className="block">Expired Domains With</span>
                <span className="block text-[#00BFFF]">Real Authority</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Get the edge with VettEdge — where expired domains mean business.
                Supercharge your brand with SEO-rich domains.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200 max-w-2xl mx-auto lg:mx-0">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <Input
                    placeholder="Search for your perfect domain... (e.g., tech, marketing, health)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg bg-white border border-gray-300 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#3DDC91]"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto flex-1 bg-[#3DDC91] hover:bg-[#30c97c] text-white font-semibold h-12 text-lg shadow hover:shadow-md transition-all duration-200"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search Domains
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-gray-300 text-[#3DDC91] hover:bg-[#3DDC91]/10 h-12 px-8 font-semibold"
                    asChild
                  >
                    <Link href="/domains">
                      Browse All
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-gray-600 text-sm sm:text-base">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">15,000+ Domains Sold</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-teal-500" />
                <span className="font-medium">98% Success Rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-green-500" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:pl-8 px-4 sm:px-0">
            <Card className="bg-white text-gray-800 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 sm:p-8 space-y-8">
                
                {/* Features */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#3DDC91] rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">Discover & Buy</h3>
                    <p className="text-gray-500 text-sm sm:text-base">Premium Expired Domains</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {[{
                    Icon: Search,
                    color: "text-[#00BFFF]",
                    bg: "from-[#00BFFF]/10 to-[#00BFFF]/20",
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
                    title: "Buy or Bid Instantly",
                    desc: "Secure the perfect domain for your brand"
                  }].map(({ Icon, color, bg, title, desc }, i) => (
                    <div className="text-center space-y-3 group" key={i}>
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${bg} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${color}`} />
                      </div>
                      <h4 className="font-semibold text-sm">{title}</h4>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  ))}
                </div>

                {/* Live Metrics */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs sm:text-sm">
                  <h4 className="font-medium text-gray-600 mb-3">Live Domain Metrics Preview</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Domain Authority:</span>
                      <span className="text-green-600 font-medium">65+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Backlinks:</span>
                      <span className="text-[#00BFFF] font-medium">1,250+</span>
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
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full bg-[#3DDC91] hover:bg-[#30c97c] text-white font-semibold h-12 text-lg shadow hover:shadow-md transform hover:scale-105 transition-all duration-200"
                  size="lg"
                  asChild
                >
                  <Link href="/domains">
                    Start Your Search Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
