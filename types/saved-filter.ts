export interface SavedFilter {
  _id: string
  userId: string
  name: string
  filters: {
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
    isHot: boolean
  }
  createdAt: string
  updatedAt: string
}
