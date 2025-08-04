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

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get search query from URL params
    const urlSearch = searchParams.get("search")
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
    fetchDomains()
  }, [searchParams])

  const fetchDomains = async () => {
    try {
      const response = await fetch("/api/domains")
      if (response.ok) {
        const data = await response.json()
        setDomains(data)
        setFilteredDomains(data)
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
          // Add more mock domains as needed
        ]
        setDomains(mockDomains)
        setFilteredDomains(mockDomains)
      }
    } catch (error) {
      console.error("Error fetching domains:", error)
      setDomains([])
      setFilteredDomains([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = domains

    if (searchQuery) {
      filtered = filtered.filter(
        (domain) =>
          domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          domain.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredDomains(filtered)
  }, [searchQuery, domains])

  const handleFilterChange = (filters: any) => {
    let filtered = domains

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (domain) =>
          domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          domain.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply price filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        (domain) => domain.price >= filters.priceRange[0] && domain.price <= filters.priceRange[1],
      )
    }

    // Apply TLD filter
    if (filters.tlds && filters.tlds.length > 0) {
      filtered = filtered.filter((domain) => filters.tlds.includes(domain.tld))
    }

    // Apply availability filter
    if (filters.availability) {
      if (filters.availability === "available") {
        filtered = filtered.filter((domain) => domain.isAvailable && !domain.isSold)
      } else if (filters.availability === "sold") {
        filtered = filtered.filter((domain) => domain.isSold)
      }
    }

    setFilteredDomains(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Premium Expired Domains</h1>
          <p className="text-lg text-gray-600">
            Discover high-authority domains with proven SEO value and traffic history
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search domains by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <DomainFilters onFilterChange={handleFilterChange} />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDomains.length} of {domains.length} domains
          </p>
        </div>

        {/* Domain Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDomains.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map((domain) => (
              <DomainCard key={domain.id} domain={domain} />
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
