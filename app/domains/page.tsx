"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DomainCard } from "@/components/domains/domain-card"
import { DomainFilters } from "@/components/domains/domain-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import type { Domain } from "@/types/domain"
import { LiveChat } from "@/components/chat/live-chat"
import { useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ActiveFilters = {
  priceRange: [number, number]
  tlds: string[]
  availability: "all" | "available" | "sold"
  type: "all" | "aged" | "traffic"
  domainRankRange: [number, number]
  domainAuthorityRange: [number, number]
  trustFlowRange: [number, number]
  citationFlowRange: [number, number]
  ageMin: number
  referringDomainsMin: number
  authorityLinksMin: number
  monthlyTrafficMin: number
  tags: string[]
}

type SortOption = "price-asc" | "price-desc" | "domainRank-desc" | "domainAuthority-desc" | "age-desc" | "referringDomains-desc" | "monthlyTraffic-desc"

const defaultFilters: ActiveFilters = {
  priceRange: [0, 100000],
  tlds: [],
  availability: "all",
  type: "all",
  domainRankRange: [0, 100],
  domainAuthorityRange: [0, 100],
  trustFlowRange: [0, 100],
  citationFlowRange: [0, 100],
  ageMin: 0,
  referringDomainsMin: 0,
  authorityLinksMin: 0,
  monthlyTrafficMin: 0,
  tags: [],
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(defaultFilters)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("price-desc")

  const searchParams = useSearchParams()

  useEffect(() => {
    const urlSearch = searchParams?.get("search")
    if (urlSearch) setSearchQuery(urlSearch)
    fetchDomains()
  }, [searchParams])

  // Re-apply sorting when sortBy changes
  useEffect(() => {
    if (domains.length > 0) {
      const sorted = sortDomains(filteredDomains, sortBy)
      setFilteredDomains(sorted)
    }
  }, [sortBy, domains.length])

  const fetchDomains = async () => {
    try {
      const res = await fetch("/api/domains")
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
      const data: Domain[] = await res.json()
      setDomains(data)
      
      // Extract unique tags dynamically
      const tagsSet = new Set<string>()
      data.forEach((d) => {
        d.tags?.forEach((tag) => tagsSet.add(tag))
      })
      setAvailableTags(Array.from(tagsSet))
      
      // Apply initial sorting to all domains
      const sorted = sortDomains(data, sortBy)
      setFilteredDomains(sorted)
    } catch (err) {
      console.error("Failed to fetch domains:", err)
      setDomains([])
      setFilteredDomains([])
    } finally {
      setLoading(false)
    }
  }

  const sortDomains = (domainsToSort: Domain[], sortOption: SortOption) => {
    const sorted = [...domainsToSort]
    
    console.log(`Sorting by: ${sortOption}, Total domains: ${sorted.length}`)
    
    let result
    switch (sortOption) {
      case "price-asc":
        result = sorted.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case "price-desc":
        result = sorted.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case "domainRank-desc":
        result = sorted.sort((a, b) => (b.metrics?.domainRank || 0) - (a.metrics?.domainRank || 0))
        break
      case "domainAuthority-desc":
        result = sorted.sort((a, b) => (b.metrics?.domainAuthority || 0) - (a.metrics?.domainAuthority || 0))
        break
      case "age-desc":
        result = sorted.sort((a, b) => (b.metrics?.age || 0) - (a.metrics?.age || 0))
        break
      case "referringDomains-desc":
        result = sorted.sort((a, b) => (b.metrics?.referringDomains || 0) - (a.metrics?.referringDomains || 0))
        break
      case "monthlyTraffic-desc":
        result = sorted.sort((a, b) => (b.metrics?.monthlyTraffic ?? 0) - (a.metrics?.monthlyTraffic ?? 0))
        break
      default:
        result = sorted
    }
    
    console.log(`After sorting: ${result.length} domains`)
    console.log('First 3 domains after sorting:', result.slice(0, 3).map(d => ({
      name: d.name,
      price: d.price,
      domainRank: d.metrics?.domainRank,
      domainAuthority: d.metrics?.domainAuthority
    })))
    
    return result
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

    // Price range
    filtered = filtered.filter(
      (d) => d.price >= filters.priceRange[0] && d.price <= filters.priceRange[1]
    )

    // TLDs
    if (filters.tlds.length > 0) {
      filtered = filtered.filter((d) =>
        filters.tlds.some((tld) => d.name.toLowerCase().endsWith(tld))
      )
    }

    // Availability
    if (filters.availability === "available") {
      filtered = filtered.filter((d) => d.isAvailable && !d.isSold)
    } else if (filters.availability === "sold") {
      filtered = filtered.filter((d) => d.isSold)
    }

    // Type
    if (filters.type !== "all") {
      filtered = filtered.filter((d) => d.type?.toLowerCase() === filters.type)
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((d) =>
        d.tags?.some((tag) => filters.tags.includes(tag))
      )
    }

    // Domain Rank
    filtered = filtered.filter(
      (d) =>
        d.metrics?.domainRank !== undefined &&
        d.metrics.domainRank >= filters.domainRankRange[0] &&
        d.metrics.domainRank <= filters.domainRankRange[1]
    )

    // Domain Authority
    filtered = filtered.filter(
      (d) =>
        d.metrics?.domainAuthority !== undefined &&
        d.metrics.domainAuthority >= filters.domainAuthorityRange[0] &&
        d.metrics.domainAuthority <= filters.domainAuthorityRange[1]
    )

    // Trust Flow
    filtered = filtered.filter(
      (d) =>
        d.metrics?.trustFlow !== undefined &&
        d.metrics.trustFlow >= filters.trustFlowRange[0] &&
        d.metrics.trustFlow <= filters.trustFlowRange[1]
    )

    // Citation Flow
    filtered = filtered.filter(
      (d) =>
        d.metrics?.citationFlow !== undefined &&
        d.metrics.citationFlow >= filters.citationFlowRange[0] &&
        d.metrics.citationFlow <= filters.citationFlowRange[1]
    )

    // Age
    filtered = filtered.filter(
      (d) =>
        d.metrics?.age !== undefined && d.metrics.age >= filters.ageMin
    )

    // Referring Domains
    filtered = filtered.filter(
      (d) =>
        d.metrics?.referringDomains !== undefined &&
        d.metrics.referringDomains >= filters.referringDomainsMin
    )

    // Authority Links
    filtered = filtered.filter(
      (d) =>
        (d.metrics?.authorityLinks?.length || 0) >= filters.authorityLinksMin
    )

    // Monthly Traffic
    filtered = filtered.filter(
      (d) =>
        d.metrics?.monthlyTraffic !== undefined &&
        d.metrics?.monthlyTraffic !== null &&
        d.metrics.monthlyTraffic >= filters.monthlyTrafficMin
    )

    console.log(`After filtering: ${filtered.length} domains`)
    
    // Apply sorting to filtered results
    const sorted = sortDomains(filtered, sortBy)
    setFilteredDomains(sorted)
  }

  const handleSortChange = (newSortBy: SortOption) => {
    console.log('Sort changed from', sortBy, 'to', newSortBy)
    setSortBy(newSortBy)
    
    // Get current filtered domains and apply new sorting
    const currentFiltered = filteredDomains
    const sorted = sortDomains(currentFiltered, newSortBy)
    setFilteredDomains(sorted)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
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
                  applyFilters({ ...activeFilters })
                }}
                className="pl-10"
              />
            </div>
            
            {/* Sort By Option */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="domainRank-desc">Domain Rank: High to Low</SelectItem>
                <SelectItem value="domainAuthority-desc">Domain Authority: High to Low</SelectItem>
                <SelectItem value="age-desc">Age: Oldest First</SelectItem>
                <SelectItem value="referringDomains-desc">Referring Domains: High to Low</SelectItem>
                <SelectItem value="monthlyTraffic-desc">Monthly Traffic: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          
          {/* Debug Info */}
          <div className="mt-4 text-xs text-gray-500">
            Current sort: {sortBy} | Showing {filteredDomains.length} domains
          </div>
          
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <DomainFilters onFilterChange={applyFilters} availableTags={availableTags} />
            </div>
          )}
        </div>

        <div className="mb-6 text-gray-600">
          Showing {filteredDomains.length} of {domains.length} domains
          {filteredDomains.length !== domains.length && (
            <span className="ml-2 text-sm text-blue-600">
              (Filtered from {domains.length} total)
            </span>
          )}
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
            <p className="text-gray-500 text-lg">
              No domains found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setShowFilters(false)
                setActiveFilters(defaultFilters)
                setSortBy("price-desc")
                // Reset to show all domains with current sorting
                const sorted = sortDomains(domains, "price-desc")
                setFilteredDomains(sorted)
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
