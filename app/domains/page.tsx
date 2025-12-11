"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DomainCard } from "@/components/domains/domain-card"
import { DomainFilters } from "@/components/domains/domain-filters"
import { SavedFiltersList } from "@/components/domains/saved-filters-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowUpDown, Flame, X, Grid, List } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

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
  isHot: boolean
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
  isHot: false
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(defaultFilters)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [tldCounts, setTldCounts] = useState<Record<string, number>>({})
  const [sortBy, setSortBy] = useState<SortOption>("price-desc")
  const [showSortSheet, setShowSortSheet] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sidebarBottomOffset, setSidebarBottomOffset] = useState(0)
  const footerRef = useRef<HTMLElement>(null)
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

  // Monitor scroll position and adjust sidebar to avoid footer overlap
  useEffect(() => {
    let observer: IntersectionObserver | null = null

    const handleScroll = () => {
      if (typeof window === 'undefined') return

      const footer = footerRef.current
      if (!footer) {
        setSidebarBottomOffset(0)
        return
      }

      const footerRect = footer.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Calculate how much of the footer is visible in the viewport
      const footerTop = footerRect.top

      // If footer is entering the viewport from bottom
      if (footerTop < viewportHeight) {
        // Calculate the overlap: how much space the footer takes from the bottom
        const footerVisibleHeight = Math.max(0, viewportHeight - footerTop)
        // Add some padding to prevent overlap
        const offset = footerVisibleHeight + 20 // 20px padding
        setSidebarBottomOffset(offset)
      } else {
        // Footer is below viewport, no offset needed
        setSidebarBottomOffset(0)
      }
    }

    // Wait a bit for DOM to be ready, then set up observers
    const timeoutId = setTimeout(() => {
      // Initial check
      handleScroll()

      // Listen to scroll events
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })

      // Use Intersection Observer for better performance
      observer = new IntersectionObserver(
        (entries) => {
          handleScroll()
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: [0, 0.1, 0.5, 1]
        }
      )

      if (footerRef.current) {
        observer.observe(footerRef.current)
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [loading]) // Re-run when loading completes to ensure footer is rendered

  const sortDomains = useCallback((domains: Domain[], sortOption: SortOption): Domain[] => {
    const sorted = [...domains]

    switch (sortOption) {
      case "price-asc":
        return sorted.sort((a, b) => Number(a.price) - Number(b.price))
      case "price-desc":
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

    // isHot filter
    if (filters.isHot) {
      result = result.filter((d) => d.isHot)
    }

    // Domain Rank
    result = result.filter(
      (d) => {
        if (d.metrics?.domainRank === undefined) return true
        return d.metrics.domainRank >= filters.domainRankRange[0] && d.metrics.domainRank <= filters.domainRankRange[1]
      }
    )

    // Domain Authority
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
    // Trust Flow
    result = result.filter(
      (d) => {
        if (d.metrics?.trustFlow === undefined) return true
        return d.metrics.trustFlow >= filters.trustFlowRange[0] && d.metrics.trustFlow <= filters.trustFlowRange[1]
      }
    )

    // Citation Flow
    result = result.filter(
      (d) => {
        if (d.metrics?.citationFlow === undefined) return true
        return d.metrics.citationFlow >= filters.citationFlowRange[0] && d.metrics.citationFlow <= filters.citationFlowRange[1]
      }
    )

    // Age
    result = result.filter(
      (d) => {
        if (d.metrics?.age === undefined) return true
        return d.metrics.age >= (filters.ageMin || 0)
      }
    )

    // Referring Domains
    result = result.filter(
      (d) => {
        if (d.metrics?.referringDomains === undefined) return true
        return d.metrics.referringDomains >= (filters.referringDomainsMin || 0)
      }
    )

    // Authority Links
    result = result.filter(
      (d) => {
        if (d.metrics?.authorityLinksCount === undefined) return true
        return (d.metrics.authorityLinksCount || 0) >= (filters.authorityLinksMin || 0)
      }
    )

    // Monthly Traffic
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
  }

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy)
  }

  const openFiltersMobile = () => {
    setShowFilters(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setActiveFilters(defaultFilters)
    setSortBy("price-desc")
  }

  const handleFilterSaved = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const removeFilter = (filterType: string) => {
    if (filterType === "type") {
      setActiveFilters(prev => ({ ...prev, type: "all" }))
    } else if (filterType === "isHot") {
      setActiveFilters(prev => ({ ...prev, isHot: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-8xl sm:ms-0 sm:px-6 lg:px-16 pt-24 pb-28 lg:pb-8">
        {/* Header Section */}
        <div className={`mb-10 text-center transition-all duration-300 ease-in-out ${showDesktopSidebar ? "lg:ml-[22%]" : "lg:ml-14"}`}>
          <h1 className="text-2xl  sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Domain Inventory
          </h1>
          <p className="hidden sm:block text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our premium collection of domain names with detailed metrics and analytics
          </p>

        </div>

        {/* Layout: Sidebar (filters) on the left, results on the right */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Fixed on desktop, hidden on mobile */}
          <aside
            id="filtersSidebar"
            className={`hidden lg:block w-[22%] fixed top-16 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto shadow-sm z-10 transition-all duration-300 ease-in-out ${showDesktopSidebar ? "translate-x-0" : "-translate-x-full"}`}
            style={{
              height: `calc(100vh - 4rem - ${sidebarBottomOffset}px)`,
              maxHeight: `calc(100vh - 4rem - ${sidebarBottomOffset}px)`,
              bottom: sidebarBottomOffset > 0 ? `${sidebarBottomOffset}px` : 'auto'
            }}
          >
            <div className="p-5 pb-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  {/* <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2> */}
                </div>
                <DomainFilters
                  onFilterChange={applyFiltersWithSorting}
                  availableTags={availableTags}
                  currentFilters={activeFilters}
                  onFilterSaved={handleFilterSaved}
                  tldCounts={tldCounts}
                  onCloseSidebar={() => setShowDesktopSidebar(false)}
                />
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <span>Saved Filters</span>
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

          {/* Collapsed rail (desktop) */}
          {!showDesktopSidebar && (
            <div
              className="hidden lg:flex flex-col items-center gap-2 w-14 fixed top-16 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10 py-4 transition-all duration-300"
              style={{
                height: `calc(100vh - 4rem - ${sidebarBottomOffset}px)`,
                maxHeight: `calc(100vh - 4rem - ${sidebarBottomOffset}px)`,
                bottom: sidebarBottomOffset > 0 ? `${sidebarBottomOffset}px` : 'auto'
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setShowDesktopSidebar(true)}
                title="Open filters"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Main Content */}
          <section className={`flex-1 px-4 lg:px-0 transition-all duration-300 ease-in-out ${showDesktopSidebar ? "lg:ml-[22%]" : "lg:ml-14"}`}>
            {/* Mobile Filters - Conditionally shown */}
            {showFilters && (
              <div className="lg:hidden mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 animate-fadeIn">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DomainFilters
                  onFilterChange={applyFiltersWithSorting}
                  availableTags={availableTags}
                  currentFilters={activeFilters}
                  onFilterSaved={handleFilterSaved}
                  tldCounts={tldCounts}
                  onCloseSidebar={() => setShowFilters(false)}
                />
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
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

            {/* Desktop rail handles opening; no separate button here */}
            {/* Search & Controls Bar - Hidden on mobile */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search domains by name or keyword..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2   ">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full md:w-60 h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <ArrowUpDown className="h-5 w-5 mr-2" />
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
                {activeFilters.type !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                    {activeFilters.type === "aged" ? "Aged Domains" : "Traffic Domains"}
                    <button
                      onClick={() => removeFilter("type")}
                      className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {activeFilters.isHot && (
                  <Badge variant="destructive" className="flex items-center gap-1 pl-2 pr-1 py-1">
                    <Flame className="h-3 w-3 mr-1" /> Hot Deals
                    <button
                      onClick={() => removeFilter("isHot")}
                      className="ml-1 rounded-full hover:bg-orange-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(activeFilters.type !== "all" || activeFilters.isHot) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-6 text-xs px-2"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>

            {/* Results Info */}
            <div className="mb-6 flex justify-between items-center">
              <div className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">{filteredDomains.length}</span> of{" "}
                <span className="font-medium">{domains.length}</span> domains
                {filteredDomains.length !== domains.length && (
                  <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                    (Filtered from {domains.length} total)
                  </span>
                )}
              </div>

               
            </div>

            {/* Domain Cards */}
            {loading ? (
              <div className={viewMode === "grid"
                ? `grid md:grid-cols-2 ${showDesktopSidebar ? "lg:grid-cols-3" : "lg:grid-cols-3"} gap-6`
                : "space-y-4"
              }>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
                  >
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 w-3/4 mb-4 rounded-lg"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 w-1/2 mb-6 rounded-lg"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 w-2/3 rounded-lg"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 w-5/6 rounded-lg"></div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 w-20 rounded-lg"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 w-24 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDomains.length > 0 ? (
              <div className={viewMode === "grid"
                ? `grid md:grid-cols-2 ${showDesktopSidebar ? "lg:grid-cols-3" : "lg:grid-cols-3"} gap-6`
                : "space-y-4"
              }>
                {filteredDomains.map((domain) => (
                  <DomainCard key={domain._id} domain={domain} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="mb-4 text-gray-400">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No domains found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn't find any domains matching your search criteria. Try adjusting your filters or search query.
                </p>
                <Button onClick={resetFilters} className="px-6">
                  Clear Filters
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile sticky actions */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden mr-16   px-4 py-3 mb-1">
        <div className="max-w-8xl mx-auto flex items-center gap-3">
          <Button className="flex-1 h-12 bg-white dark:bg-black rounded-lg" variant="outline" onClick={openFiltersMobile}>
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
          <Button className="flex-1 h-12 rounded-lg" onClick={() => setShowSortSheet(true)}>
            <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
          </Button>
        </div>
      </div>

      {/* Mobile Sort Dialog */}
      <Dialog open={showSortSheet} onOpenChange={setShowSortSheet}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Sort domains</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto py-2">
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
                className="justify-start h-12 rounded-lg text-left"
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
      <footer ref={footerRef}>
        <Footer />
      </footer>
    </div>
  )
}