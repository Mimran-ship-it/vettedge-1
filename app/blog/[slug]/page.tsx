import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, Share2, User, Tag, TrendingUp } from "lucide-react"
import type { BlogPost } from "@/types/blog"
import { headers } from "next/headers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"
import { ShareButtons } from "@/components/blog/share-buttons"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const h = await headers()
  const host = h.get("host") || "localhost:3000" ||  process.env.NEXT_PUBLIC_SITE_URL
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  const res = await fetch(`${baseUrl}/api/blogs?slug=${params.slug}`, { cache: "no-store" })
  if (!res.ok) return { title: "Post Not Found - Vettedge.domains" }
  const post: BlogPost = await res.json()
  return { 
    title: `${post.title} - Vettedge.domains Blog`, 
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image || '/placeholder.svg'],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image || '/placeholder.svg'],
    }
  }
}

// Using dynamic fetch; no static params
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const h = await headers()
  const host = h.get("host") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  const res = await fetch(`${baseUrl}/api/blogs?slug=${params.slug}`, { cache: "no-store" })
  if (!res.ok) notFound()
  const post: BlogPost = await res.json()
  const allRes = await fetch(`${baseUrl}/api/blogs`, { cache: "no-store" })
  const all: BlogPost[] = allRes.ok ? await allRes.json() : []
  const relatedPosts = all.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3)
  const recentPosts = all.filter((p) => p.slug !== post.slug).slice(0, 5)
  
  // Get unique categories and tags
  const categories = Array.from(new Set(all.map(p => p.category)))
  const allTags = Array.from(new Set(all.flatMap(p => p.tags))).slice(0, 10)
  
  // Build the full URL for sharing
  const fullUrl = `${protocol}://${host}/blog/${post.slug}`
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Back Button */}
            <div className="mb-6">
              <Button variant="ghost" asChild className="pl-0 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
            
            {/* Article Header */}
            <article className="bg-white dark:bg-gray-800 xl shadow-sm overflow-hidden mb-8">
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{post.category}</Badge>
                  {post.featured && <Badge className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700">Featured</Badge>}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">{post.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={post.author.avatar || "/placeholder.svg"}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="full border-2 border-white shadow-sm"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{post.author.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Author</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
                
                <div className="aspect-video bg-gray-100 dark:bg-gray-700  overflow-hidden mb-6">
                  <Image 
                    src={post.image || "/placeholder.svg"} 
                    alt={post.title} 
                    width={800}
                    height={450}
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="text-xl text-gray-600 dark:text-gray-300 mb-8 font-medium leading-relaxed">{post.excerpt}</div>
                  <div className="blog-content space-y-6">
                    {parseBlogContent(post.content)}
                  </div>
                </div>
                
                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                        <Badge variant="outline" className="text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Share Section */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Share:</span>
                      <ShareButtons 
                        title={post.title}
                        excerpt={post.excerpt}
                        url={fullUrl}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="bg-white dark:bg-gray-800 xl shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Related Articles</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost._id} className="group border border-gray-200 dark:border-gray-700  overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:shadow-lg">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <Image
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <Badge variant="secondary" className="text-xs mb-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{relatedPost.author.name}</span>
                          </div>
                          <span>•</span>
                          <span>{relatedPost.readingTime} min read</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              {/* Author Card */}
              <div className="bg-white dark:bg-gray-800 xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About the Author</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    width={60}
                    height={60}
                    className="full border-2 border-gray-100 dark:border-gray-700"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{post.author.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{post.author.bio || "Domain Expert"}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {post.author.bio || "Expert in domain valuation and digital assets with years of experience in the industry."}
                </p> 
              </div>
              
              {/* Recent Posts */}
              <div className="bg-white dark:bg-gray-800 xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.map((recentPost) => (
                    <div key={recentPost._id} className="group border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <Link href={`/blog/${recentPost.slug}`} className="block">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700  overflow-hidden">
                            <Image
                              src={recentPost.image || "/placeholder.svg"}
                              alt={recentPost.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 text-sm">
                              {recentPost.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(recentPost.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              
               
              
              {/* Tags Cloud */}
              <div className="bg-white dark:bg-gray-800 xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                    >
                      <Badge variant="outline" className="text-xs hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 xl shadow-sm p-6 border border-cyan-100 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Subscribe to Newsletter</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Get the latest insights on domain investing and SEO.</p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-2  border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Helper function to parse blog content and render properly
const parseBlogContent = (content: string) => {
  if (!content) return null;
  const lines = content.split("\n");
  const elements: React.JSX.Element[] = [];
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    // Spacer for empty lines
    if (!trimmedLine) {
      elements.push(<div key={`spacer-${index}`} className="h-3" />);
      return;
    }
    // Headings
    if (trimmedLine.startsWith("# ")) {
      elements.push(
        <h1
          key={index}
          className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 mt-6"
        >
          {trimmedLine.substring(2)}
        </h1>
      );
      return;
    }
    if (trimmedLine.startsWith("## ")) {
      elements.push(
        <h2
          key={index}
          className="text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-tight mt-8 mb-4"
        >
          {trimmedLine.substring(3)}
        </h2>
      );
      return;
    }
    if (trimmedLine.startsWith("### ")) {
      elements.push(
        <h3
          key={index}
          className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3"
        >
          {trimmedLine.substring(4)}
        </h3>
      );
      return;
    }
    // Lists
    if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      elements.push(
        <li
          key={index}
          className="text-base text-gray-600 dark:text-gray-300 ml-6 list-disc marker:text-gray-500 dark:marker:text-gray-400 mb-2"
        >
          {trimmedLine.substring(2)}
        </li>
      );
      return;
    }
    // Blockquotes
    if (trimmedLine.startsWith("> ")) {
      elements.push(
        <blockquote
          key={index}
          className="text-base text-gray-600 dark:text-gray-300 italic border-l-4 border-cyan-300 dark:border-cyan-500 pl-4 bg-cyan-50 dark:bg-cyan-900/20 r-md py-2 mb-4"
        >
          {trimmedLine.substring(2)}
        </blockquote>
      );
      return;
    }
    // Inline formatting (bold/italic)
    if (trimmedLine.includes("**") || trimmedLine.includes("*")) {
      const formattedText = trimmedLine
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      elements.push(
        <p
          key={index}
          className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
      return;
    }
    // Default paragraph
    elements.push(
      <p
        key={index}
        className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
      >
        {trimmedLine}
      </p>
    );
  });
  return <div className="space-y-2">{elements}</div>;
};