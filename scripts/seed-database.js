import { MongoClient } from "mongodb"
 
const MONGODB_URI = process.env.MONGODB_URI  

const sampleDomains = [
  {
    name: "techstartup.com",
    description:
      "Perfect domain for technology startups and innovation companies. Comes with authority and history.",
    price: 15000,
    isAvailable: true,
    isFeatured: true,
    tld: ".com",
    metrics: {
      domainRank: 75,
      referringDomains: 1320,
      authorityLinks: 290,
      avgAuthorityDR: 67,
      monthlyTraffic: 50000,
      year: 5,
      language: "en",
    },
    tags: ["tech", "startup", "innovation"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "digitalmarketing.net",
    description:
      "Established domain in the digital marketing niche with strong metrics.",
    price: 1800,
    isAvailable: true,
    isFeatured: true,
    tld: ".net",
    metrics: {
      domainRank: 62,
      referringDomains: 980,
      authorityLinks: 215,
      avgAuthorityDR: 54,
      monthlyTraffic: 12000,
      year: 6,
      language: "en",
    },
    tags: ["marketing", "digital", "seo"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "healthwellness.com",
    description: "Premium health and wellness domain with strong authority.",
    price: 8000,
    isAvailable: true,
    isFeatured: false,
    tld: ".com",
    metrics: {
      domainRank: 70,
      referringDomains: 620,
      authorityLinks: 175,
      avgAuthorityDR: 61,
      monthlyTraffic: 25000,
      year: 4,
      language: "en",
    },
    tags: ["health", "wellness", "medical"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "financepro.com",
    description: "High-value domain for financial services.",
    price: 20000,
    isAvailable: true,
    isFeatured: true,
    tld: ".com",
    metrics: {
      domainRank: 82,
      referringDomains: 2100,
      authorityLinks: 430,
      avgAuthorityDR: 73,
      monthlyTraffic: 75000,
      year: 8,
      language: "en",
    },
    tags: ["finance", "banking", "investment"],
    category: "Finance",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "educationhub.com",
    description: "Perfect for educational platforms and institutions.",
    price: 6000,
    isAvailable: true,
    isFeatured: false,
    tld: ".com",
    metrics: {
      domainRank: 58,
      referringDomains: 400,
      authorityLinks: 110,
      avgAuthorityDR: 47,
      monthlyTraffic: 20000,
      year: 2,
      language: "en",
    },
    tags: ["education", "learning", "school"],
    category: "Education",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@vettedge.domains",
    role: "admin",
    createdAt: new Date(),
  },
  {
    name: "John Doe",
    email: "john@example.com",
    role: "customer",
    createdAt: new Date(),
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    role: "customer",
    createdAt: new Date(),
  },
]

const sampleBlogs = [
  {
    id: "guide-to-domains",
    title: "How to Choose the Right Domain Name",
    excerpt: "Learn key factors to pick a winning domain name for your brand.",
    content: `
## Tips for Choosing a Domain
- Keep it short and memorable
- Avoid numbers and hyphens
- Stick to .com if possible
- Make it brandable and unique
    `,
    author: "Alice Johnson",
    publishedAt: "2024-03-15",
    category: "Tips",
    tags: ["domains", "branding", "startup"],
    readTime: "4 min read",
  },
  {
    id: "domain-seo-impact",
    title: "How Domains Impact SEO Performance",
    excerpt: "Discover how premium domains help boost SEO and rankings.",
    content: `
## SEO Benefits of Domains
- Exact match keyword boost
- Better backlink profiles
- More click-throughs in SERPs
    `,
    author: "Bob Lee",
    publishedAt: "2024-02-01",
    category: "SEO",
    tags: ["seo", "domains", "rankings"],
    readTime: "6 min read",
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("vettedge")

    // Clear existing data
    await db.collection("domains").deleteMany({})
    await db.collection("users").deleteMany({})
    await db.collection("blogs").deleteMany({})
    console.log("Cleared existing data")

    // Insert sample data
    const domainResult = await db.collection("domains").insertMany(sampleDomains)
    console.log(`Inserted ${domainResult.insertedCount} domains`)

    const userResult = await db.collection("users").insertMany(sampleUsers)
    console.log(`Inserted ${userResult.insertedCount} users`)

    const blogResult = await db.collection("blogs").insertMany(sampleBlogs)
    console.log(`Inserted ${blogResult.insertedCount} blogs`)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
