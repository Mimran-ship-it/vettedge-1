"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DomainCard } from "@/components/domains/domain-card"
import type { Domain } from "@/types/domain"

export function FeaturedDomains() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedDomains()
  }, [])

  const fetchFeaturedDomains = async () => {
    try {
      const response = await fetch("/api/domains?featured=true&limit=6")
      if (response.ok) {
        const data = await response.json()
        setDomains(data.slice(0, 6)) // Limit to 6 domains
      } else {
        // Fallback to mock data if API fails
        const mockDomains: Domain[] = [
          {
            id: "1",
            name: "techstartup.com",
            description: "Perfect domain for technology startups and innovation companies",
            price: 2500,
            isAvailable: true,
            isSold: false,
            tld: ".com",
            metrics: {
              domainRank: 45,
              referringDomains: 1250,
              authorityLinks: 890,
              avgAuthorityDR: 65,
              monthlyTraffic: 15000,
              year: 2018,
              language: "English",
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "digitalmarketing.net",
            description: "Established domain in the digital marketing niche",
            price: 1800,
            isAvailable: true,
            isSold: false,
            tld: ".net",
            metrics: {
              domainRank: 38,
              referringDomains: 980,
              authorityLinks: 650,
              avgAuthorityDR: 58,
              monthlyTraffic: 12000,
              year: 2019,
              language: "English",
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "3",
            name: "healthwellness.com",
            description: "Premium health and wellness domain with strong backlink profile",
            price: 4500,
            isAvailable: true,
            isSold: false,
            tld: ".com",
            metrics: {
              domainRank: 62,
              referringDomains: 2100,
              authorityLinks: 1650,
              avgAuthorityDR: 78,
              monthlyTraffic: 35000,
              year: 2016,
              language: "English",
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]
        setDomains(mockDomains)
      }
    } catch (error) {
      console.error("Error fetching featured domains:", error)
      // Set empty array on error
      setDomains([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Domains</h2>
            <p className="text-lg text-gray-600">Discover premium expired domains with proven authority</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Domains</h2>
          <p className="text-lg text-gray-600">Discover premium expired domains with proven authority</p>
        </div>

        {domains.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {domains.map((domain) => (
                <DomainCard key={domain.id} domain={domain} />
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" asChild>
                <a href="/domains">View All Domains</a>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No featured domains available at the moment.</p>
            <Button size="lg" asChild>
              <a href="/domains">Browse All Domains</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
