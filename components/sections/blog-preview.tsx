"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  category: string;
  featured: boolean;
  image?: string;
  author: {
    name: string;
    avatar?: string;
  };
}

export function BlogPreview() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data: Blog[] = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const featuredPosts = blogs
    ?.filter((post) => post.featured)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  return (
    <section className=" py-0  sm:py-12 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Animation */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#33BDC7] dark:text-[#33BDC7] mb-6">
            Latest Insights & Expert Tips
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stay ahead of the curve with our expert analysis on domain
            investing, SEO strategies, and digital marketing trends.
          </p>
        </motion.div>

        {loading ? (
          <motion.p
            className="text-center text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Loading blogs...
          </motion.p>
        ) : featuredPosts.length === 0 ? (
          <motion.p
            className="text-center text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            No featured blogs found.
          </motion.p>
        ) : (
          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {featuredPosts.map((post) => (
              <motion.div
                key={post._id}
                className="flex"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Card className="overflow-hidden bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 flex flex-col h-full">
                  {/* Blog Image */}
                  <div className="w-full h-48 flex items-center justify-center overflow-hidden">
                    <motion.img
                      src={post.image || "/domaininvesting.png"}
                      alt={post.title}
                      className="w-full h-full object-cover"
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
        )}

        {/* View All Button Animation */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            asChild
            size="lg"
            className="hover:opacity-90 bg-[#3BD17A] text-white"
          >
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
