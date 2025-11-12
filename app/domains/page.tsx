"use client"
import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DomainCard } from "@/components/domains/domain-card"
import { DomainFilters } from "@/components/domains/domain-filters"
import { SavedFiltersList } from "@/components/domains/saved-filters-list"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
type ActiveFilters = {
  priceRange: [number, number]
  tlds: string[]
  availability: "all" | "available" | "sold"
  type: "all" | "aged" | "traffic"
  domainRankRange: [number, number]
  domainAuthorityRange: [number, number]
  scoresRange?: [number, number]
  trustFlowRange: [number, number]
  citationFlowRange: [number, number]
  ageMin: number | null
  referringDomainsMin: number | null
  authorityLinksMin: number | null
  monthlyTrafficMin: number | null
  tags: string[]
  isHot: boolean // Changed to boolean to match DomainFilters component
}
type SortOption = "price-asc" | "price-desc" | "domainRank-desc" | "domainAuthority-desc" | "score-desc" | "age-desc" | "referringDomains-desc" | "monthlyTraffic-desc" | "newest" | "oldest"
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
  const [tldCounts, setTldCounts] = useState<Record<string, number>>({})
  const [sortBy, setSortBy] = useState<SortOption>("price-desc")
  const [showSortSheet, setShowSortSheet] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0) // Trigger for saved filters refresh
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
      const tldCountMap: Record<string, number> = {}
      
      data.forEach((d) => {
        // Extract TLD (everything after the last dot)
        const parts = d.name.split('.')
        if (parts.length > 1) {
          const tld = parts[parts.length - 1].toLowerCase()
          tldCountMap[tld] = (tldCountMap[tld] || 0) + 1
        }
        
        // Handle tags
        d.tags?.forEach((tag) => tagsSet.add(tag))
      })
      
      setAvailableTags(Array.from(tagsSet))
      setTldCounts(tldCountMap)
      
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
    if (domains.length > 0) {
      applyFilters(activeFilters)
    }
  }, [activeFilters, domains, searchQuery, sortBy])
  
  const sortDomains = useCallback((domains: Domain[], sortOption: SortOption): Domain[] => {
    const sorted = [...domains]
    
    switch (sortOption) {
      case "price-asc":
        // Sort from low to high (ascending)
        return sorted.sort((a, b) => Number(a.price) - Number(b.price))
      case "price-desc":
        // Sort from high to low (descending)
        return sorted.sort((a, b) => Number(b.price) - Number(a.price))
      case "newest":
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case "oldest":
        return sorted.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      case "domainRank-desc":
        return sorted.sort((a, b) => {
          const aRank = a.metrics?.domainRank || 0
          const bRank = b.metrics?.domainRank || 0
          return bRank - aRank
        })
      case "domainAuthority-desc":
        return sorted.sort((a, b) => (b.metrics?.domainAuthority || 0) - (a.metrics?.domainAuthority || 0))
      case "score-desc":
        return sorted.sort((a, b) => (b.metrics?.score || 0) - (a.metrics?.score || 0))
      case "age-desc":
        return sorted.sort((a, b) => (b.metrics?.age || 0) - (a.metrics?.age || 0))
      case "referringDomains-desc":
        return sorted.sort((a, b) => (b.metrics?.referringDomains || 0) - (a.metrics?.referringDomains || 0))
      case "monthlyTraffic-desc":
        return sorted.sort((a, b) => ((b.metrics?.monthlyTraffic || 0) - (a.metrics?.monthlyTraffic || 0)))
      default:
        return sorted
    }
  }, [])
  
  const applyFilters = useCallback((filters: ActiveFilters) => {
    let result = [...domains]
    
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.description && d.description.toLowerCase().includes(q))
      )
    }
    
    // Price range
    result = result.filter(
      (d) => d.price >= filters.priceRange[0] && d.price <= filters.priceRange[1]
    )
    
    // TLDs
    if (filters.tlds.length > 0) {
      result = result.filter((d) =>
        filters.tlds.some((tld) => d.name.toLowerCase().endsWith(tld.toLowerCase()))
      )
    }
    
    // Availability
    if (filters.availability === "available") {
      result = result.filter((d) => d.isAvailable && !d.isSold)
    } else if (filters.availability === "sold") {
      result = result.filter((d) => d.isSold)
    }
    
    // Type
    if (filters.type !== "all") {
      result = result.filter((d) => d.type?.toLowerCase() === filters.type)
    }
    
    // Tags filter
    if (filters.tags.length > 0) {
      result = result.filter((d) =>
        d.tags?.some((tag) => filters.tags.includes(tag))
      )
    }
    
    // isHot filter - Updated to handle boolean value
    if (filters.isHot) {
      result = result.filter((d) => d.isHot)
    }
    
    // Domain Rank - be lenient with missing data
    result = result.filter(
      (d) => {
        if (d.metrics?.domainRank === undefined) return true
        return d.metrics.domainRank >= filters.domainRankRange[0] && d.metrics.domainRank <= filters.domainRankRange[1]
      }
    )
    
    // Domain Authority - be lenient with missing data
    result = result.filter(
      (d) => {
        if (d.metrics?.domainAuthority === undefined) return true
        return d.metrics.domainAuthority >= filters.domainAuthorityRange[0] && d.metrics.domainAuthority <= filters.domainAuthorityRange[1]
      }
    )
    if (filters.scoresRange) {
      result = result.filter(
        (d) => {
          if (d.metrics?.score === undefined) return true
          return d.metrics.score >= filters.scoresRange![0] && d.metrics.score <= filters.scoresRange![1]
        }
      )
    }
    // Trust Flow - be lenient with missing data
    result = result.filter(
      (d) => {
        if (d.metrics?.trustFlow === undefined) return true
        return d.metrics.trustFlow >= filters.trustFlowRange[0] && d.metrics.trustFlow <= filters.trustFlowRange[1]
      }
    )
    
    // Citation Flow - be lenient with missing data
    result = result.filter(
      (d) => {
        if (d.metrics?.citationFlow === undefined) return true
        return d.metrics.citationFlow >= filters.citationFlowRange[0] && d.metrics.citationFlow <= filters.citationFlowRange[1]
      }
    )
    
    // Age - be lenient with missing data
    result = result.filter(
      (d) => {
        if (d.metrics?.age === undefined) return true
        return d.metrics.age >= (filters.ageMin || 0)
      }
    )
    
    // Referring Domains - be lenient with missing data
    result = result.filter(
      (d) => {
        if (d.metrics?.referringDomains === undefined) return true
        return d.metrics.referringDomains >= (filters.referringDomainsMin || 0)
      }
    )
    
    // Authority Links - use authorityLinksCount directly
    result = result.filter(
      (d) => {
        if (d.metrics?.authorityLinksCount === undefined) return true
        return (d.metrics.authorityLinksCount || 0) >= (filters.authorityLinksMin || 0)
      }
    )
    
    // Monthly Traffic - be lenient with missing data
    result = result.filter(
      (d) => {
        if (d.metrics?.monthlyTraffic === undefined || d.metrics.monthlyTraffic === null) return true
        return d.metrics.monthlyTraffic >= (filters.monthlyTrafficMin || 0)
      }
    )
    
    // Apply sorting
    const sorted = sortDomains(result, sortBy)
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

  const openFiltersMobile = () => {
    setShowFilters(true)
    // Scroll to top of the page for mobile
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
  
  const handleFilterSaved = () => {
    // Increment trigger to force SavedFiltersList to refetch
    setRefreshTrigger(prev => prev + 1)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-8xl sm:ms-0  sm:px-6 lg:px-16 pt-24 pb-28 lg:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold  text-center text-gray-900 dark:text-white mb-4">
          Domain inventory
          </h1>
          
        </div>
        
        {/* Layout: Sidebar (filters) on the left, results on the right */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Fixed on desktop, hidden on mobile */}
          <aside
            id="filtersSidebar"
            className="hidden  bg-[#F9FAFB] lg:flex flex-col w-[22%] fixed top-16 left-0 bottom-0 dark:bg-gray-900   overflow-y-scroll hover:overflow-y-scroll"
          >
            <div className="space-y-6 px-4 py-4">
              {/* Filters Section */}
              <div className="bg-[#F9FAFB] dark:bg-gray-800 dark:border-gray-700 p-4 lg:p-5">
                <div className="mb-4 flex items-center justify-between lg:hidden">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? "Hide" : "Show"}
                  </Button>
                </div>

                <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
                  <DomainFilters
                    onFilterChange={applyFiltersWithSorting}
                    availableTags={availableTags}
                    currentFilters={activeFilters}
                    onFilterSaved={handleFilterSaved}
                    tldCounts={tldCounts}
                  />
                </div>
              </div>

              {/* Saved Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 lg:p-5">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Saved Filters
                </h3>
                <SavedFiltersList
                  onApplyFilter={(filters) => {
                    setActiveFilters(filters);
                    setShowFilters(true);
                  }}
                  currentFilters={activeFilters}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1 lg:ml-[20%] px-4 lg:px-0">
            {/* Mobile Filters - Conditionally shown */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 lg:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      Hide
                    </Button>
                  </div>
                  <DomainFilters
                    onFilterChange={applyFiltersWithSorting}
                    availableTags={availableTags}
                    currentFilters={activeFilters}
                    onFilterSaved={handleFilterSaved}
                    tldCounts={tldCounts}
                  />
                </div>
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 lg:p-5">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                    Saved Filters
                  </h3>
                  <SavedFiltersList
                    onApplyFilter={(filters) => {
                      setActiveFilters(filters);
                      setShowFilters(true);
                    }}
                    currentFilters={activeFilters}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
              {/* Search & Sort */}
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

                <div className="flex flex-col sm:flex-row gap-2 sm:w-auto w-full">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full sm:w-fit h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="domainRank-desc">Domain Rank: High to Low</SelectItem>
                      <SelectItem value="domainAuthority-desc">Domain Authority: High to Low</SelectItem>
                      <SelectItem value="score-desc">Score: High to Low</SelectItem>
                      <SelectItem value="age-desc">Age: Oldest First</SelectItem>
                      <SelectItem value="referringDomains-desc">
                        Referring Domains: High to Low
                      </SelectItem>
                      <SelectItem value="monthlyTraffic-desc">
                        Monthly Traffic: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
            </div>

            {/* Filtered Info */}
            <div className="mb-6 text-gray-600 dark:text-gray-300">
              Showing {filteredDomains.length} of {domains.length} domains
              {filteredDomains.length !== domains.length && (
                <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                  (Filtered from {domains.length} total)
                </span>
              )}
            </div>

            {/* Domain Cards */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg animate-pulse"
                  >
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
              <div className="grid border md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {filteredDomains.map((domain) => (
                  <DomainCard key={domain._id} domain={domain} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No domains found matching your criteria.
                </p>
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
      
      {/* Mobile sticky actions */}
      <div className="fixed inset-x-0 bottom-0 mr-16 z-50 lg:hidden bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-800 backdrop-blur supports-[backdrop-filter]:backdrop-blur px-4 py-3">
        <div className="max-w-8xl mx-auto flex items-center gap-3">
          <Button className="flex-1" variant="outline" onClick={openFiltersMobile}>
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
          <Button className="flex-1" onClick={() => setShowSortSheet(true)}>
            <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
          </Button>
        </div>
      </div>

      {/* Mobile Sort Dialog */}
      <Dialog open={showSortSheet} onOpenChange={setShowSortSheet}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sort domains</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
            {([
              { key: "price-asc", label: "Price: Low to High" },
              { key: "price-desc", label: "Price: High to Low" },
              { key: "newest", label: "Newest First" },
              { key: "oldest", label: "Oldest First" },
              { key: "domainRank-desc", label: "Domain Rank: High to Low" },
              { key: "domainAuthority-desc", label: "Domain Authority: High to Low" },
              { key: "score-desc", label: "Score: High to Low" },
              { key: "age-desc", label: "Age: Oldest First" },
              { key: "referringDomains-desc", label: "Referring Domains: High to Low" },
              { key: "monthlyTraffic-desc", label: "Monthly Traffic: High to Low" },
            ] as { key: SortOption; label: string }[]).map(opt => (
              <Button
                key={opt.key}
                variant={sortBy === opt.key ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => {
                  handleSortChange(opt.key)
                  setShowSortSheet(false)
                }}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Footer/>
    </div>
  )
}