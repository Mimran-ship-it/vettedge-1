"use client"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, CreditCard, RefreshCcw, AlertCircle, CheckCircle, XCircle, MessageCircle } from "lucide-react"
import Link from "next/link"

const policySections = [
  {
    icon: RefreshCcw,
    title: "14-Day Return Window",
    description:
      "You may request a return within 14 days of your domain purchase only if the following conditions are met (see below).",
  },
  {
    icon: CheckCircle,
    title: "Eligible Return Conditions",
    content: [
      "Must not be used in any way",
      "No DNS changes or hosting setup",
      "No redirects or web content added",
      "No use for email services (e.g., G Suite, Zoho Mail)",
      "Must not be flagged or blacklisted",
      "Cannot be associated with spam, abuse, phishing, or illegal activity",
      "Cannot have been submitted to search engines or promoted on social platforms",
      "Must still be in your possession and not transferred out",
      "Domain must remain in the original registrar account provided during transfer",
      "No outbound transfers should be initiated",
      "Return request must be made within 14 calendar days of purchase",
    ],
  },
  {
    icon: XCircle,
    title: "Non-Returnable Domains",
    content: [
      "The domain has been used, modified, or pointed to a server",
      "The domain has been transferred to another registrar or account",
      "The domain has been reported for spam, abuse, or illegal activity",
      "The return request is made after the 14-day window",
    ],
  },
  {
    icon: CheckCircle,
    title: "Refund Process",
    content: [
      "We will reverse the domain ownership or re-initiate a transfer back",
      "Your payment will be refunded via the original payment method within 5–10 business days",
      "A small processing/restocking fee may apply depending on the payment processor used",
    ],
  },

]

export default function RefundPolicyPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
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
            <span className="block text-[#3BD17A]">14-Day Return Window</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-[#33BDC7] max-w-3xl mx-auto leading-relaxed">
            At <span className="font-semibold">Vettedge.Domains</span>, we offer a 14-day return window for domain purchases under specific conditions.
          </p>
        </div>
      </motion.section>
      
      {/* Policy Sections */}
      <section className="py-16 bg-white dark:bg-gray-800 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {policySections.map((section, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-[#33BDC7] 2xl dark:bg-gray-700 dark:border-gray-600">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 2xl bg-[#33BDC7]/10 dark:bg-[#33BDC7]/20 text-[#33BDC7] mr-4">
                      <section.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#33BDC7] dark:text-[#33BDC7]">
                      {section.title}
                    </h3>
                  </div>
                  
                  {section.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{section.description}</p>
                  )}
                  
                  {section.content && (
                    <ul className="space-y-3">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          { (section.title ==="Eligible Return Conditions"||section.title ==="Refund Process") ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-gray-600 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Closing Note */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#33BDC7] mb-4">
            Need Help With a Return?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our support team is here to guide you through the return process.
            Contact us for personalized assistance.
          </p>
          <Link href="/contact">
            <button className="px-8 py-4 full bg-[#33BDC7] hover:bg-[#2da7b0] text-white text-lg font-semibold shadow-md">
              Contact Support
            </button>
          </Link>
        </motion.div>
      </section>
      
      {/* Thank You Note */}
      <section className="py-10 bg-white dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Thank you for choosing Vettedge.Domains. We appreciate your trust and are committed to making your domain ownership experience secure and smooth.
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}