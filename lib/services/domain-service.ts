import connectDB from "@/lib/mongodb"
import Domain from "@/lib/models/domain"
import { Types } from "mongoose"

export class DomainService {
  async getAllDomains(filters?: {
    search?: string
    registrar?: string[]
    priceRange?: [number, number]
    availability?: string
    category?: string
  }) {
    await connectDB()
    const query: any = {}

    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
        { tags: { $in: [new RegExp(filters.search, "i")] } },
      ]
    }

    if (filters?.registrar?.length) {
      query.registrar = { $in: filters.registrar }
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

    const domains = await Domain.find(query).sort({ createdAt: -1 })
    return domains.map((d) => d.toObject({ versionKey: false }))
  }

  async getDomainById(id: string) {
    await connectDB()
    const domain = await Domain.findById(id)
    return domain ? domain.toObject({ versionKey: false }) : null
  }

  async createDomain(domainData: Omit<Domain, "_id" | "id" | "createdAt" | "updatedAt">) {
    await connectDB()
    const domain = await Domain.create(domainData)
    return domain.toObject({ versionKey: false })
  }

  async updateDomain(id: string, updates: Partial<Domain>) {
    await connectDB()
    const result = await Domain.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    )
    return result.modifiedCount > 0
  }

  async deleteDomain(id: string) {
    await connectDB()
    const result = await Domain.deleteOne({ _id: new Types.ObjectId(id) })
    return result.deletedCount > 0
  }

  async getFeaturedDomains(limit = 6) {
    await connectDB()
    const domains = await Domain.find({
      featured: true,
      isAvailable: true,
      isSold: false,
    }).limit(limit)
    return domains.map((d) => d.toObject({ versionKey: false }))
  }

  async markAsSold(id: string, orderId: string) {
    await connectDB()
    const result = await Domain.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          isSold: true,
          isAvailable: false,
          soldAt: new Date(),
          orderId,
          updatedAt: new Date(),
        },
      }
    )
    return result.modifiedCount > 0
  }
}

export const domainService = new DomainService()
