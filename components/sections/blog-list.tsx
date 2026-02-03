"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import { Button } from "../ui/button";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto gap-8"
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
          <Card className="overflow-hidden bg-white dark:bg-gray-800  shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full hover:shadow-md dark:hover:shadow-lg transition-shadow">
            {/* Blog Image */}
            <div className="w-full h-48 flex items-center justify-center overflow-hidden">
              <motion.img
                src={post.image || "/domaininvesting.png"}
                alt={post.title}
                className="w-full h-full object-cover t-lg transition-transform duration-300 group-hover:scale-105"
                whileHover={{ scale: 1.05 }}
              />
            </div>

            {/* Blog Content */}
            <CardContent className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-2 hover:text-[#33BDC7] transition-colors text-gray-900 dark:text-white">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <Button
                  asChild
                  variant="default"
                  className="bg-[#33BDC7] hover:bg-[#2da9b2] text-white font-medium"
                >
                  <Link href={`/blog/${post.slug}`}>Read More</Link>
                </Button>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {post.category}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
