export interface BlogPost {
  _id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readingTime: number
  category: string
  tags: string[]
  featured: boolean
  image: string
  createdAt?: string
  updatedAt?: string
}
