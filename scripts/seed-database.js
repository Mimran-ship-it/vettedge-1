import { MongoClient } from "mongodb"

const uri =
  "mongodb+srv://ibrahimbajwa381:ABib381381@cluster1.londc75.mongodb.net/vettedge?retryWrites=true&w=majority&appName=Cluster1"

const MONGODB_URI = process.env.MONGODB_URI || uri

const sampleDomains = [
  {
    name: "techstartup.com",
    description:
      "Perfect domain for technology startups and innovation companies. This premium domain has been carefully vetted and comes with an established backlink profile and proven SEO authority.",
    price: 15000,
    isAvailable: true,
    isFeatured: true,
    metrics: {
      traffic: 50000,
      backlinks: 1200,
      domainAge: 5,
    },
    tags: ["tech", "startup", "innovation"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "digitalmarketing.net",
    description: "Established domain in the digital marketing niche with strong SEO metrics and clean history.",
    price: 1800,
    isAvailable: true,
    isFeatured: true,
    metrics: {
      traffic: 12000,
      backlinks: 980,
      domainAge: 6,
    },
    tags: ["marketing", "digital", "seo", "advertising"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "healthwellness.com",
    description:
      "Premium health and wellness domain with strong backlink profile and established authority in the health niche.",
    price: 8000,
    isAvailable: true,
    isFeatured: false,
    metrics: {
      traffic: 25000,
      backlinks: 600,
      domainAge: 4,
    },
    tags: ["health", "wellness", "medical"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "financialadvice.net",
    description: "Authoritative domain in the financial services sector with proven traffic and clean history.",
    price: 3800,
    isAvailable: true,
    isFeatured: true,
    metrics: {
      traffic: 28000,
      backlinks: 1890,
      domainAge: 9,
    },
    tags: ["finance", "investment", "advice", "money"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "ecommercesolutions.org",
    description: "Premium domain for e-commerce and online retail businesses with established authority.",
    price: 3200,
    isAvailable: false,
    isFeatured: false,
    metrics: {
      traffic: 22000,
      backlinks: 1580,
      domainAge: 8,
    },
    tags: ["ecommerce", "retail", "online", "shopping"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "travelguide.org",
    description: "Established travel and tourism domain with global reach and strong SEO metrics.",
    price: 2200,
    isAvailable: true,
    isFeatured: false,
    metrics: {
      traffic: 18000,
      backlinks: 1100,
      domainAge: 7,
    },
    tags: ["travel", "tourism", "guide", "vacation"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "ecommercepro.com",
    price: 12000,
    category: "E-commerce",
    description: "Ideal for professional e-commerce businesses",
    isAvailable: true,
    isFeatured: true,
    metrics: {
      traffic: 35000,
      backlinks: 800,
      domainAge: 3,
    },
    tags: ["ecommerce", "business", "retail"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "financepro.com",
    price: 20000,
    category: "Finance",
    description: "High-value domain for financial services",
    isAvailable: true,
    isFeatured: true,
    metrics: {
      traffic: 75000,
      backlinks: 2000,
      domainAge: 8,
    },
    tags: ["finance", "banking", "investment"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "educationhub.com",
    price: 6000,
    category: "Education",
    description: "Perfect for educational platforms and institutions",
    isAvailable: true,
    isFeatured: false,
    metrics: {
      traffic: 20000,
      backlinks: 400,
      domainAge: 2,
    },
    tags: ["education", "learning", "school"],
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
    id: "domain-valuation-guide",
    title: "The Complete Guide to Domain Valuation in 2024",
    excerpt:
      "Learn how to properly value domains using traffic, backlinks, brandability, and market trends. Our comprehensive guide covers all the factors that determine domain worth.",
    content: `
# The Complete Guide to Domain Valuation in 2024

Domain valuation is both an art and a science. Understanding how to properly assess the value of a domain name is crucial for both buyers and sellers in the digital marketplace.

## Key Factors in Domain Valuation

### 1. Traffic Metrics
The amount of organic traffic a domain receives is one of the most important factors in determining its value. Domains with consistent, high-quality traffic are typically worth more.

### 2. Backlink Profile
A strong backlink profile from authoritative websites significantly increases a domain's value. Quality matters more than quantity when it comes to backlinks.

### 3. Domain Age
Older domains often carry more authority and trust with search engines, making them more valuable in most cases.

### 4. Brandability
Short, memorable, and brandable domain names command premium prices. The easier it is to remember and type, the more valuable it becomes.

### 5. Extension
.com domains are generally the most valuable, followed by other popular extensions like .net, .org, and country-specific TLDs.

## Valuation Methods

### Comparable Sales
Look at recent sales of similar domains to gauge market value. This is often the most reliable method for valuation.

### Revenue Multiple
For domains generating revenue, apply a multiple based on annual earnings. Typical multiples range from 1x to 3x annual revenue.

### Cost Per Click Analysis
Analyze the cost per click for keywords related to the domain to estimate potential advertising value.

## Tools for Domain Valuation

- GoDaddy Domain Appraisal
- Estibot
- NameBio (for comparable sales data)
- SEMrush (for traffic analysis)
- Ahrefs (for backlink analysis)

## Conclusion

Domain valuation requires considering multiple factors and using various methods to arrive at a fair market value. Always remember that a domain is ultimately worth what someone is willing to pay for it.
    `,
    author: "Sarah Johnson",
    publishedAt: "2024-01-15",
    category: "Domain Valuation",
    tags: ["valuation", "domains", "investment"],
    readTime: "8 min read",
  },
  {
    id: "premium-domain-investment",
    title: "Why Premium Domains Are the Best Investment in 2024",
    excerpt:
      "Discover why premium domains continue to outperform traditional investments. From scarcity to digital transformation trends, learn what makes domains valuable assets.",
    content: `
# Why Premium Domains Are the Best Investment in 2024

In an increasingly digital world, premium domain names have emerged as one of the most lucrative investment opportunities available today.

## The Digital Real Estate Boom

Just like physical real estate, digital real estate (domain names) benefits from scarcity and location. Premium domains are the "prime locations" of the internet.

### Key Investment Benefits

1. **Scarcity**: There's only one of each domain name
2. **No Maintenance Costs**: Unlike physical property, domains require minimal upkeep
3. **Global Market**: Domains can be sold to anyone, anywhere in the world
4. **Appreciation**: Quality domains tend to appreciate over time

## Market Trends Supporting Domain Investment

### Digital Transformation
The ongoing digital transformation means more businesses need strong online presences, driving demand for premium domains.

### Startup Growth
The startup ecosystem continues to expand, with new companies constantly seeking brandable domain names.

### International Expansion
As businesses expand globally, they often acquire premium domains in different markets.

## What Makes a Domain "Premium"?

- **Short Length**: Typically 1-6 characters
- **Memorable**: Easy to remember and spell
- **Brandable**: Suitable for building a brand around
- **Extension**: .com is still king, but other extensions are gaining value
- **Keywords**: Contains valuable search terms

## Investment Strategies

### Buy and Hold
Purchase premium domains and hold them for long-term appreciation.

### Development
Develop domains into profitable websites or businesses.

### Flipping
Buy undervalued domains and sell them quickly for profit.

## Risk Considerations

While domain investing can be profitable, it's important to understand the risks:

- Market volatility
- Changing technology trends
- Legal issues (trademark disputes)
- Liquidity concerns

## Getting Started

1. Research the market thoroughly
2. Start with a modest budget
3. Focus on quality over quantity
4. Learn from experienced investors
5. Stay updated on industry trends

Premium domains represent a unique investment opportunity that combines the benefits of real estate with the accessibility of digital assets.
    `,
    author: "Michael Chen",
    publishedAt: "2024-01-10",
    category: "Investment",
    tags: ["investment", "premium domains", "digital assets"],
    readTime: "6 min read",
  },
  {
    id: "domain-transfer-process",
    title: "Domain Transfer Process: A Step-by-Step Guide",
    excerpt:
      "Navigate the domain transfer process with confidence. Our detailed guide covers everything from preparation to completion, ensuring a smooth transition.",
    content: `
# Domain Transfer Process: A Step-by-Step Guide

Transferring a domain from one registrar to another can seem daunting, but with the right knowledge, it's a straightforward process.

## Before You Start

### Prerequisites
- Domain must be at least 60 days old
- Domain must not be locked
- You need access to the admin email
- Authorization code (EPP code) from current registrar

### Important Considerations
- Transfer can take 5-7 days to complete
- Domain will be extended by 1 year upon transfer
- Some registrars may charge transfer fees

## Step-by-Step Transfer Process

### Step 1: Prepare Your Domain
1. Unlock your domain at the current registrar
2. Disable privacy protection temporarily
3. Ensure contact information is up to date
4. Request authorization code (EPP code)

### Step 2: Initiate Transfer
1. Choose your new registrar
2. Start the transfer process on their website
3. Enter your domain name and authorization code
4. Complete payment for the transfer

### Step 3: Confirm Transfer
1. Check your email for transfer confirmation
2. Approve the transfer request
3. Wait for the current registrar to release the domain

### Step 4: Complete Transfer
1. Verify the domain is now with the new registrar
2. Update DNS settings if necessary
3. Re-enable privacy protection if desired
4. Update contact information

## Common Issues and Solutions

### Transfer Denied
- Check if domain is locked
- Verify authorization code is correct
- Ensure domain is not in redemption period

### Email Not Received
- Check spam folder
- Verify admin email address
- Contact registrar support

### Transfer Taking Too Long
- Most transfers complete within 5-7 days
- Contact both registrars if it takes longer
- Check for any pending approvals

## Best Practices

1. **Timing**: Avoid transferring close to expiration
2. **Backup**: Keep records of all transfer communications
3. **DNS**: Plan for potential DNS changes
4. **Testing**: Test website functionality after transfer

## After Transfer Completion

- Verify all domain settings
- Update DNS records if needed
- Set up auto-renewal
- Update domain management contacts

## Conclusion

Domain transfers are routine procedures when done correctly. Following this guide will help ensure your transfer goes smoothly and your domain remains secure throughout the process.
    `,
    author: "Lisa Rodriguez",
    publishedAt: "2024-01-05",
    category: "Domain Management",
    tags: ["domain transfer", "registrar", "dns"],
    readTime: "7 min read",
  },
  {
    id: "seo-benefits-premium-domains",
    title: "SEO Benefits of Premium Domains: Boost Your Rankings",
    excerpt:
      "Explore how premium domains can significantly impact your SEO performance. From domain authority to user trust, discover the ranking advantages.",
    content: `
# SEO Benefits of Premium Domains: Boost Your Rankings

Premium domains offer significant SEO advantages that can help your website rank higher in search engine results pages (SERPs).

## Domain Authority and Trust

### Established Authority
Premium domains often come with existing domain authority built up over years of operation. This authority can provide an immediate SEO boost.

### Trust Signals
Search engines view older, established domains as more trustworthy, which can positively impact rankings.

## Key SEO Benefits

### 1. Exact Match Domains (EMDs)
Domains that exactly match search queries can provide ranking advantages, especially for local and niche searches.

### 2. Brandable Domains
Memorable, brandable domains tend to generate more direct traffic and brand searches, which are positive ranking signals.

### 3. Backlink Profile
Premium domains often come with existing high-quality backlinks, providing immediate link equity.

### 4. Click-Through Rates
Premium domains typically have higher click-through rates in search results due to their credibility and memorability.

## Technical SEO Advantages

### Clean History
Vetted premium domains come with clean histories, avoiding penalties from previous owners' actions.

### Age Factor
Domain age is a ranking factor, and premium domains are typically older and more established.

### Extension Authority
.com domains generally carry more authority than other extensions in search results.

## Content Strategy for Premium Domains

### Keyword Integration
Use your domain's keywords naturally in your content strategy while avoiding over-optimization.

### Brand Building
Focus on building a strong brand around your premium domain to increase brand searches.

### Content Quality
High-quality, relevant content is essential to maximize the SEO benefits of your premium domain.

## Measuring SEO Impact

### Key Metrics to Track
- Organic traffic growth
- Keyword ranking improvements
- Domain authority scores
- Backlink acquisition
- Brand search volume

### Tools for Monitoring
- Google Analytics
- Google Search Console
- SEMrush
- Ahrefs
- Moz

## Best Practices

1. **Content First**: Always prioritize high-quality content
2. **Natural Optimization**: Avoid over-optimizing for your domain keywords
3. **User Experience**: Focus on providing value to users
4. **Technical SEO**: Ensure your site is technically sound
5. **Link Building**: Continue building high-quality backlinks

## Common Mistakes to Avoid

- Over-relying on domain keywords
- Neglecting content quality
- Ignoring technical SEO
- Not building brand awareness
- Expecting immediate results

## Conclusion

Premium domains can provide significant SEO advantages, but they're not a magic bullet. Success requires combining a premium domain with excellent content, technical SEO, and ongoing optimization efforts.
    `,
    author: "David Park",
    publishedAt: "2023-12-28",
    category: "SEO",
    tags: ["seo", "premium domains", "rankings"],
    readTime: "9 min read",
  },
  {
    id: "future-of-domain-investing",
    title: "The Future of Domain Investing: Trends and Predictions",
    excerpt:
      "Look ahead to the future of domain investing. From new TLDs to emerging technologies, discover what trends will shape the domain market in coming years.",
    content: `
# The Future of Domain Investing: Trends and Predictions

The domain investing landscape is constantly evolving. Understanding future trends is crucial for making informed investment decisions.

## Emerging Trends

### 1. New Generic Top-Level Domains (gTLDs)
The expansion of gTLDs beyond traditional extensions is creating new investment opportunities.

#### Popular New Extensions
- .tech
- .online
- .store
- .app
- .dev

### 2. Geographic Domains
Country-code TLDs (ccTLDs) are gaining value as businesses expand globally.

### 3. Industry-Specific Domains
Specialized extensions for specific industries are becoming more valuable.

## Technology Impact

### Artificial Intelligence
AI is changing how domains are valued and discovered, making data-driven decisions more important.

### Blockchain and Web3
Decentralized domains and blockchain-based naming systems are emerging as new investment categories.

### Voice Search
The rise of voice search is affecting domain naming strategies and valuations.

## Market Predictions

### Short-Term (1-2 Years)
- Continued growth in premium .com values
- Increased adoption of new gTLDs
- More sophisticated valuation tools

### Medium-Term (3-5 Years)
- Mainstream adoption of blockchain domains
- AI-powered domain discovery
- Increased regulation and standardization

### Long-Term (5+ Years)
- Integration with emerging technologies
- New forms of digital identity
- Evolution of internet infrastructure

## Investment Strategies for the Future

### Diversification
Spread investments across different types of domains and extensions.

### Technology Focus
Invest in domains related to emerging technologies and trends.

### Geographic Expansion
Consider international markets and ccTLDs.

### Data-Driven Decisions
Use analytics and AI tools to inform investment choices.

## Challenges and Opportunities

### Challenges
- Increased competition
- Regulatory changes
- Technology disruption
- Market saturation in some areas

### Opportunities
- New markets and extensions
- Emerging technologies
- Global expansion
- Improved tools and analytics

## Preparing for the Future

### Stay Informed
- Follow industry news and trends
- Attend domain conferences
- Network with other investors
- Use professional resources

### Adapt Strategies
- Be flexible with investment approaches
- Embrace new technologies
- Consider different domain types
- Monitor market changes

### Build Expertise
- Develop technical knowledge
- Understand legal implications
- Learn about new extensions
- Study market data

## Conclusion

The future of domain investing is bright but requires adaptation to new technologies and market conditions. Success will come to those who stay informed, remain flexible, and embrace innovation while maintaining focus on fundamental value principles.
    `,
    author: "Jennifer Walsh",
    publishedAt: "2023-12-20",
    category: "Market Trends",
    tags: ["future trends", "domain investing", "predictions"],
    readTime: "10 min read",
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

    // Insert sample domains
    const domainsResult = await db.collection("domains").insertMany(sampleDomains)
    console.log(`Inserted ${domainsResult.insertedCount} domains`)

    // Insert sample users
    const usersResult = await db.collection("users").insertMany(sampleUsers)
    console.log(`Inserted ${usersResult.insertedCount} users`)

    // Insert sample blogs
    const blogsResult = await db.collection("blogs").insertMany(sampleBlogs)
    console.log(`Inserted ${blogsResult.insertedCount} blogs`)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
