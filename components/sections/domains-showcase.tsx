"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DomainCard } from "@/components/domains/domain-card"
import type { Domain } from "@/types/domain"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Clock, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"

type TabKey = "hot" | "aged" | "traffic"

export function DomainsShowcase() {
  const [allDomains, setAllDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState<TabKey>("hot")
  const [visibleCount, setVisibleCount] = useState(6)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/domains")
        if (!res.ok) throw new Error(`Server returned ${res.status}`)
        const data: Domain[] = await res.json()
        setAllDomains(data)
      } catch (e: any) {
        console.error("Failed to fetch domains:", e)
        setError("Unable to load domains at the moment.")
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  useEffect(() => {
    // reset pagination on tab change
    setVisibleCount(6)
    setCurrentIndex(0)
  }, [active])

  const filtered = useMemo(() => {
    const available = allDomains.filter((d) => d.isAvailable === true && d.isSold === false)
    if (active === "hot") return available.filter((d) => d.isHot === true)
    if (active === "aged") return available.filter((d) => d.type === "aged")
    return available.filter((d) => d.type === "traffic")
  }, [allDomains, active])

  useEffect(() => {
    const calc = () => {
      if (typeof window === "undefined") return
      const w = window.innerWidth
      if (w < 640) {
        setItemsPerView(1)
      } else if (w < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  useEffect(() => {
    // Clamp index when itemsPerView changes
    setCurrentIndex((i) => {
      const max = Math.max(0, filtered.length - itemsPerView)
      return Math.min(i, max)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerView, filtered.length])

  const meta = useMemo(() => {
    switch (active) {
      case "hot":
        return {
          title: "Hot Deals",
          subtitle: "Discover premium Aged Domains with proven authority — now available at 20–80% off",
          viewAllHref: "/domains?isHot=true",
          icon: <Sparkles className="w-5 h-5" />
        }
      case "aged":
        return {
          title: "Aged Domains",
          subtitle: "Discover domains with history, authority, and SEO value",
          viewAllHref: "/domains?aged=true",
          icon: <Clock className="w-5 h-5" />
        }
      case "traffic":
      default:
        return {
          title: "Traffic Domains",
          subtitle: "Explore domains with existing traffic and strong growth potential",
          viewAllHref: "/domains?traffic=true",
          icon: <TrendingUp className="w-5 h-5" />
        }
    }
  }, [active])

  const handleShowMore = () => setVisibleCount((v) => v + 6)

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const staggerContainer = {
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-green-100 dark:bg-green-900/10 full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-teal-100 dark:bg-teal-900/10 full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-6  sm:mb-12 "
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {(["hot", "aged", "traffic"] as TabKey[]).map((tab) => (
            <motion.div key={tab} variants={fadeInUp}>
              <Button
                variant={active === tab ? "default" : "outline"}
                className={`px-6 py-3 full flex items-center gap-2 transition-all duration-300 ${
                  active === tab 
                    ? "bg-[#33BDC7] text-white shadow-lg hover:shadow-xl" 
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActive(tab)}
              >
                {tab === "hot" && <Sparkles className="w-4 h-4" />}
                {tab === "aged" && <Clock className="w-4 h-4" />}
                {tab === "traffic" && <TrendingUp className="w-4 h-4" />}
                {tab === "hot" && "Hot Deals"}
                {tab === "aged" && "Aged Domains"}
                {tab === "traffic" && "Traffic Domains"}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Header */}
        <motion.div 
          className="text-center  mb-6  sm:mb-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-[#33BDC7] bg-clip-text text-transparent">
              {meta.title}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {meta.subtitle}
          </p>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="animate-pulse bg-white dark:bg-gray-800 border-0 shadow-lg h-full">
                  <CardHeader className="pb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-4"></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Error / Empty */}
        {!loading && (error || filtered.length === 0) && (
          <motion.div 
            className="text-center py-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 full bg-gray-100 dark:bg-gray-800 mb-6">
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              {error ? error : "No domains available for this category at the moment."}
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#38C172] to-[#33BDC7] text-white hover:shadow-lg transition-all duration-300"
              asChild
            >
              <a href="/domains">Browse All Domains</a>
            </Button>
          </motion.div>
        )}

        {/* Carousel */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="relative mb-12">
              {/* Arrows */}
              <button
                aria-label="Previous"
                className="absolute -left-3 sm:-left-4 lg:-left-24  text-red-600 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 full p-2 lg:p-4 shadow hover:shadow-lg disabled:opacity-40"
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5 lg:w-7 lg:h-7 " />
              </button>
              <button
                aria-label="Next"
                className="absolute -right-3 sm:-right-4 lg:-right-24 top-1/2 text-red-600 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 full p-2 lg:p-4 shadow hover:shadow-lg disabled:opacity-40"
                onClick={() => setCurrentIndex((i) => Math.min(Math.max(0, filtered.length - itemsPerView), i + 1))}
                disabled={currentIndex >= Math.max(0, filtered.length - itemsPerView)}
              >
                <ChevronRight className="w-5 h-5 lg:w-7 lg:h-7" />
              </button>

              {/* Viewport */}
              <div className="overflow-hidden">
                <div className="-mx-4">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${(currentIndex * 100) / filtered.length}%)`,
                      width: `${(filtered.length * 100) / itemsPerView}%`,
                    }}
                  >
                    {filtered.map((domain) => (
                      <div
                        key={domain?._id}
                        className="shrink-0 px-4"
                        style={{ width: `${100 / filtered.length}%` }}
                      >
                        <DomainCard domain={domain} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Button 
                size="lg" 
                className="px-8 py-3 full bg-[#33BDC7] text-white hover:shadow-lg transition-all duration-300"
                asChild
              >
                <Link href={meta.viewAllHref}>View All {meta.title}</Link>
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}