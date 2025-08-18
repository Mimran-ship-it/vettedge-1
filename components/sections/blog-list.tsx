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
          <Card className="overflow-hidden bg-gray-50 rounded-lg shadow-none border-none flex flex-col h-full">
                  {/* Blog Image */}
                  <div className="w-full h-48 flex items-center justify-center overflow-hidden">
                    <motion.img
                      src={post.image || "/domaininvesting.png"}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                    />
                  </div>

                  {/* Blog Content */}
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold mb-2 hover:text-[#33BDC7] transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[#33BDC7] font-medium text-sm hover:underline"
                      >
                        Read More
                      </Link>
                      <div className="text-xs text-gray-500">
                        {post.category}
                      </div>
                    </div>
                  </CardContent>
                </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
