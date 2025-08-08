import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight } from "lucide-react"
import { blogPosts } from "@/lib/blog-data"

export function BlogPreview() {
  // Get the 3 most recent featured posts
  const featuredPosts = blogPosts
    .filter((post) => post.featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#33BDC7" }}>
            Latest Insights & Expert Tips
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay ahead of the curve with our expert analysis on domain investing, SEO strategies, and digital marketing
            trends.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group border border-gray-200">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <img
                  src={post.image || "/domaininvesting.png"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge
                  className="absolute top-4 left-4 text-white"
                  style={{ backgroundColor: "#33BDC7" }}
                >
                  {post.category}
                </Badge>
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

                <h3
                  className="text-lg font-semibold mb-3 group-hover:opacity-80 transition-colors"
                  style={{ color: "#33BDC7" }}
                >
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{ color: "#33BDC7" }}
                    className="hover:opacity-80 text-sm font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            style={{ backgroundColor: "#38C172", color: "white" }}
            className="hover:opacity-90"
          >
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
