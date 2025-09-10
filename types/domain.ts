export interface Domain {
  _id: string
  name: string
  description: string
  price: number
  Actualprice: number
  type: string
  tags: string[]
  image: string[] // Array of image URLs
  isAvailable: boolean
  isSold: boolean
  isHot: boolean
  registrar: string
  metrics: {
    domainRank: number
    referringDomains: number
    authorityLinks: string[] // Array of URLs
    avgAuthorityDR: number
    domainAuthority: number
    score:number
    trustFlow: number
    citationFlow: number
    monthlyTraffic: number | null
    year: number
    age: number
    language: string
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
  isSold: boolean
}
