"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"
import { motion } from "framer-motion"
import type { BlogPost } from "@/types/blog"

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      {posts.map((post) => (
        <motion.div
          key={post._id || post.slug}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author.name}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} min
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#33BDC7" }}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-[#38C172] transition-colors"
                  style={{ color: "#33BDC7" }}
                >
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: "#38C172", color: "white" }}
                >
                  {post.category}
                </Badge>
                {post.tags.slice(0, 1).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: "#33BDC7", color: "#33BDC7" }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
