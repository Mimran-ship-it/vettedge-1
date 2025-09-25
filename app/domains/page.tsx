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
  scoresRange: [number, number]
  trustFlowRange: [number, number]
  citationFlowRange: [number, number]
  ageMin: number | null
  referringDomainsMin: number | null
  authorityLinksMin: number | null
  monthlyTrafficMin: number | null
  tags: string[]
  isHot: boolean // Changed to boolean to match DomainFilters component
}
type SortOption = "price-asc" | "price-desc" | "domainRank-desc" | "domainAuthority-desc" | "score-desc" | "age-desc" | "referringDomains-desc" | "monthlyTraffic-desc"
const defaultFilters: ActiveFilters = {
  priceRange: [0, 100000],
  tlds: [],
  availability: "all",
  type: "all",
  domainRankRange: [0, 100],
  domainAuthorityRange: [0, 100],
  scoresRange: [0, 100],
  trustFlowRange: [0, 100],
  citationFlowRange: [0, 100],
  ageMin: null,
  referringDomainsMin: null,
  authorityLinksMin: null,
  monthlyTrafficMin: null,
  tags: [],
  isHot: false // Changed to boolean
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
  
  // Initialize filters from URL parameters
  useEffect(() => {
    const aged = searchParams?.get('aged') === 'true'
    const traffic = searchParams?.get('traffic') === 'true'
    const isHot = searchParams?.get('isHot') === 'true'
    
    let newFilters = { ...defaultFilters }
    let shouldShowFilters = false
    
    if (aged) {
      newFilters.type = 'aged'
      shouldShowFilters = true
    }
    if (traffic) {
      newFilters.type = 'traffic'
      shouldShowFilters = true
    }
    if (isHot) {
      newFilters.isHot = true
      shouldShowFilters = true
    }
    
    if (shouldShowFilters) {
      setActiveFilters(newFilters)
      setShowFilters(true)
    }
  }, [searchParams])
  
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
  
  // Apply filters whenever activeFilters, domains, searchQuery, or sortBy changes
  useEffect(() => {
    applyFilters(activeFilters)
  }, [activeFilters, domains, searchQuery, sortBy])
  
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
        case "score-desc":
        return sorted.sort((a, b) => {
          const aS = a.metrics?.score || 0
          const bS = b.metrics?.score || 0
          return bS - aS
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
    
    // isHot filter - Updated to handle boolean value
    if (filters.isHot) {
      filtered = filtered.filter((d) => d.isHot)
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
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.score === undefined) return true
        return d.metrics.score >= filters.scoresRange[0] && d.metrics.score <= filters.scoresRange[1]
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
        return d.metrics.age >= (filters.ageMin || 0)
      }
    )
    
    // Referring Domains - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.referringDomains === undefined) return true
        return d.metrics.referringDomains >= (filters.referringDomainsMin || 0)
      }
    )
    
    // Authority Links - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.authorityLinks === undefined) return true
        return (d.metrics.authorityLinks?.length || 0) >= (filters.authorityLinksMin || 0)
      }
    )
    
    // Monthly Traffic - be lenient with missing data
    filtered = filtered.filter(
      (d) => {
        if (d.metrics?.monthlyTraffic === undefined || d.metrics.monthlyTraffic === null) return true
        return d.metrics.monthlyTraffic >= (filters.monthlyTrafficMin || 0)
      }
    )
    
    // Apply sorting
    const sorted = sortDomains(filtered, sortBy)
    setFilteredDomains(sorted)
  }, [domains, searchQuery, sortBy, sortDomains])
  
  const applyFiltersWithSorting = (filters: ActiveFilters) => {
    setActiveFilters(filters)
    // applyFilters will be called automatically by the useEffect
  }
  
  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy)
    // Sorting will be applied automatically by the useEffect
  }
  
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    // Filtering will be applied automatically by the useEffect
  }
  
  const resetFilters = () => {
    setSearchQuery("")
    setActiveFilters(defaultFilters)
    setSortBy("price-desc")
    // applyFilters will be called automatically by the useEffect
  }
  
  return (
    <div className="min-h-screen  bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-8xl sm:ms-0 ms-3.5 mx-auto ps-3 pe-6 sm:px-6 lg:px-16 pt-24 pb-8">
        <div className="mb-8 ">
          <h1 className="text-3xl font-bold sm:text-start text-center text-gray-900 dark:text-white mb-4">
            Premium Expired Domains
          </h1>
          <p className="text-lg text-gray-600 sm:text-start text-center dark:text-gray-300">
            Discover high-authority domains with proven SEO value and traffic history
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-8">
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
                  <SelectItem value="score-desc">Score: High to Low</SelectItem>
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
                {showFilters ? (
                  <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">On</span>
                ) : (
                  <span className="ml-2 bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5">Off</span>
                )}
              </Button>
            </div>
          </div>
          
          {/* Active Filters Display */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(activeFilters.type !== "all" || activeFilters.isHot) && (
              <span className="text-sm text-gray-600 mr-2">Active filters:</span>
            )}
            {activeFilters.type !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFilters.type === "aged" ? "Aged Domains" : "Traffic Domains"}
              </span>
            )}
            {activeFilters.isHot && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <Flame className="h-3 w-3 mr-1" /> Hot Deals
              </span>
            )}
          </div>
          
          {/* Always render DomainFilters but hide it when showFilters is false */}
          <div className={`${showFilters ? 'block' : 'hidden'} mt-6 pt-6 border-t`}>
            <DomainFilters 
              onFilterChange={applyFiltersWithSorting} 
              availableTags={availableTags} 
              currentFilters={activeFilters}
            />
          </div>
        </div>
        
        <div className="mb-6 text-gray-600 dark:text-gray-300">
          Showing {filteredDomains.length} of {domains.length} domains
          {filteredDomains.length !== domains.length && (
            <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
              (Filtered from {domains.length} total)
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 w-3/4 mb-4 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2 mb-4 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 w-2/3 rounded"></div>
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
            <p className="text-gray-500 dark:text-gray-400 text-lg">
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