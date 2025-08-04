import type { ObjectId } from "mongodb"

export interface DomainMetrics {
  domainRank: number
  referringDomains: number
  authorityLinks: number
  avgAuthorityDR: number
  monthlyTraffic: number
  year: number
  language: string
}

export interface Domain {
  _id?: ObjectId
  id?: string
  name: string
  description: string
  price: number
  isAvailable: boolean
  isSold: boolean
  tld: string
  metrics: DomainMetrics
  category?: string
  tags?: string[]
  featured?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id?: ObjectId
  id?: string
  userId: string
  customerEmail: string
  customerName: string
  domains: {
    domainId: string
    domainName: string
    price: number
  }[]
  totalAmount: number
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  paymentMethod: "stripe" | "paypal"
  paymentId?: string
  billingAddress: {
    firstName: string
    lastName: string
    email: string
    company?: string
    address: string
    city: string
    zipCode: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id?: ObjectId
  id?: string
  name: string
  email: string
  role: "admin" | "customer"
  createdAt: Date
  lastLogin?: Date
}
