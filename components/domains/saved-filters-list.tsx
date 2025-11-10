"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Star, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import type { SavedFilter } from "@/types/saved-filter"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SavedFiltersListProps {
  onApplyFilter: (filters: SavedFilter["filters"]) => void
  currentFilters?: SavedFilter["filters"]
  refreshTrigger?: number // Add trigger to force refresh
}

export function SavedFiltersList({ onApplyFilter, currentFilters, refreshTrigger }: SavedFiltersListProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchSavedFilters()
    } else {
      setLoading(false)
    }
  }, [user, refreshTrigger])

  const fetchSavedFilters = async () => {
    try {
      const res = await fetch("/api/saved-filters")
      if (res.ok) {
        const data = await res.json()
        setSavedFilters(data)
      } else if (res.status === 401) {
        // User not authenticated, silently handle
        setSavedFilters([])
      }
    } catch (error) {
      console.error("Error fetching saved filters:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/saved-filters/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setSavedFilters((prev) => prev.filter((f) => f._id !== id))
        toast({
          title: "Filter Deleted",
          description: "Saved filter has been removed.",
        })
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete saved filter.",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const getFilterSummary = (filters: SavedFilter["filters"]) => {
    const summary: string[] = []
    
    if (filters.type !== "all") {
      summary.push(filters.type === "aged" ? "Aged" : "Traffic")
    }
    if (filters.isHot) {
      summary.push("Hot Deals")
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) {
      summary.push(`$${filters.priceRange[0]}-$${filters.priceRange[1]}`)
    }
    if (filters.tags.length > 0) {
      summary.push(`${filters.tags.length} tag${filters.tags.length > 1 ? 's' : ''}`)
    }
    if (filters.ageMin && filters.ageMin > 0) {
      summary.push(`Age: ${filters.ageMin}+ yrs`)
    }
    
    return summary.length > 0 ? summary.join(" • ") : "Custom filters"
  }

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <Filter className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to save and manage your custom filters
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (savedFilters.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <Star className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            No saved filters yet
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Apply filters and click "Save Current Filters" to save them
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4" />
            Saved Filters
          </CardTitle>
          <CardDescription className="text-xs">
            Click to apply your saved filter presets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="sm:space-x-4 space-y-2 flex flex-col">
            {savedFilters.map((filter) => (
              <div
                key={filter._id}
                className="group flex w-fit items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer"
                onClick={() => onApplyFilter(filter.filters)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {filter.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {getFilterSummary(filter.filters)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="sm:opacity-0  sm:group-hover:opacity-100 transition-opacity ml-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteId(filter._id)
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Saved Filter?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your saved filter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
