"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  CheckCircle,
  SearchCheck,
  TrendingUp,
  Type,
  Award,
  Store,
  ListChecks,
  Globe,
  Lock,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"

export function TrustSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    }),
  }

  const features = [
    {
      icon: Shield,
      title: "Competitive Pricing",
      description:
        "We offer premium domains at prices lower than many competitors, without compromising on quality.",
    },
    
    {
      icon: SearchCheck,
      title: "Expert Vetting",
      description:
        "Every domain is manually reviewed for SEO metrics, history, brandability, link quality, and niche relevance.",
    },
    {
      icon: TrendingUp,
      title: "SEO-Edge",
      description:
        "Our domains have DA/DR metrics, aged backlinks, and historical traffic — ready for affiliate, lead-gen, SaaS, or e-commerce use.",
    },
    {
      icon: Type,
      title: "Brand-Centric Selection",
      description:
        "We prioritize names that are memorable, niche-relevant, and investment-worthy — perfect for startups or agencies.",
    },
  ]
  

  const trustIndicators = [
    { icon: Globe, label: "50+ Domains Sold", value: "50+" },
    { icon: ListChecks, label: "100+ Listing", value: "100+" },
    { icon: Store, label: "5+ Years on Market", value: "5+" },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 border-[#38C172] text-[#38C172] font-medium"
          >
            Trusted by Thousands
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#33BDC7] mb-6">
            Why Industry Leaders
            <span className="block text-[#3bd17a]">Choose Vettedge</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We've built our reputation on trust, quality, and results. Here's
            why thousands of businesses and investors rely on us for their
            domain needs.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {trustIndicators.map((indicator, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={index * 0.15}
              variants={fadeUp}
            >
              <div className="w-16 h-16 border border-[#38C172] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <indicator.icon className="h-8 w-8 text-[#38C172]" />
              </div>
              <div className="text-3xl font-bold text-[#33BDC7] mb-2">
                {indicator.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{indicator.label}</div>
            </motion.div>
          ))}
        </div>

       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
  {features.map((feature, index) => (
    <motion.div
      key={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      custom={index * 0.15}
      variants={fadeUp}
      className="h-full" // Add this to make the motion.div take full height
    >
      <Card className="text-center hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full flex flex-col">
        <CardContent className="pt-8 pb-6 flex flex-col flex-grow">
          <div className="w-16 h-16 border border-[#38C172] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <feature.icon className="h-8 w-8 text-[#38C172]" />
          </div>
          <h3 className="text-xl font-semibold text-[#33BDC7] mb-3">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>
        {/* Security Badge */}
        <motion.div
          className="mt-16 text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Card className="inline-block border border-[#38C172] bg-[#F6FFFA] dark:bg-gray-800">
            <CardContent className="pt-6 pb-6 px-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 border border-[#38C172] rounded-xl flex items-center justify-center">
                  <Lock className="h-6 w-6 text-[#38C172]" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#33BDC7]">
                    SSL Secured & GDPR Compliant
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Your data and transactions are fully protected
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
