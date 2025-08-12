"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Store, TrendingUp, Award, Globe, CheckCircle, Star, Target, Zap, ListChecks } from "lucide-react"
import Link from "next/link"
import { LiveChat } from "@/components/chat/live-chat"

export default function AboutPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const stats = [
    { icon: Globe, label: "50+ Domains Sold", value: "50+" },
    { icon: ListChecks, label: "100+ Listing", value: "100+" },
    { icon: Store, label: "5 Years on Market", value: "5" },
  ]

  const values = [
    { icon: Shield, title: "Trust & Security", description: "Every domain is thoroughly vetted and comes with secure transfer guarantees." },
    { icon: Target, title: "Quality First", description: "We only offer premium domains with proven SEO value and clean histories." },
    { icon: Zap, title: "Fast Delivery", description: "Quick domain transfers within 24-48 hours with full support." },
    { icon: Star, title: "Expert Support", description: "24/7 customer support from domain industry experts." },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <motion.section
        className="text-[#44c3cd] py-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <Badge variant="secondary" className="bg-white/30 text-white border-white/50">
            About Vettedge.domains
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            Transforming Domain Investment
            <span className="block text-[#3BD17A]">Since 2019</span>
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
            We're the trusted marketplace for premium expired domains, helping businesses and investors unlock the power of aged, authority-rich domains.
          </p>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <motion.section
        className="py-20 bg-gray-50"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <Badge variant="outline" className="mb-4 border-[#33BDC7] text-[#33BDC7]">
                Our Story
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#33BDC7] mb-6">
                Built by Domain Experts, For Domain Investors
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Founded in 2019 by a team of SEO specialists and domain investors, Vettedge.domains was born from the frustration of finding quality expired domains in a market full of low-value, spammy options.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We developed a rigorous vetting process that analyzes domain history, backlink quality, traffic patterns, and SEO potential to ensure every domain in our marketplace is a genuine investment opportunity.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Rigorous 15-point domain vetting process",
                "Clean history guarantee on all domains",
                "Comprehensive SEO metrics and analytics",
                "Secure transfers with money-back guarantee",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <CheckCircle className="h-6 w-6 text-[#38C172]" />
                  <span className="text-gray-700">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square bg-[#38C172] rounded-3xl p-8 text-white flex flex-col justify-center space-y-6">
              {[
                { value: "98%", label: "Customer Satisfaction" },
                { value: "24/7", label: "Expert Support" },
                { value: "50+", label: "Domains Sold" },
              ].map((item, i) => (
                <div className="text-center" key={i}>
                  <div className="text-4xl font-bold mb-2">{item.value}</div>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-[#33BDC7] text-[#33BDC7]">
              Our Values
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#33BDC7] mb-6">What Drives Us Forward</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Our core values guide every decision we make and every domain we offer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow border border-[#33BDC7]">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 border border-[#4dd184] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-[#4dd184]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#33BDC7] mb-3">{value.title}</h3>
                    <p className="text-gray-700">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-[#33BDC7] text-white"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Find Your Perfect Domain?</h2>
          <p className="text-xl mb-8 leading-relaxed">
            Join thousands of successful businesses and investors who trust Vettedge.domains for their premium domain needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="border-white hover:text-white hover:bg-[#33BDC7] text-white bg-transparent"
              asChild
            >
              <Link href="/domains">Browse Domains</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white hover:text-white hover:bg-[#33BDC7] text-white bg-transparent"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      <Footer />
      <LiveChat />
    </div>
  )
}
