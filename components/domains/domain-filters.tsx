"use client"

import { useState } from "react"
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

interface DomainFiltersProps {
  onFilterChange: (filters: any) => void
  availableTags: string[] // ✅ Added
}

export function DomainFilters({ onFilterChange, availableTags }: DomainFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [selectedTlds, setSelectedTlds] = useState<string[]>([])
  const [availability, setAvailability] = useState<"all" | "available" | "sold">("all")
  const [type, setType] = useState<"all" | "aged" | "traffic">("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([]) // ✅ Added

  const [domainRankRange, setDomainRankRange] = useState<[number, number]>([0, 100])
  const [domainAuthorityRange, setDomainAuthorityRange] = useState<[number, number]>([0, 100])
  const [trustFlowRange, setTrustFlowRange] = useState<[number, number]>([0, 100])
  const [citationFlowRange, setCitationFlowRange] = useState<[number, number]>([0, 100])
  const [monthlyTrafficMin, setMonthlyTrafficMin] = useState<number>(0)
  const [ageMin, setAgeMin] = useState<number>(0)
  const [referringDomainsMin, setReferringDomainsMin] = useState<number>(0)
  const [authorityLinksMin, setAuthorityLinksMin] = useState<number>(0)

  const tlds = [".com", ".net", ".org", ".io", ".co", ".ai"]

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
    const filters = {
      priceRange,
      tlds: selectedTlds,
      availability,
      type,
      tags: selectedTags, // ✅ Added
      domainRankRange,
      domainAuthorityRange,
      trustFlowRange,
      citationFlowRange,
      monthlyTrafficMin,
      ageMin,
      referringDomainsMin,
      authorityLinksMin,
      ...overrides,
    }
    onFilterChange(filters)
  }

  const clearFilters = () => {
    setPriceRange([0, 100000])
    setSelectedTlds([])
    setAvailability("all")
    setType("all")
    setSelectedTags([]) // ✅ Added
    setDomainRankRange([0, 100])
    setDomainAuthorityRange([0, 100])
    setTrustFlowRange([0, 100])
    setCitationFlowRange([0, 100])
    setMonthlyTrafficMin(0)
    setAgeMin(0)
    setReferringDomainsMin(0)
    setAuthorityLinksMin(0)

    onFilterChange({
      priceRange: [0, 100000],
      tlds: [],
      availability: "all",
      type: "all",
      tags: [], // ✅ Added
      domainRankRange: [0, 100],
      domainAuthorityRange: [0, 100],
      trustFlowRange: [0, 100],
      citationFlowRange: [0, 100],
      monthlyTrafficMin: 0,
      ageMin: 0,
      referringDomainsMin: 0,
      authorityLinksMin: 0,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              setPriceRange(value as [number, number])
              applyFilters({ priceRange: value })
            }}
            max={100000}
            min={0}
            step={10}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* TLD Filter */}
        <div className="space-y-3">
          <Label>Domain Extension</Label>
          <div className="grid grid-cols-2 gap-2">
            {tlds.map((tld) => (
              <div key={tld} className="flex items-center space-x-2">
                <Checkbox
                  id={tld}
                  checked={selectedTlds.includes(tld)}
                  onCheckedChange={(checked) => handleTldChange(tld, checked as boolean)}
                />
                <Label htmlFor={tld} className="text-sm">{tld}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-3">
          <Label>Availability</Label>
          <Select
            value={availability}
            onValueChange={(value: "all" | "available" | "sold") => {
              setAvailability(value)
              applyFilters({ availability: value })
            }}
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
          <Label>Type</Label>
          <Select
            value={type}
            onValueChange={(value: "all" | "aged" | "traffic") => {
              setType(value)
              applyFilters({ type: value })
            }}
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

        {/* Tags Filter ✅ */}
        <div className="space-y-3">
          <Label>Industry</Label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
            {availableTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                />
                <Label htmlFor={tag} className="text-sm capitalize">{tag}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Rank */}
        <div className="space-y-3">
          <Label>Domain Rank</Label>
          <Slider
            value={domainRankRange}
            onValueChange={(value) => {
              setDomainRankRange(value as [number, number])
              applyFilters({ domainRankRange: value })
            }}
            max={100}
            min={0}
            step={1}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{domainRankRange[0]}</span>
            <span>{domainRankRange[1]}</span>
          </div>
        </div>

         {/* Domain Authority */}
         <div className="space-y-3">
          <Label>Domain Authority</Label>
          <Slider
            value={domainAuthorityRange}
            onValueChange={(value) => {
              setDomainAuthorityRange(value as [number, number])
              applyFilters({ domainAuthorityRange: value })
            }}
            max={100}
            min={0}
            step={1}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{domainAuthorityRange[0]}</span>
            <span>{domainAuthorityRange[1]}</span>
          </div>
        </div>

        {/* Trust Flow */}
        <div className="space-y-3">
          <Label>Trust Flow</Label>
          <Slider
            value={trustFlowRange}
            onValueChange={(value) => {
              setTrustFlowRange(value as [number, number])
              applyFilters({ trustFlowRange: value })
            }}
            max={100}
            min={0}
            step={1}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{trustFlowRange[0]}</span>
            <span>{trustFlowRange[1]}</span>
          </div>
        </div>

        {/* Citation Flow */}
        <div className="space-y-3">
          <Label>Citation Flow</Label>
          <Slider
            value={citationFlowRange}
            onValueChange={(value) => {
              setCitationFlowRange(value as [number, number])
              applyFilters({ citationFlowRange: value })
            }}
            max={100}
            min={0}
            step={1}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{citationFlowRange[0]}</span>
            <span>{citationFlowRange[1]}</span>
          </div>
        </div>

        {/* Monthly Traffic */}
        <div className="space-y-3">
          <Label>Monthly Traffic (min)</Label>
          <Input
            type="number"
            value={monthlyTrafficMin}
            onChange={(e) => {
              const value = Number(e.target.value)
              setMonthlyTrafficMin(value)
              applyFilters({ monthlyTrafficMin: value })
            }}
            min={0}
          />
        </div>

        {/* Age */}
        <div className="space-y-3">
          <Label>Age (min, years)</Label>
          <Input
            type="number"
            value={ageMin}
            onChange={(e) => {
              const value = Number(e.target.value)
              setAgeMin(value)
              applyFilters({ ageMin: value })
            }}
            min={0}
          />
        </div>

        {/* Referring Domains */}
        <div className="space-y-3">
          <Label>Referring Domains (min)</Label>
          <Input
            type="number"
            value={referringDomainsMin}
            onChange={(e) => {
              const value = Number(e.target.value)
              setReferringDomainsMin(value)
              applyFilters({ referringDomainsMin: value })
            }}
            min={0}
          />
        </div>

        {/* Authority Links */}
        <div className="space-y-3">
          <Label>Authority Links (min)</Label>
          <Input
            type="number"
            value={authorityLinksMin}
            onChange={(e) => {
              const value = Number(e.target.value)
              setAuthorityLinksMin(value)
              applyFilters({ authorityLinksMin: value })
            }}
            min={0}
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  )
}

