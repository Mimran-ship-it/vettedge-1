"use client";

import { TopDomainsSection } from "@/components/sections/top-domains-section";
import { DomainsShowcase } from "@/components/sections/domains-showcase";
import { TrustSection } from "@/components/sections/trust-section";
import { BlogPreview } from "@/components/sections/blog-preview";

// Simple wrapper components that just render the original components
// Suspense boundaries will handle the loading state
export function TopDomainsSectionWrapper() {
  return <TopDomainsSection />;
}

export function DomainsShowcaseWrapper() {
  return <DomainsShowcase />;
}

export function TrustSectionWrapper() {
  return <TrustSection />;
}

export function BlogPreviewWrapper() {
  return <BlogPreview />;
}
