export interface Domain {
  id: string
  name: string
  description: string
  price: number
  isAvailable: boolean
  isSold: boolean
  tld: string
  metrics: {
    domainRank: number
    referringDomains: number
    authorityLinks: number
    avgAuthorityDR: number
    monthlyTraffic: number
    year: number
    language: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  domain?: Domain
}
