"use client"
import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DomainCard } from "@/components/domains/domain-card"
import { DomainFilters } from "@/components/domains/domain-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowUpDown, Flame } from "lucide-react"
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
  isHot: "all" | "yes" | "no"
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
  isHot: "all"
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
      
      // Apply initial sorting without filters
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

  const sortDomains = useCallback((domainsToSort: Domain[], sortOption: SortOption) => {
    const sorted = [...domainsToSort]
    
    switch (sortOption) {
      case "price-asc":
        // Fixed: Changed to sort from low to high (ascending)
        return sorted.sort((a, b) => Number(a.price) - Number(b.price))
      case "price-desc":
        // Fixed: Changed to sort from high to low (descending)
        return sorted.sort((a, b) => Number(b.price) - Number(a.price))
      case "domainRank-desc":
        return sorted.sort((a, b) => {
          const aRank = a.metrics?.domainRank || 0
          const bRank = b.metrics?.domainRank || 0
          return bRank - aRank
        })
      case "domainAuthority-desc":
        return sorted.sort((a, b) => {
          const aDA = a.metrics?.domainAuthority || 0
          const bDA = b.metrics?.domainAuthority || 0
          return bDA - aDA
        })
      case "age-desc":
        return sorted.sort((a, b) => {
          const aAge = a.metrics?.age || 0
          const bAge = b.metrics?.age || 0
          return bAge - aAge
        })
      case "referringDomains-desc":
        return sorted.sort((a, b) => {
          const aRD = a.metrics?.referringDomains || 0
          const bRD = b.metrics?.referringDomains || 0
          return bRD - aRD
        })
      case "monthlyTraffic-desc":
        return sorted.sort((a, b) => {
          const aTraffic = a.metrics?.monthlyTraffic || 0
          const bTraffic = b.metrics?.monthlyTraffic || 0
          return bTraffic - aTraffic
        })
      default:
        return sorted
    }
  }, [])

  const applyFilters = useCallback((filters: ActiveFilters) => {
    setActiveFilters(filters)
    let filtered = [...domains]
    
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.description && d.description.toLowerCase().includes(q))
      )
    }
    
    // Price range
    filtered = filtered.filter(
      (d) => d.price >= filters.priceRange[0] && d.price <= filters.priceRange[1]
    )
    
    // TLDs
    if (filters.tlds.length > 0) {
      filtered = filtered.filter((d) =>
        filters.tlds.some((tld) => d.name.toLowerCase().endsWith(tld.toLowerCase()))
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
    
    // isHot filter
    if (filters.isHot === "yes") {
      filtered = filtered.filter((d) => d.isHot)
    } else if (filters.isHot === "no") {
      filtered = filtered.filter((d) => !d.isHot)
    }
    
    // Domain Rank - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.domainRank === undefined) return true
        return d.metrics.domainRank >= filters.domainRankRange[0] && d.metrics.domainRank <= filters.domainRankRange[1]
      }
    )
    
    // Domain Authority - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.domainAuthority === undefined) return true
        return d.metrics.domainAuthority >= filters.domainAuthorityRange[0] && d.metrics.domainAuthority <= filters.domainAuthorityRange[1]
      }
    )
    
    // Trust Flow - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.trustFlow === undefined) return true
        return d.metrics.trustFlow >= filters.trustFlowRange[0] && d.metrics.trustFlow <= filters.trustFlowRange[1]
      }
    )
    
    // Citation Flow - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.citationFlow === undefined) return true
        return d.metrics.citationFlow >= filters.citationFlowRange[0] && d.metrics.citationFlow <= filters.citationFlowRange[1]
      }
    )
    
    // Age - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.age === undefined) return true
        return d.metrics.age >= filters.ageMin
      }
    )
    
    // Referring Domains - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.referringDomains === undefined) return true
        return d.metrics.referringDomains >= filters.referringDomainsMin
      }
    )
    
    // Authority Links - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.authorityLinks === undefined) return true
        return (d.metrics.authorityLinks?.length || 0) >= filters.authorityLinksMin
      }
    )
    
    // Monthly Traffic - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.monthlyTraffic === undefined || d.metrics.monthlyTraffic === null) return true
        return d.metrics.monthlyTraffic >= filters.monthlyTrafficMin
      }
    )
    
    // Apply sorting
    const sorted = sortDomains(filtered, sortBy)
    setFilteredDomains(sorted)
  }, [domains, searchQuery, sortBy, sortDomains])

  const applyFiltersWithSorting = (filters: ActiveFilters) => {
    setActiveFilters(filters)
    applyFilters(filters)
  }

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy)
    // Apply the new sort immediately
    const sorted = sortDomains(filteredDomains, newSortBy)
    setFilteredDomains(sorted)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    applyFilters({ ...activeFilters })
  }

  const resetFilters = () => {
    setSearchQuery("")
    setActiveFilters(defaultFilters)
    setSortBy("price-desc")
    applyFiltersWithSorting(defaultFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-8xl mx-auto ps-3 pe-6 sm:px-6 lg:px-16 pt-24 pb-8">
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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort By Option */}
            <div className="flex flex-col sm:flex-row gap-2 sm:w-auto w-full">
  <Select value={sortBy} onValueChange={handleSortChange}>
    <SelectTrigger className="w-full sm:w-40 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
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
  
  <Button 
    variant="outline" 
    onClick={() => setShowFilters(!showFilters)}
    className="w-full sm:w-auto h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  >
    <Filter className="h-4 w-4 mr-2" />
    Filters
  </Button>
</div>
          </div>
          
          {/* Debug Info */}
          <div className="mt-4 text-xs text-gray-500">
            Current sort: {sortBy} | Showing {filteredDomains.length} domains
          </div>
          
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <DomainFilters 
                onFilterChange={applyFiltersWithSorting} 
                availableTags={availableTags} 
                currentFilters={activeFilters}
              />
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
          <div className=" grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
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
              onClick={resetFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main> 
      <Footer/>
    </div>
  )
}