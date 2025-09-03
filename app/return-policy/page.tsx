"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, CreditCard, RefreshCcw, AlertCircle } from "lucide-react"
import Link from "next/link"

const policySections = [
  {
    icon: ShieldCheck,
    title: "Eligibility for Refund",
    description:
      "Domains are eligible for a refund within 14 days of purchase, provided they have not been used, transferred, or altered in any way.",
  },
  {
    icon: CreditCard,
    title: "Refund Method",
    description:
      "Refunds are processed back to the original payment method. Processing times depend on your payment provider, typically 5–10 business days.",
  },
  {
    icon: RefreshCcw,
    title: "Non-Refundable Cases",
    description:
      "Domains that have been transferred, utilized for hosting, or altered after purchase are non-refundable. Payment gateway fees (like PayPal) are also non-refundable.",
  },
  {
    icon: AlertCircle,
    title: "Important Notes",
    description:
      "We reserve the right to deny refunds in cases of abuse, fraud, or violation of our terms of service. For bulk domain deals, custom refund policies may apply.",
  },
]

export default function RefundPolicyPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <motion.section
        className="text-[#33BDC7] pt-36 pb-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <Badge
            variant="secondary"
            className="bg-white text-[#33BDC7] border-[#4DD184]"
          >
            Policies
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
            Return & Refund Policy
            <span className="block text-[#3BD17A]">Shop With Confidence</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-[#33BDC7] max-w-3xl mx-auto leading-relaxed">
            At <span className="font-semibold">Vettedge.Domains</span>, we want
            you to be fully satisfied with your purchase. Here’s how our return
            and refund policy works.
          </p>
        </div>
      </motion.section>

      {/* Policy Sections */}
      <section className="pt-16 bg-white flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2">
          {policySections.map((section, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-[#33BDC7] rounded-2xl">
                <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
                  <div className="p-4 rounded-2xl bg-[#33BDC7]/10 text-[#33BDC7] mb-4">
                    <section.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#33BDC7] mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-600">{section.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing Note */}
      <section className="py-20 bg-gray-50">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#33BDC7] mb-4">
            Need Help With a Refund?
          </h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to guide you through the refund process.
            Contact us for personalized assistance.
          </p>
          <Link href="/contact">
            <button className="px-8 py-4 rounded-full bg-[#33BDC7] hover:bg-[#2da7b0] text-white text-lg font-semibold shadow-md">
              Contact Support
            </button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
