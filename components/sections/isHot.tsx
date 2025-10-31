"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DomainCard } from "@/components/domains/domain-card"
import type { Domain } from "@/types/domain"
import Link from "next/link"

export function IsHot() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [visibleCount, setVisibleCount] = useState(6)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHotDomains = async () => {
      try {
        const response = await fetch("/api/domains")
        if (!response.ok) throw new Error(`Server returned ${response.status}`)

        const data: Domain[] = await response.json()

        // Filter only available isHot domains
        const hotDomains = data.filter((domain) => domain.isHot === true && domain.isAvailable === true && domain.isSold === false)

        setDomains(hotDomains)
      } catch (err: any) {
        console.error("Failed to fetch hot domains:", err)
        setError("Unable to load hot deals at the moment.")
        setDomains([])
      } finally {
        setLoading(false)
      }
    }

    fetchHotDomains()
  }, [])

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  return (
    <section className="py-16 bg-blue-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#33BDC7] mb-4">🔥 Hot Deals</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover premium Aged Domains with proven authority — now available at 20–80% off
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error or No Data */}
        {!loading && (error || domains.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {error ? error : "No hot deals available at the moment."}
            </p>
            <Button size="lg" asChild>
              <a href="/domains">Browse All Domains</a>
            </Button>
          </div>
        )}

        {/* Domains List */}
        {!loading && domains.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {domains.slice(0, visibleCount).map((domain) => (
                <DomainCard key={domain?._id} domain={domain} />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              {visibleCount < domains.length && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShowMore}
                  className="transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                >
                  Show More
                </Button>
              )}
              <Button size="lg" className="bg-[#3BD17A] text-white hover:bg-[rgb(59,209,122)]" asChild>
                <Link href="/domains?isHot=true">View All </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
