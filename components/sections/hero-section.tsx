"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, ShoppingBag, Zap, Globe, Star, ArrowRight } from "lucide-react"
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
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 min-h-screen flex flex-col overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10 text-white">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                🔥 Premium Domain Marketplace
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight break-words">
                <span className="block">Unlock Premium</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-300">
                  Expired Domains
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2">With Maximum SEO Power</span>
              </h1>

              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl">
                Supercharge your brand with aged, SEO-rich domains that drive instant authority and rankings.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-6 w-6" />
                  <Input
                    placeholder="Search for your perfect domain... (e.g., tech, marketing, health)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold h-12 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search Domains
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white hover:text-blue-600 h-12 px-8 font-semibold bg-transparent"
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
            <div className="flex flex-wrap items-center gap-6 text-blue-100 text-sm sm:text-base">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">15,000+ Domains Sold</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-cyan-400" />
                <span className="font-medium">98% Success Rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-green-400" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:pl-8">
            <Card className="bg-slate-900/90 backdrop-blur-xl text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 space-y-8">
                {/* Features */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Discover & Buy</h3>
                    <p className="text-blue-200">Premium Expired Domains</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  {/* Feature Item */}
                  {[{
                    Icon: Search,
                    color: "text-cyan-400",
                    bg: "from-cyan-500/20 to-cyan-500/40",
                    title: "Search Expired Domains",
                    desc: "Browse thousands of valuable domains"
                  }, {
                    Icon: TrendingUp,
                    color: "text-purple-400",
                    bg: "from-purple-500/20 to-purple-500/40",
                    title: "View Domain Metrics",
                    desc: "Check SEO, backlinks & authority"
                  }, {
                    Icon: ShoppingBag,
                    color: "text-green-400",
                    bg: "from-green-500/20 to-green-500/40",
                    title: "Buy or Bid Instantly",
                    desc: "Secure the perfect domain for your brand"
                  }].map(({ Icon, color, bg, title, desc }, i) => (
                    <div className="text-center space-y-4 group" key={i}>
                      <div className={`w-16 h-16 bg-gradient-to-br ${bg} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className={`h-8 w-8 ${color}`} />
                      </div>
                      <h4 className="font-semibold text-sm">{title}</h4>
                      <p className="text-xs text-gray-400 mt-2">{desc}</p>
                    </div>
                  ))}
                </div>

                {/* Live Metrics */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Live Domain Metrics Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Domain Authority:</span>
                      <span className="text-green-400 font-medium">65+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Backlinks:</span>
                      <span className="text-blue-400 font-medium">1,250+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Traffic:</span>
                      <span className="text-purple-400 font-medium">15K+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Domain Age:</span>
                      <span className="text-orange-400 font-medium">5+ years</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold h-12 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
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
