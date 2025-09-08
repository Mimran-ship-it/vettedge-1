"use client"
import { useState, useEffect, useLayoutEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Flame } from "lucide-react"

interface ActiveFilters {
  priceRange: [number, number]
  tlds: string[]
  availability: "all" | "available" | "sold"
  type: "all" | "aged" | "traffic"
  domainRankRange: [number, number]
  domainAuthorityRange: [number, number]
  trustFlowRange: [number, number]
  citationFlowRange: [number, number]
  ageMin: number | null
  referringDomainsMin: number | null
  authorityLinksMin: number | null
  monthlyTrafficMin: number | null
  tags: string[]
  isHot: "all" | "yes" | "no"
}

interface DomainFiltersProps {
  onFilterChange: (filters: ActiveFilters) => void
  availableTags: string[]
  currentFilters: ActiveFilters
} 

export function DomainFilters({ onFilterChange, availableTags, currentFilters }: DomainFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(currentFilters.priceRange)
  const [selectedTlds, setSelectedTlds] = useState<string[]>(currentFilters.tlds)
  const [availability, setAvailability] = useState<"all" | "available" | "sold">(currentFilters.availability)
  const [type, setType] = useState<"all" | "aged" | "traffic">(currentFilters.type)
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tags)
  const [domainRankRange, setDomainRankRange] = useState<[number, number]>(currentFilters.domainRankRange)
  const [domainAuthorityRange, setDomainAuthorityRange] = useState<[number, number]>(currentFilters.domainAuthorityRange)
  const [trustFlowRange, setTrustFlowRange] = useState<[number, number]>(currentFilters.trustFlowRange)
  const [citationFlowRange, setCitationFlowRange] = useState<[number, number]>(currentFilters.citationFlowRange)
  
  // Changed to allow null values for empty inputs
  const [monthlyTrafficMin, setMonthlyTrafficMin] = useState<number | null>(currentFilters.monthlyTrafficMin)
  const [ageMin, setAgeMin] = useState<number | null>(currentFilters.ageMin)
  const [referringDomainsMin, setReferringDomainsMin] = useState<number | null>(currentFilters.referringDomainsMin)
  const [authorityLinksMin, setAuthorityLinksMin] = useState<number | null>(currentFilters.authorityLinksMin)
  
  const [isHot, setIsHot] = useState<"all" | "yes" | "no">(currentFilters.isHot)
  
  const tlds = [".com", ".net", ".org", ".io", ".co", ".ai"]
  const scrollPositionRef = useRef(0)
  const originalBodyStyleRef = useRef({
    overflow: '',
    position: '',
    top: '',
    width: ''
  })
  
  // Improved scroll prevention using Radix's onOpenChange
  const handleSelectOpenChange = (open: boolean) => {
    if (open) {
      scrollPositionRef.current = window.scrollY
      originalBodyStyleRef.current = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
      }
  
      // ✅ Only hide overflow, don’t fix body
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = originalBodyStyleRef.current.overflow
  
      // ✅ Restore scroll manually
      window.scrollTo(0, scrollPositionRef.current)
    }
  }
  
  
