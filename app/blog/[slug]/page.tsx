import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import { blogPosts } from "@/lib/blog-data"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = blogPosts.find((post) => post.slug === params.slug)

  if (!post) {
    return {
      title: "Post Not Found - Vettedge.domains",
    }
  }

  return {
    title: `${post.title} - Vettedge.domains Blog`,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <article className="mb-12">
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              {post.featured && <Badge className="bg-cyan-500">Featured</Badge>}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </div>
            </div>

            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">{post.excerpt}</div>

            <div
              className="prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }}
            />
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-900 mr-2">Tags:</span>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900">Share this article:</span>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="group">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <img
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                    <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{relatedPost.author.name}</span>
                    <span>•</span>
                    <span>{relatedPost.readingTime} min read</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
