import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import BlogList from "@/components/sections/blog-list"
import type { BlogPost } from "@/types/blog"

export const metadata: Metadata = {
  title: "Blog - Vettedge.domains",
  description:
    "Expert insights on domain investing, SEO strategies, and digital marketing trends from the Vettedge.domains team.",
}

export default async function BlogPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/blogs`, { cache: "no-store" })
  const blogPosts: BlogPost[] = res.ok ? await res.json() : []

  const featuredPosts = blogPosts.filter((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => post)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#33BDC7" }}>
            Domain Investment Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights on domain investing, SEO strategies, and digital marketing trends to help you make informed
            decisions in the domain marketplace.
          </p>
        </div>

        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8" style={{ color: "#33BDC7" }}>
              Featured Articles
            </h2>
            <BlogList posts={featuredPosts} />
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-8" style={{ color: "#33BDC7" }}>
            All Articles
          </h2>
          <BlogList posts={regularPosts} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
