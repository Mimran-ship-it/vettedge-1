"use client"

import { Header } from "@/components/layout/header" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchCheck, TrendingUp, Type, Layers } from "lucide-react"
import { Variants } from "framer-motion"
import { Footer } from "@/components/layout/footer"
import {
  Shield,
  Search,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Award,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { LiveChat } from "@/components/chat/live-chat"
import { motion } from "framer-motion"

export default function VettingProcessPage() {

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom, duration: 0.4, ease: "easeOut" }
    })
  }

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
      icon: SearchCheck,
      title: "Expert Vetting",
      description:
        "Every domain is manually reviewed for SEO metrics, history, brandability, link quality, and niche relevance.",
      threshold: "Manual Review",
    },
    {
      icon: TrendingUp,
      title: "SEO-Edge",
      description:
        "Our domains have DA/DR metrics, aged backlinks, and historical traffic — ready for affiliate, lead-gen, SaaS, or e-commerce use.",
      threshold: "DA/DR + Traffic",
    },
    {
      icon: Type,
      title: "Brand-Centric Selection",
      description:
        "We prioritize names that are memorable, niche-relevant, and investment-worthy — perfect for startups or agencies.",
      threshold: "Brand Focus",
    },
    {
      icon: Layers,
      title: "Wide Niche Coverage",
      description:
        "From health and tech to finance and lifestyle, our portfolio supports projects across multiple verticals.",
      threshold: "Multi-Industry",
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br text-[#33BDC7] pt-36 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="text-center space-y-8"
          >
            <Badge
              variant="secondary"
              className="bg-white/20 text-[#33BDC7] border-[#38C172]"
            >
              Our Vetting Process
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              What Makes Our
              <span className="block bg-clip-text text-[#3BD17A] font-bold">
                Portfolio Special?
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-[#33BDC7] max-w-3xl mx-auto leading-relaxed">
              At VettEdge.domains, we don’t just list expired domains — we curate them. Our portfolio stands out for several reasons:
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#33BDC7] mb-4">Our Quality Standards</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Minimum requirements every domain must meet</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityMetrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={fadeUp} 
                initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <Card className="text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300 dark:bg-gray-700 dark:border-gray-600">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 border border-[#38C172] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <metric.icon className="h-8 w-8 text-[#38C172]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{metric.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{metric.description}</p>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {metric.threshold}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vetting Process Steps */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl lg:text-4xl font-bold text-[#33BDC7] mb-6">
        Our 6-Step Vetting Process
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Each domain goes through comprehensive analysis to ensure quality, value, and clean history
      </p>
    </motion.div>

    <div className="space-y-12">
      {vettingSteps.map((step, index) => (
        <motion.div
          key={index}
          variants={fadeUp}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
        >
          <Card className="hover:shadow-xl hover:scale-[1.01] transition-all duration-300 dark:bg-gray-800 dark:border-gray-600">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
                
                {/* Icon - Hidden on mobile */}
                <div className="flex-shrink-0 hidden sm:flex">
                  <div className="w-16 h-16 border border-[#38C172] rounded-2xl flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-[#38C172]" />
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge variant="outline" className="text-[#38C172] border-[#38C172]">
                      Step {step.step}
                    </Badge>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {step.description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-[#38C172] flex-shrink-0 mt-[2px]" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Rejection Criteria */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#33BDC7] mb-4">What Gets Rejected</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We maintain strict standards and reject domains that don't meet our quality criteria
            </p>
          </div>
          <Card className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Common Rejection Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {rejectionReasons.map((reason, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">{reason}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#4dd184] text-white">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vetting Results</h2>
            <p className="text-xl text-blue-100 dark:text-gray-300">
              Our rigorous process ensures only the best domains make it to market
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "50,000+", label: "Domains Analyzed" },
              { num: "15%", label: "Approval Rate" },
              { num: "98%", label: "Customer Satisfaction" },
              { num: "0%", label: "Penalty History" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="text-4xl font-bold mb-2">{stat.num}</div>
                <div className="text-blue-100 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="space-y-8">
            <div className="w-20 h-20 border-[#38C172] border rounded-2xl flex items-center justify-center mx-auto">
              <Award className="h-10 w-10 text-[#38C172]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Ready to Find Your Premium Domain?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Browse our carefully vetted collection of premium expired domains, each one guaranteed to meet our strict
              quality standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="border-[#33BDC7] text-[#33BDC7] hover:text-[#33BDC7] hover:bg-white"
                asChild
              >
                <Link href="/domains">Browse Premium Domains</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#33BDC7] text-[#33BDC7] hover:text-[#33BDC7] hover:bg-white"
                asChild
              >
                <Link href="/contact">Speak with an Expert</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer/>
    </div>
  )
}