// Cleanup on unmount (useLayoutEffect prevents jumps in production)
useLayoutEffect(() => {
  return () => {
    document.body.style.overflow = originalBodyStyleRef.current.overflow
    document.body.style.position = originalBodyStyleRef.current.position
    document.body.style.top = originalBodyStyleRef.current.top
    document.body.style.width = originalBodyStyleRef.current.width
  }
}, [])

  // Update state when currentFilters prop changes
  useEffect(() => {
    setPriceRange(currentFilters.priceRange)
    setSelectedTlds(currentFilters.tlds)
    setAvailability(currentFilters.availability)
    setType(currentFilters.type)
    setSelectedTags(currentFilters.tags)
    setDomainRankRange(currentFilters.domainRankRange)
    setDomainAuthorityRange(currentFilters.domainAuthorityRange)
    setTrustFlowRange(currentFilters.trustFlowRange)
    setCitationFlowRange(currentFilters.citationFlowRange)
    setMonthlyTrafficMin(currentFilters.monthlyTrafficMin)
    setAgeMin(currentFilters.ageMin)
    setReferringDomainsMin(currentFilters.referringDomainsMin)
    setAuthorityLinksMin(currentFilters.authorityLinksMin)
    setIsHot(currentFilters.isHot)
  }, [currentFilters])
  
  const handleTldChange = (tld: string, checked: boolean) => {
    const newTlds = checked
      ? [...selectedTlds, tld]
      : selectedTlds.filter((t) => t !== tld)
    setSelectedTlds(newTlds)
    applyFilters({ tlds: newTlds })
  }
  
  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag)
    setSelectedTags(newTags)
    applyFilters({ tags: newTags })
  }
  
  const applyFilters = (overrides = {}) => {
    const filters: ActiveFilters = {
      priceRange,
      tlds: selectedTlds,
      availability,
      type,
      tags: selectedTags,
      domainRankRange,
      domainAuthorityRange,
      trustFlowRange,
      citationFlowRange,
      monthlyTrafficMin,
      ageMin,
      referringDomainsMin,
      authorityLinksMin,
      isHot,
      ...overrides,
    }
    onFilterChange(filters)
  }
  
  const clearFilters = () => {
    const defaultFilterValues: ActiveFilters = {
      priceRange: [0, 100000],
      tlds: [],
      availability: "all",
      type: "all",
      tags: [],
      domainRankRange: [0, 100],
      domainAuthorityRange: [0, 100],
      trustFlowRange: [0, 100],
      citationFlowRange: [0, 100],
      monthlyTrafficMin: null,
      ageMin: null,
      referringDomainsMin: null,
      authorityLinksMin: null,
      isHot: "all"
    }
    
    setPriceRange(defaultFilterValues.priceRange)
    setSelectedTlds(defaultFilterValues.tlds)
    setAvailability(defaultFilterValues.availability)
    setType(defaultFilterValues.type)
    setSelectedTags(defaultFilterValues.tags)
    setDomainRankRange(defaultFilterValues.domainRankRange)
    setDomainAuthorityRange(defaultFilterValues.domainAuthorityRange)
    setTrustFlowRange(defaultFilterValues.trustFlowRange)
    setCitationFlowRange(defaultFilterValues.citationFlowRange)
    setMonthlyTrafficMin(defaultFilterValues.monthlyTrafficMin)
    setAgeMin(defaultFilterValues.ageMin)
    setReferringDomainsMin(defaultFilterValues.referringDomainsMin)
    setAuthorityLinksMin(defaultFilterValues.authorityLinksMin)
    setIsHot(defaultFilterValues.isHot)
    
    onFilterChange(defaultFilterValues)
  }
  
  // Helper function to handle numeric input changes
  const handleNumericInputChange = (
    value: string, 
    setter: (value: number | null) => void,
    filterKey: keyof ActiveFilters
  ) => {
    if (value === '') {
      setter(null)
      applyFilters({ [filterKey]: null })
    } else {
      const numValue = Number(value)
      if (!isNaN(numValue)) {
        setter(numValue)
        applyFilters({ [filterKey]: numValue })
      }
    }
  }
   
  // Special handler for monthly traffic that also affects domain type
  const handleMonthlyTrafficChange = (value: string) => {
    if (value === '') {
      setMonthlyTrafficMin(null)
      // When null, show all domains (including aged)
      if (type === "traffic") {
        setType("all")
        applyFilters({ monthlyTrafficMin: null, type: "all" })
      } else {
        applyFilters({ monthlyTrafficMin: null })
      }
    } else {
      const numValue = Number(value)
      if (!isNaN(numValue)) {
        setMonthlyTrafficMin(numValue)
        // If value is greater than 0, filter out aged domains
        if (numValue > 0) {
          setType("traffic")
          applyFilters({ monthlyTrafficMin: numValue, type: "traffic" })
        } else {
          // If value is 0, show all domains (including aged)
          if (type === "traffic") {
            setType("all")
            applyFilters({ monthlyTrafficMin: numValue, type: "all" })
          } else {
            applyFilters({ monthlyTrafficMin: numValue })
          }
        }
      }
    }
  }
   
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Price Range</Label>
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              setPriceRange(value as [number, number])
              applyFilters({ priceRange: value })
            }}
            max={100000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
        
        {/* TLD Filter */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Domain Extension</Label>
          <div className="grid grid-cols-2 gap-2">
            {tlds.map((tld) => (
              <div key={tld} className="flex items-center space-x-2">
                <Checkbox
                  id={tld}
                  checked={selectedTlds.includes(tld)}
                  onCheckedChange={(checked) => handleTldChange(tld, checked as boolean)}
                />
                <Label htmlFor={tld} className="text-sm text-gray-600">{tld}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Availability */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Availability</Label>
          <Select
            value={availability}
            onValueChange={(value: "all" | "available" | "sold") => {
              setAvailability(value)
              applyFilters({ availability: value })
            }}
            onOpenChange={handleSelectOpenChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All domains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All domains</SelectItem>
              <SelectItem value="available">Available only</SelectItem>
              <SelectItem value="sold">Sold domains</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Type */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Type</Label>
          <Select
            value={type}
            onValueChange={(value: "all" | "aged" | "traffic") => {
              setType(value)
              applyFilters({ type: value })
            }}
            onOpenChange={handleSelectOpenChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="aged">Aged Domain</SelectItem>
              <SelectItem value="traffic">Traffic Domain</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* isHot Filter */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            Hot Deal
          </Label>
          <Select
            value={isHot}
            onValueChange={(value: "all" | "yes" | "no") => {
              setIsHot(value)
              applyFilters({ isHot: value })
            }}
            onOpenChange={handleSelectOpenChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All domains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All domains</SelectItem>
              <SelectItem value="yes">Hot deals only</SelectItem>
              <SelectItem value="no">Exclude hot deals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Tags Filter */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Industry</Label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
            {availableTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                />
                <Label htmlFor={tag} className="text-sm text-gray-600 capitalize">{tag}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Domain Rank */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Domain Rank (0-100)</Label>
          <Slider
            value={domainRankRange}
            onValueChange={(value) => {
              setDomainRankRange(value as [number, number])
              applyFilters({ domainRankRange: value })
            }}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{domainRankRange[0]}</span>
            <span>{domainRankRange[1]}</span>
          </div>
        </div>
        
        {/* Domain Authority */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Domain Authority (0-100)</Label>
          <Slider
            value={domainAuthorityRange}
            onValueChange={(value) => {
              setDomainAuthorityRange(value as [number, number])
              applyFilters({ domainAuthorityRange: value })
            }}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{domainAuthorityRange[0]}</span>
            <span>{domainAuthorityRange[1]}</span>
          </div>
        </div>
        
        {/* Trust Flow */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Trust Flow (0-100)</Label>
          <Slider
            value={trustFlowRange}
            onValueChange={(value) => {
              setTrustFlowRange(value as [number, number])
              applyFilters({ trustFlowRange: value })
            }}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{trustFlowRange[0]}</span>
            <span>{trustFlowRange[1]}</span>
          </div>
        </div>
        
        {/* Citation Flow */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Citation Flow (0-100)</Label>
          <Slider
            value={citationFlowRange}
            onValueChange={(value) => {
              setCitationFlowRange(value as [number, number])
              applyFilters({ citationFlowRange: value })
            }}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{citationFlowRange[0]}</span>
            <span>{citationFlowRange[1]}</span>
          </div>
        </div>
        
        {/* Monthly Traffic */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Monthly Traffic (min)</Label>
          <Input
            type="number"
            value={monthlyTrafficMin === null ? '' : monthlyTrafficMin}
            onChange={(e) => handleMonthlyTrafficChange(e.target.value)}
            min={0}
            placeholder="Any"
            className="w-full"
          />
        </div>
        
        {/* Age */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Age (min, years)</Label>
          <Input
            type="number"
            value={ageMin === null ? '' : ageMin}
            onChange={(e) => handleNumericInputChange(e.target.value, setAgeMin, 'ageMin')}
            min={0}
            placeholder="Any"
            className="w-full"
          />
        </div>
        
        {/* Referring Domains */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Referring Domains (min)</Label>
          <Input
            type="number"
            value={referringDomainsMin === null ? '' : referringDomainsMin}
            onChange={(e) => handleNumericInputChange(e.target.value, setReferringDomainsMin, 'referringDomainsMin')}
            min={0}
            placeholder="Any"
            className="w-full"
          />
        </div>
        
        {/* Authority Links */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Authority Links (min)</Label>
          <Input
            type="number"
            value={authorityLinksMin === null ? '' : authorityLinksMin}
            onChange={(e) => handleNumericInputChange(e.target.value, setAuthorityLinksMin, 'authorityLinksMin')}
            min={0}
            placeholder="Any"
            className="w-full"
          />
        </div>
      </div>
      
      {/* Clear Filters Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={clearFilters} className="px-6">
          Clear All Filters
        </Button>
      </div>
    </div>
  )
} 