import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/models/domain"
import { ObjectId } from "mongodb"

export class UserService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<User>("users")
  }

  async createUser(userData: Omit<User, "_id" | "id" | "createdAt">) {
    const collection = await this.getCollection()
    const now = new Date()

    const result = await collection.insertOne({
      ...userData,
      createdAt: now,
    })

    return { ...userData, id: result.insertedId.toString(), createdAt: now }
  }

  async getUserByEmail(email: string) {
    const collection = await this.getCollection()
    const user = await collection.findOne({ email })
    return user ? { ...user, id: user._id?.toString() } : null
  }

  async getUserById(id: string) {
    const collection = await this.getCollection()
    const user = await collection.findOne({ _id: new ObjectId(id) })
    return user ? { ...user, id: user._id?.toString() } : null
  }

  async getAllUsers() {
    const collection = await this.getCollection()
    const users = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return users.map((user) => ({ ...user, id: user._id?.toString() }))
  }

  async updateLastLogin(id: string) {
    const collection = await this.getCollection()
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { lastLogin: new Date() } })
  }

  async getUserStats() {
    const collection = await this.getCollection()
    const stats = await collection
      .aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            adminUsers: {
              $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
            },
            customerUsers: {
              $sum: { $cond: [{ $eq: ["$role", "customer"] }, 1, 0] },
            },
          },
        },
      ])
      .toArray()

    return (
      stats[0] || {
        totalUsers: 0,
        adminUsers: 0,
        customerUsers: 0,
      }
    )
  }
}

export const userService = new UserService()
