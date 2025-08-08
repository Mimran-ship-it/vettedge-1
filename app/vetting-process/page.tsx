import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Search,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Globe,
  LinkIcon,
  Clock,
  Award,
  Zap,
  Target,
} from "lucide-react"
import Link from "next/link"
import { LiveChat } from "@/components/chat/live-chat"

export default function VettingProcessPage() {
  const vettingSteps = [
    {
      step: 1,
      title: "Domain Discovery & Initial Screening",
      description: "We identify expired domains from premium sources and perform initial quality checks",
      icon: Search,
      details: [
        "Monitor premium domain drop lists",
        "Check basic domain metrics and age",
        "Verify domain availability and ownership",
        "Initial spam and penalty screening",
      ],
    },
    {
      step: 2,
      title: "Comprehensive SEO Analysis",
      description: "Deep dive into the domain's SEO history, backlink profile, and traffic patterns",
      icon: BarChart3,
      details: [
        "Analyze backlink quality and diversity",
        "Check domain authority and trust metrics",
        "Review historical traffic patterns",
        "Assess keyword rankings and potential",
      ],
    },
    {
      step: 3,
      title: "History & Reputation Verification",
      description: "Thorough investigation of the domain's past usage and reputation",
      icon: Shield,
      details: [
        "Wayback Machine content analysis",
        "Spam database cross-referencing",
        "Google penalty history check",
        "Brand and trademark conflict screening",
      ],
    },
    {
      step: 4,
      title: "Technical Quality Assessment",
      description: "Evaluate technical aspects and potential issues that could affect value",
      icon: Zap,
      details: [
        "DNS and hosting history review",
        "Malware and security scanning",
        "Mobile-friendliness assessment",
        "Page speed and technical SEO factors",
      ],
    },
    {
      step: 5,
      title: "Market Value & Pricing Analysis",
      description: "Determine fair market value based on comprehensive metrics and comparables",
      icon: TrendingUp,
      details: [
        "Comparable domain sales analysis",
        "Revenue potential assessment",
        "Industry-specific value factors",
        "Competitive landscape evaluation",
      ],
    },
    {
      step: 6,
      title: "Final Approval & Listing",
      description: "Expert review and approval before listing in our marketplace",
      icon: CheckCircle,
      details: [
        "Senior domain expert final review",
        "Quality assurance checklist completion",
        "Pricing strategy finalization",
        "Marketplace listing with full metrics",
      ],
    },
  ]

  const qualityMetrics = [
    {
      icon: Globe,
      title: "Domain Authority",
      description: "Minimum DA of 30+ required",
      threshold: "30+",
    },
    {
      icon: LinkIcon,
      title: "Quality Backlinks",
      description: "High-quality referring domains",
      threshold: "500+",
    },
    {
      icon: Clock,
      title: "Domain Age",
      description: "Established domains only",
      threshold: "3+ years",
    },
    {
      icon: Target,
      title: "Clean History",
      description: "No spam or penalty history",
      threshold: "100% Clean",
    },
  ]

  const rejectionReasons = [
    "Spam or adult content history",
    "Google penalties or manual actions",
    "Trademark or copyright issues",
    "Low-quality backlink profile",
    "Recent domain registration",
    "Malware or security issues",
    "Artificial or manipulated metrics",
    "Poor brand potential",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#7dca9d] via-[#3dbcc5] to-[#5a4cae] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Our Vetting Process
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              How We Ensures
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#08b1bd] to-[#1fbe61] font-bold">
  Premium Quality
</span>

            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Every domain in our marketplace undergoes a rigorous 15-point vetting process to ensure you get only the
              highest quality expired domains with real SEO value.
            </p>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#33BDC7] mb-4">Our Quality Standards</h2>
            <p className="text-lg text-gray-600">Minimum requirements every domain must meet</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityMetrics.map((metric, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#38C172] to-[#33BDC7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{metric.title}</h3>
                  <p className="text-gray-600 mb-3">{metric.description}</p>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {metric.threshold}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vetting Process Steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#33BDC7] mb-6">Our 6-Step Vetting Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each domain goes through comprehensive analysis to ensure quality, value, and clean history
            </p>
          </div>

          <div className="space-y-12 relative">
            {vettingSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < vettingSteps.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-24 bg-gradient-to-b from-[#38C172] to-[#33BDC7]"></div>
                )}

                <Card className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#38C172] to-[#33BDC7] rounded-2xl flex items-center justify-center">
                          <step.icon className="h-8 w-8 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="outline" className="text-[#38C172] border-[#38C172]">
                            Step {step.step}
                          </Badge>
                          <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        </div>

                        <p className="text-lg text-gray-600 mb-6">{step.description}</p>

                        <div className="grid md:grid-cols-2 gap-3">
                          {step.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-[#38C172] flex-shrink-0" />
                              <span className="text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rejection Criteria */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#33BDC7] mb-4">What Gets Rejected</h2>
            <p className="text-lg text-gray-600">
              We maintain strict standards and reject domains that don't meet our quality criteria
            </p>
          </div>

          <Card className="border-red-300 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Common Rejection Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {rejectionReasons.map((reason, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-[#38C172] to-[#33BDC7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vetting Results</h2>
            <p className="text-xl text-blue-100">
              Our rigorous process ensures only the best domains make it to market
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Domains Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15%</div>
              <div className="text-blue-100">Approval Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">0%</div>
              <div className="text-blue-100">Penalty History</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#38C172] to-[#33BDC7] rounded-2xl flex items-center justify-center mx-auto">
              <Award className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Ready to Find Your Premium Domain?</h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              Browse our carefully vetted collection of premium expired domains, each one guaranteed to meet our strict
              quality standards.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#38C172] to-[#33BDC7] hover:from-[#2e9962] hover:to-[#2a8bb8]"
                asChild
              >
                <Link href="/domains">Browse Premium Domains</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-[#33BDC7] text-[#33BDC7]" asChild>
                <Link href="/contact">Speak with an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <LiveChat />
    </div>
  )
}
