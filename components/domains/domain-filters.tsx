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
  
  const [monthlyTrafficMin, setMonthlyTrafficMin] = useState<number | null>(currentFilters.monthlyTrafficMin)
  const [ageMin, setAgeMin] = useState<number | null>(currentFilters.ageMin)
  const [referringDomainsMin, setReferringDomainsMin] = useState<number | null>(currentFilters.referringDomainsMin)
  const [authorityLinksMin, setAuthorityLinksMin] = useState<number | null>(currentFilters.authorityLinksMin)
  
  const [isHot, setIsHot] = useState<boolean>(currentFilters.isHot)
  
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
  
  const handleAvailabilityChange = (value: "all" | "available" | "sold", checked: boolean) => {
    if (checked) {
      setAvailability(value)
      applyFilters({ availability: value })
    }
  }
  
  const handleTypeChange = (value: "all" | "aged" | "traffic", checked: boolean) => {
    if (checked) {
      setType(value)
      applyFilters({ type: value })
    }
  }
  
  const handleHotDealToggle = () => {
    const newIsHot = !isHot
    setIsHot(newIsHot)
    applyFilters({ isHot: newIsHot })
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
    
    urlParamsSet.current = {}
    
    onFilterChange(defaultFilterValues)
  }
  
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
   
  const handleMonthlyTrafficChange = (value: string) => {
    if (value === '') {
      setMonthlyTrafficMin(null)
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
        if (numValue > 0) {
          setType("traffic")
          applyFilters({ monthlyTrafficMin: numValue, type: "traffic" })
        } else {
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
    <div className="space-y-6 dark:bg-gray-900 dark:text-gray-100 p-4 rounded-lg">
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Price Range</Label>
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
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
        
        {/* TLD Filter */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Domain Extension</Label>
          <div className="grid grid-cols-2 gap-2 dark:bg-gray-800 p-2 rounded-md">
            {tlds.map((tld) => (
              <div key={tld} className="flex items-center space-x-2">
                <Checkbox
                  id={tld}
                  checked={selectedTlds.includes(tld)}
                  onCheckedChange={(checked) => handleTldChange(tld, checked as boolean)}
                  className="dark:border-gray-600 dark:bg-gray-700"
                />
                <Label htmlFor={tld} className="text-sm text-gray-600 dark:text-gray-300">{tld}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Availability */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Availability</Label>
          <div className="space-y-2 dark:bg-gray-800 p-2 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availability-all"
                checked={availability === "all"}
                onCheckedChange={(checked) => handleAvailabilityChange("all", checked as boolean)}
                className="dark:border-gray-600 dark:bg-gray-700"
              />
              <Label htmlFor="availability-all" className="text-sm text-gray-600 dark:text-gray-300">All domains</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availability-available"
                checked={availability === "available"}
                onCheckedChange={(checked) => handleAvailabilityChange("available", checked as boolean)}
                className="dark:border-gray-600 dark:bg-gray-700"
              />
              <Label htmlFor="availability-available" className="text-sm text-gray-600 dark:text-gray-300">Available only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availability-sold"
                checked={availability === "sold"}
                onCheckedChange={(checked) => handleAvailabilityChange("sold", checked as boolean)}
                className="dark:border-gray-600 dark:bg-gray-700"
              />
              <Label htmlFor="availability-sold" className="text-sm text-gray-600 dark:text-gray-300">Sold domains</Label>
            </div>
          </div>
        </div>
        
        {/* Type */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Type</Label>
          <div className="space-y-2 dark:bg-gray-800 p-2 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-all"
                checked={type === "all"}
                onCheckedChange={(checked) => handleTypeChange("all", checked as boolean)}
                className="dark:border-gray-600 dark:bg-gray-700"
              />
              <Label htmlFor="type-all" className="text-sm text-gray-600 dark:text-gray-300">All types</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-aged"
                checked={type === "aged"}
                onCheckedChange={(checked) => handleTypeChange("aged", checked as boolean)}
                className="dark:border-gray-600 dark:bg-gray-700"
              />
              <Label htmlFor="type-aged" className="text-sm text-gray-600 dark:text-gray-300">Aged Domain</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-traffic"
                checked={type === "traffic"}
                onCheckedChange={(checked) => handleTypeChange("traffic", checked as boolean)}
                className="dark:border-gray-600 dark:bg-gray-700"
              />
              <Label htmlFor="type-traffic" className="text-sm text-gray-600 dark:text-gray-300">Traffic Domain</Label>
            </div>
          </div>
        </div>
        
        {/* isHot Filter */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            Hot Deal
          </Label>
          <div className="flex items-center space-x-2 dark:bg-gray-800 p-2 rounded-md">
            <Button
              variant={isHot ? "default" : "outline"}
              size="sm"
              onClick={handleHotDealToggle}
              className={`flex items-center ${isHot ? "bg-orange-500 hover:bg-orange-600" : "dark:border-gray-600 dark:text-gray-300"}`}
            >
              <Flame className="h-4 w-4 mr-1" />
              {isHot ? "On" : "Off"}
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isHot ? "Showing hot deals only" : "Hot deals hidden"}
            </span>
          </div>
        </div>
        
        {/* Tags Filter */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Industry</Label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2 dark:bg-gray-800 dark:border-gray-700">
            {availableTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                  className="dark:border-gray-600 dark:bg-gray-700"
                />
                <Label htmlFor={tag} className="text-sm text-gray-600 dark:text-gray-300 capitalize">{tag}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Domain Rank */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Domain Rank (0-100)</Label>
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
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{domainRankRange[0]}</span>
            <span>{domainRankRange[1]}</span>
          </div>
        </div>
        
        {/* Domain Authority */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Domain Authority (0-100)</Label>
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
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{domainAuthorityRange[0]}</span>
            <span>{domainAuthorityRange[1]}</span>
          </div>
        </div>
        
        {/* Overall Score */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Overall Score (0-100)</Label>
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
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{scoresRange?.[0]}</span>
            <span>{scoresRange?.[1]}</span>
          </div>
        </div>
        
        {/* Trust Flow */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Trust Flow (0-100)</Label>
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
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{trustFlowRange[0]}</span>
            <span>{trustFlowRange[1]}</span>
          </div>
        </div>
        
        {/* Citation Flow */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Citation Flow (0-100)</Label>
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
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{citationFlowRange[0]}</span>
            <span>{citationFlowRange[1]}</span>
          </div>
        </div>
        
        {/* Monthly Traffic */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Monthly Traffic (min)</Label>
          <Input
            type="number"
            value={monthlyTrafficMin === null ? '' : monthlyTrafficMin}
            onChange={(e) => handleMonthlyTrafficChange(e.target.value)}
            min={0}
            placeholder="Any"
            className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        {/* Age */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Age (min, years)</Label>
          <Input
            type="number"
            value={ageMin === null ? '' : ageMin}
            onChange={(e) => handleNumericInputChange(e.target.value, setAgeMin, 'ageMin')}
            min={0}
            placeholder="Any"
            className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        {/* Referring Domains */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Referring Domains (min)</Label>
          <Input
            type="number"
            value={referringDomainsMin === null ? '' : referringDomainsMin}
            onChange={(e) => handleNumericInputChange(e.target.value, setReferringDomainsMin, 'referringDomainsMin')}
            min={0}
            placeholder="Any"
            className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        {/* Authority Links */}
        <div className="space-y-3">
          <Label className="font-medium text-gray-700 dark:text-gray-300">Authority Links (min)</Label>
          <Input
            type="number"
            value={authorityLinksMin === null ? '' : authorityLinksMin}
            onChange={(e) => handleNumericInputChange(e.target.value, setAuthorityLinksMin, 'authorityLinksMin')}
            min={0}
            placeholder="Any"
            className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>
      
      {/* Clear Filters Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={clearFilters} className="px-6 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
          Clear All Filters
        </Button>
      </div>
    </div>
  )
}