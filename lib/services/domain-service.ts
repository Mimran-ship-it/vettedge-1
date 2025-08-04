import { getDatabase } from "@/lib/mongodb"
import type { Domain } from "@/lib/models/domain"
import { ObjectId } from "mongodb"

export class DomainService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<Domain>("domains")
  }

  async getAllDomains(filters?: {
    search?: string
    tlds?: string[]
    priceRange?: [number, number]
    availability?: string
    category?: string
  }) {
    const collection = await this.getCollection()
    const query: any = {}

    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
        { tags: { $in: [new RegExp(filters.search, "i")] } },
      ]
    }

    if (filters?.tlds && filters.tlds.length > 0) {
      query.tld = { $in: filters.tlds }
    }

    if (filters?.priceRange) {
      query.price = { $gte: filters.priceRange[0], $lte: filters.priceRange[1] }
    }

    if (filters?.availability === "available") {
      query.isAvailable = true
      query.isSold = false
    } else if (filters?.availability === "sold") {
      query.isSold = true
    }

    if (filters?.category) {
      query.category = filters.category
    }

    const domains = await collection.find(query).sort({ createdAt: -1 }).toArray()
    return domains.map((domain) => ({ ...domain, id: domain._id?.toString() }))
  }

  async getDomainById(id: string) {
    const collection = await this.getCollection()
    const domain = await collection.findOne({ _id: new ObjectId(id) })
    return domain ? { ...domain, id: domain._id?.toString() } : null
  }

  async createDomain(domainData: Omit<Domain, "_id" | "id" | "createdAt" | "updatedAt">) {
    const collection = await this.getCollection()
    const now = new Date()

    const result = await collection.insertOne({
      ...domainData,
      createdAt: now,
      updatedAt: now,
    })

    return { ...domainData, id: result.insertedId.toString(), createdAt: now, updatedAt: now }
  }

  async updateDomain(id: string, updates: Partial<Domain>) {
    const collection = await this.getCollection()
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
    )
    return result.modifiedCount > 0
  }

  async deleteDomain(id: string) {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async getFeaturedDomains(limit = 6) {
    const collection = await this.getCollection()
    const domains = await collection.find({ featured: true, isAvailable: true, isSold: false }).limit(limit).toArray()
    return domains.map((domain) => ({ ...domain, id: domain._id?.toString() }))
  }

  async markAsSold(id: string, orderId: string) {
    const collection = await this.getCollection()
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isSold: true,
          isAvailable: false,
          soldAt: new Date(),
          orderId,
          updatedAt: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  }
}

export const domainService = new DomainService()
