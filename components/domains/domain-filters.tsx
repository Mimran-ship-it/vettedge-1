"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DomainFiltersProps {
  onFilterChange: (filters: any) => void
}

export function DomainFilters({ onFilterChange }: DomainFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedTlds, setSelectedTlds] = useState<string[]>([])
  const [availability, setAvailability] = useState<string>("all")

  const tlds = [".com", ".net", ".org", ".io", ".co", ".ai"]

  const handleTldChange = (tld: string, checked: boolean) => {
    const newTlds = checked
      ? [...selectedTlds, tld]
      : selectedTlds.filter((t) => t !== tld)
    setSelectedTlds(newTlds)
    applyFilters({ tlds: newTlds })
  }

  const applyFilters = (overrides = {}) => {
    const filters = {
      priceRange,
      tlds: selectedTlds,
      availability,
      ...overrides
    }
    onFilterChange(filters)
  }

  const clearFilters = () => {
    setPriceRange([0, 1000])
    setSelectedTlds([])
    setAvailability("all")
    onFilterChange({
      priceRange: [0, 1000],
      tlds: [],
      availability: "all"
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Price Range</Label>
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              setPriceRange(value)
              applyFilters({ priceRange: value })
            }}
            max={1000}
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
          <Label className="text-sm font-medium">Domain Extension</Label>
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
          <Label className="text-sm font-medium">Availability</Label>
          <Select
            value={availability}
            onValueChange={(value) => {
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
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={clearFilters}>
          Clear All Filters
        </Button>
      </div>
    </div>
  )
}
