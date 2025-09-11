import { HeroSection } from "@/components/sections/hero-section"
import { StatsSection } from "@/components/sections/stats-section"
import { IsHot } from "@/components/sections/isHot"
import {TrafficDomains} from "@/components/sections/traffic-Domains"
import  {AgedDomains}  from "@/components/sections/aged-Domain"
import { TrustSection } from "@/components/sections/trust-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { BlogPreview } from "@/components/sections/blog-preview"
import { ContactSection } from "@/components/sections/contact-section"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LiveChat } from "@/components/chat/live-chat"

export default function HomePage() {
  return (
    <div className="min-h-screen  relative">
      <Header />
      <main className="pt-16" >
        <HeroSection />
        <TrustSection />
        <p className="text-center text-2xl md:text-3xl font-bold text-gray-800 mt-10 mb-3 tracking-tight">
  Shop by <span className="text-[#33BDC7]">Category</span>
</p>

        <IsHot />
        <AgedDomains />
        <TrafficDomains/>
        {/* <TestimonialsSection /> */}
        <BlogPreview />
        <ContactSection />
        <Footer/>
      </main>
      
    </div>
  )
}
