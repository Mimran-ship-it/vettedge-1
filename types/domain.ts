export interface Domain{
  _id: string
  name: string
  description: string
  price: number
  tld: string
  type: string
  tags: string[]
  image: string // URL as a string
  isAvailable: boolean
  isSold: boolean
  isHot: boolean
  metrics: {
    domainRank: number
    referringDomains: number
    authorityLinks: number
    avgAuthorityDR: number
    domainAuthority: number
    trustFlow: number
    citationFlow: number
    monthlyTraffic: number
    year: number
    language: string
    age: number
  }
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  domain?: Domain
}
