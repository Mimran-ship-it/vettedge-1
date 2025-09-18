"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Store,
  TrendingUp,
  Award,
  Globe,
  CheckCircle,
  Star,
  Target,
  Zap,
  ListChecks
} from "lucide-react"
import Link from "next/link"
import { LiveChat } from "@/components/chat/live-chat"

export default function AboutPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const stats = [
    { icon: Globe, label: "50+ Domains Sold", value: "50+" },
    { icon: ListChecks, label: "100+ Listings", value: "100+" },
    { icon: Store, label: "5+ Years on Market", value: "5+" },
  ]

  const values = [
    { icon: Shield, title: "100% Vetted Domains", description: "No spammy or penalized names. We research metrics, backlink profiles, and archive history before listing." },
    { icon: Target, title: "Age Matters", description: "Older domains tend to rank faster and are often favored by search engines." },
    { icon: Zap, title: "Niche-Relevant Portfolios", description: "Whether you’re in health, tech, finance, or lifestyle — we’ve got targeted domains ready." },
    { icon: Star, title: "Transparency-First Approach", description: "We clearly list key SEO stats and registrar info. No surprises." },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}

      <motion.section
        className="text-[#44c3cd] pt-36 pb-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* <Badge variant="secondary" className="bg-white text-[#33BDC7] border-[#4DD184]">
            About Vettedge.domains
          </Badge> */}
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            Premium Vetted Aged Domains
            <span className="block text-[#3BD17A]">Curated for Your Success</span>
          </h1>
          <p className="text-md lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Your trusted source for premium vetted, aged, and expired domain names — helping you launch brands, grow SEO authority, and invest with confidence.
          </p>
        </div>
      </motion.section>



      {/* Why Choose Section */}
      <motion.section
        className="py-20 bg-gray-50 dark:bg-gray-900"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-[#33BDC7] text-[#33BDC7]">
              Why Choose VettEdge?
            </Badge>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Unlike generic domain marketplaces, we focus exclusively on high-potential aged and expired domains vetted by real humans — not bots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="h-full"
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow border border-[#33BDC7] dark:bg-gray-800 dark:border-gray-600 h-full flex flex-col">
                  <CardContent className="pt-6 flex-1 flex flex-col">
                    <div className="w-16 h-16 border border-[#4dd184] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-[#4dd184]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#33BDC7] mb-3">{value.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 flex-1">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-[#33BDC7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#33BDC7] mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <motion.section
        className="py-20 bg-white dark:bg-gray-800"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#33BDC7] mb-8 text-center">Who We Serve</h2>
          <ul className="grid md:grid-cols-2 gap-6 text-lg text-gray-700 dark:text-gray-300">
            {[
              "Entrepreneurs looking for brandable names",
              "SEO specialists and agencies",
              "Domain investors flipping high-value names",
              "Affiliate marketers building authority sites",
              "Startups who know the value of a strong domain foundation"
            ].map((item, i) => (
              <li key={i} className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-[#38C172] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Refund Policy */}
      <motion.section
        className="py-20 bg-gray-50 dark:bg-gray-900"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-[#33BDC7]">Peace of Mind: Our Refund & Return Policy</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            If you're not satisfied, we offer a 14-day refund window. Just let us know your reason, return the domain, and we'll refund your purchase (minus a 5% handling fee and payment processor costs).
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Returning a domain is simple — either push it back to our registrar account or share the EPP/Auth code so we can transfer it back.
          </p>
          <Link href="/refund-policy" className="text-[#33BDC7] underline">
            Learn more about our Refund Policy »
          </Link>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="py-20 bg-white dark:bg-gray-800 text-white"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Let’s Get You a Winning Domain</h2>
          <p className="text-xl mb-8 leading-relaxed">
            Whether you’re launching a new brand or growing an SEO empire, your next opportunity starts with the right domain name.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#33BDC7] text-white hover:bg-[rgb(59,209,122)]" asChild>
              <Link href="/domains">Browse Our Live Portfolio</Link>
            </Button>
            <Button size="lg" className="bg-[#33BDC7] text-white hover:bg-[rgb(59,209,122)]" asChild>
              <Link href="/contact">Contact Us for Bulk Deals</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      <Footer />
      <LiveChat />
    </div>
  )
}
