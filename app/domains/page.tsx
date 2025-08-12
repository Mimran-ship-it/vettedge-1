"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DomainCard } from "@/components/domains/domain-card"
import { DomainFilters } from "@/components/domains/domain-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import type { Domain } from "@/types/domain"
import { LiveChat } from "@/components/chat/live-chat"
import { useSearchParams } from "next/navigation"



// Define filters type
type ActiveFilters = {
  priceRange: [number, number]
  tlds: string[]
  availability: "all" | "available" | "sold"
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    priceRange: [0, 1000],
    tlds: [],
    availability: "all",
  })

  const searchParams = useSearchParams()

  useEffect(() => {
    const urlSearch = searchParams.get("search")
    if (urlSearch) setSearchQuery(urlSearch)
    fetchDomains()
  }, [searchParams])

  const fetchDomains = async () => {
    try {
      const res = await fetch("/api/domains")
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
      const data: Domain[] = await res.json()
      setDomains(data)
      setFilteredDomains(data)
    } catch (err) {
      console.error("Failed to fetch domains:", err)
      setDomains([])
      setFilteredDomains([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (filters: ActiveFilters) => {
    setActiveFilters(filters)
    let filtered = [...domains]

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      )
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        (d) => d.price >= filters.priceRange[0] && d.price <= filters.priceRange[1]
      )
    }

    // TLD filter
    if (filters.tlds?.length > 0) {
      filtered = filtered.filter((d) =>
        filters.tlds.some((tld) => d.name.toLowerCase().endsWith(tld))
      )
    }

    // Availability filter
    if (filters.availability === "available") {
      filtered = filtered.filter((d) => d.isAvailable && !d.isSold)
    } else if (filters.availability === "sold") {
      filtered = filtered.filter((d) => d.isSold)
    }

    

    setFilteredDomains(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Premium Expired Domains
          </h1>
          <p className="text-lg text-gray-600">
            Discover high-authority domains with proven SEO value and traffic history
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search domains by name or keyword..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  applyFilters({ ...activeFilters }) // keep existing filters
                }}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <DomainFilters onFilterChange={applyFilters} />
            </div>
          )}
        </div>

        <div className="mb-6 text-gray-600">
          Showing {filteredDomains.length} of {domains.length} domains
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg animate-pulse">
                <div className="h-6 bg-gray-200 w-3/4 mb-4 rounded"></div>
                <div className="h-4 bg-gray-200 w-1/2 mb-4 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDomains.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map((domain) => (
              <DomainCard key={domain._id} domain={domain} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No domains found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setShowFilters(false)
                setFilteredDomains(domains)
                setActiveFilters({
                  priceRange: [0, 1000],
                  tlds: [],
                  availability: "all",
                })
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
      <Footer />
      <LiveChat />
    </div>
  )
}
