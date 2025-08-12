import { HeroSection } from "@/components/sections/hero-section"
import { StatsSection } from "@/components/sections/stats-section"
import { IsHot } from "@/components/sections/isHot"
import { TrustSection } from "@/components/sections/trust-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { BlogPreview } from "@/components/sections/blog-preview"
import { ContactSection } from "@/components/sections/contact-section"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen  relative">
      <Header />
      <main className="pt-16" >
        <HeroSection />
        <StatsSection />
        <IsHot />
        <TrustSection />
        <TestimonialsSection />
        <BlogPreview />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
