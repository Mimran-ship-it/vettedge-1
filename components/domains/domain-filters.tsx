"use client"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input" 
import { Flame } from "lucide-react"
import { set } from "mongoose"
interface ActiveFilters {
  priceRange: [number, number]
  tlds: string[]
  availability: "all" | "available" | "sold"
  type: "all" | "aged" | "traffic"
  domainRankRange: [number, number]
  domainAuthorityRange: [number, number]
  scoresRange?: [number, number] // Optional, in case you want to add it later
  trustFlowRange: [number, number]
  citationFlowRange: [number, number]
  ageMin: number | null
  referringDomainsMin: number | null
  authorityLinksMin: number | null
  monthlyTrafficMin: number | null
  tags: string[]
  isHot: boolean // Changed from "all" | "yes" | "no" to boolean
}
interface DomainFiltersProps {
  onFilterChange: (filters: ActiveFilters) => void
  availableTags: string[]
  currentFilters: ActiveFilters
} 
export function DomainFilters({ onFilterChange, availableTags, currentFilters }: DomainFiltersProps) {
  const searchParams = useSearchParams()
  const firstMount = useRef(true)
  const urlParamsSet = useRef<{ type?: boolean; isHot?: boolean }>({})
  
  const [priceRange, setPriceRange] = useState<[number, number]>(currentFilters.priceRange)
  const [selectedTlds, setSelectedTlds] = useState<string[]>(currentFilters.tlds)
  const [availability, setAvailability] = useState<"all" | "available" | "sold">(currentFilters.availability)
  const [type, setType] = useState<"all" | "aged" | "traffic">(currentFilters.type)
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tags)
  const [domainRankRange, setDomainRankRange] = useState<[number, number]>(currentFilters.domainRankRange)
  const [domainAuthorityRange, setDomainAuthorityRange] = useState<[number, number]>(currentFilters.domainAuthorityRange)
  const [scoresRange, setscoresRange] = useState<[number, number] | undefined>(currentFilters.scoresRange)
  const [trustFlowRange, setTrustFlowRange] = useState<[number, number]>(currentFilters.trustFlowRange)
  const [citationFlowRange, setCitationFlowRange] = useState<[number, number]>(currentFilters.citationFlowRange)
  
  // Changed to allow null values for empty inputs
  const [monthlyTrafficMin, setMonthlyTrafficMin] = useState<number | null>(currentFilters.monthlyTrafficMin)
  const [ageMin, setAgeMin] = useState<number | null>(currentFilters.ageMin)
  const [referringDomainsMin, setReferringDomainsMin] = useState<number | null>(currentFilters.referringDomainsMin)
  const [authorityLinksMin, setAuthorityLinksMin] = useState<number | null>(currentFilters.authorityLinksMin)
  
  const [isHot, setIsHot] = useState<boolean>(currentFilters.isHot) // Changed to boolean
  
  const tlds = [".com", ".net", ".org", ".io", ".co", ".ai"]
  
  // Handle URL parameters on first mount
  useEffect(() => {
    if (!firstMount.current) return
    
    const aged = searchParams?.get('aged') === 'true'
    const traffic = searchParams?.get('traffic') === 'true'
    const isHot = searchParams?.get('isHot') === 'true'
    
    let filtersToApply: Partial<ActiveFilters> = {}
    
    if (aged) {
      setType("aged")
      urlParamsSet.current.type = true
      filtersToApply.type = "aged"
    }
    if (traffic) {
      setType("traffic")
      urlParamsSet.current.type = true
      filtersToApply.type = "traffic"
    }
    if (isHot) {
      setIsHot(true)
      urlParamsSet.current.isHot = true
      filtersToApply.isHot = true
    }
    
    // Apply the filters if any URL parameters were set
    if (Object.keys(filtersToApply).length > 0) {
      applyFilters(filtersToApply)
    }
    
    firstMount.current = false
  }, [searchParams])
  
  // Update state when currentFilters prop changes
  useEffect(() => {
    setPriceRange(currentFilters.priceRange)
    setSelectedTlds(currentFilters.tlds)
    setAvailability(currentFilters.availability)
    // Only update type if not set by URL parameters
    if (!urlParamsSet.current.type) {
      setType(currentFilters.type)
    }
    setSelectedTags(currentFilters.tags)
    setDomainRankRange(currentFilters.domainRankRange)
    setDomainAuthorityRange(currentFilters.domainAuthorityRange)
    setscoresRange(currentFilters.scoresRange)
    setTrustFlowRange(currentFilters.trustFlowRange)
    setCitationFlowRange(currentFilters.citationFlowRange)
    setMonthlyTrafficMin(currentFilters.monthlyTrafficMin)
    setAgeMin(currentFilters.ageMin)
    setReferringDomainsMin(currentFilters.referringDomainsMin)
    setAuthorityLinksMin(currentFilters.authorityLinksMin)
    // Only update isHot if not set by URL parameters
    if (!urlParamsSet.current.isHot) {
      setIsHot(currentFilters.isHot)
    }
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
  
  // Handle availability change with checkboxes
  const handleAvailabilityChange = (value: "all" | "available" | "sold", checked: boolean) => {
    if (checked) {
      setAvailability(value)
      applyFilters({ availability: value })
    }
  }
  
  // Handle type change with checkboxes
  const handleTypeChange = (value: "all" | "aged" | "traffic", checked: boolean) => {
    if (checked) {
      setType(value)
      applyFilters({ type: value })
    }
  }
  
  // Handle hot deal toggle - simplified to directly toggle state
  const handleHotDealToggle = () => {
    const newIsHot = !isHot
    setIsHot(newIsHot)
    applyFilters({ isHot: newIsHot }) // use newIsHot, not isHot
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
      scoresRange,
      trustFlowRange,
      citationFlowRange,
      monthlyTrafficMin,
      ageMin,
      referringDomainsMin,
      authorityLinksMin,
      isHot,
      ...overrides,   // 👈 moved to the bottom
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
      scoresRange: [0,100],
      trustFlowRange: [0, 100],
      citationFlowRange: [0, 100],
      monthlyTrafficMin: null,
      ageMin: null,
      referringDomainsMin: null,
      authorityLinksMin: null,
      isHot: false
    }
    
    setPriceRange(defaultFilterValues.priceRange)
    setSelectedTlds(defaultFilterValues.tlds)
    setAvailability(defaultFilterValues.availability)
    setType(defaultFilterValues.type)
    setSelectedTags(defaultFilterValues.tags)
    setDomainRankRange(defaultFilterValues.domainRankRange)
    setDomainAuthorityRange(defaultFilterValues.domainAuthorityRange)
    setscoresRange(defaultFilterValues.scoresRange)
    setTrustFlowRange(defaultFilterValues.trustFlowRange)
    setCitationFlowRange(defaultFilterValues.citationFlowRange)
    setMonthlyTrafficMin(defaultFilterValues.monthlyTrafficMin)
    setAgeMin(defaultFilterValues.ageMin)
    setReferringDomainsMin(defaultFilterValues.referringDomainsMin)
    setAuthorityLinksMin(defaultFilterValues.authorityLinksMin)
    setIsHot(defaultFilterValues.isHot)
    
    // Reset URL parameter flags
    urlParamsSet.current = {}
    
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
        
        {/* Availability - Converted to Checkboxes */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Availability</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availability-all"
                checked={availability === "all"}
                onCheckedChange={(checked) => handleAvailabilityChange("all", checked as boolean)}
              />
              <Label htmlFor="availability-all" className="text-sm text-gray-600">All domains</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availability-available"
                checked={availability === "available"}
                onCheckedChange={(checked) => handleAvailabilityChange("available", checked as boolean)}
              />
              <Label htmlFor="availability-available" className="text-sm text-gray-600">Available only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availability-sold"
                checked={availability === "sold"}
                onCheckedChange={(checked) => handleAvailabilityChange("sold", checked as boolean)}
              />
              <Label htmlFor="availability-sold" className="text-sm text-gray-600">Sold domains</Label>
            </div>
          </div>
        </div>
        
        {/* Type - Converted to Checkboxes */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Type</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-all"
                checked={type === "all"}
                onCheckedChange={(checked) => handleTypeChange("all", checked as boolean)}
              />
              <Label htmlFor="type-all" className="text-sm text-gray-600">All types</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-aged"
                checked={type === "aged"}
                onCheckedChange={(checked) => handleTypeChange("aged", checked as boolean)}
              />
              <Label htmlFor="type-aged" className="text-sm text-gray-600">Aged Domain</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-traffic"
                checked={type === "traffic"}
                onCheckedChange={(checked) => handleTypeChange("traffic", checked as boolean)}
              />
              <Label htmlFor="type-traffic" className="text-sm text-gray-600">Traffic Domain</Label>
            </div>
          </div>
        </div>
        
        {/* isHot Filter - Converted to Toggle Button */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            Hot Deal
          </Label>
          <div className="flex items-center space-x-2">
            <Button
              variant={isHot ? "default" : "outline"}
              size="sm"
              onClick={handleHotDealToggle}
              className={`flex items-center ${isHot ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            >
              <Flame className="h-4 w-4 mr-1" />
              {isHot ? "On" : "Off"}
            </Button>
            <span className="text-sm text-gray-500">
              {isHot ? "Showing hot deals only" : "Hot deals hidden"}
            </span>
          </div>
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
        <div className="space-y-3">
          <Label className="font-medium text-gray-700">Overall Score (0-100)</Label>
          <Slider
            value={scoresRange}
            onValueChange={(value) => {
              setscoresRange(value as [number, number])
              applyFilters({ scoresRange: value })
            }}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{scoresRange[0]}</span>
            <span>{scoresRange[1]}</span>
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