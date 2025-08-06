// lib/mongodb.ts
import mongoose from "mongoose"

const uri = process.env.MONGODB_URI!
const dbName = "vettedge"

if (!uri) {
  throw new Error("❌ Please define the MONGODB_URI environment variable in .env.local")
}

let isConnected = false // To avoid re-connecting in dev mode

export default async function connectDB() {
  if (isConnected) return

  try {
    await mongoose.connect(uri, {
      dbName,
    })
    isConnected = true
    console.log("✅ Connected to MongoDB via Mongoose")
  } catch (error) {
    console.error("❌ Mongoose connection error:", error)
    throw error
  }
}
