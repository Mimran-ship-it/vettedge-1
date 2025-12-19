import { Suspense, lazy } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { IsHot } from "@/components/sections/isHot";
import { TrafficDomains } from "@/components/sections/traffic-Domains";
import { AgedDomains } from "@/components/sections/aged-Domain";
import { TrustSection } from "@/components/sections/trust-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { BlogPreview } from "@/components/sections/blog-preview";
import { ContactSection } from "@/components/sections/contact-section";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LiveChat } from "@/components/chat/live-chat";
import { Badge } from "@/components/ui/badge";
import { DomainsShowcase } from "@/components/sections/domains-showcase";
import { TopDomainsSection } from "@/components/sections/top-domains-section";
import Loading from "./loading";

// Lazy load the data-fetching components
const LazyTopDomainsSection = lazy(() =>
  import("@/components/sections/top-domains-section").then((module) => ({
    default: module.TopDomainsSection,
  }))
);
const LazyTrustSection = lazy(() =>
  import("@/components/sections/trust-section").then((module) => ({
    default: module.TrustSection,
  }))
);
const LazyDomainsShowcase = lazy(() =>
  import("@/components/sections/domains-showcase").then((module) => ({
    default: module.DomainsShowcase,
  }))
);
const LazyBlogPreview = lazy(() =>
  import("@/components/sections/blog-preview").then((module) => ({
    default: module.BlogPreview,
  }))
);

export default function HomePage() {
  return (
    <div className="min-h-screen  relative">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <Suspense fallback={<Loading />}>
          <LazyTopDomainsSection />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <LazyTrustSection />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <LazyDomainsShowcase />
        </Suspense>
        {/* <IsHot /> */}
        {/* <AgedDomains /> */}
        {/* <TrafficDomains/>  */}
        <Suspense fallback={<Loading />}>
          <LazyBlogPreview />
        </Suspense>
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
