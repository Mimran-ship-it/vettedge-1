"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Key, Send, CheckCircle, Loader2 } from "lucide-react"

const steps = [
  {
    title: "Unlock Your Domain",
    description: "Log in to your current registrar and unlock the domain you want to transfer.",
    icon: Lock,
  },
  {
    title: "Get Authorization Code",
    description: "Request the EPP/Auth code from your current registrar. This is required to verify the transfer.",
    icon: Key,
  },
  {
    title: "Submit Transfer Request",
    description: "Enter the domain name and authorization code here to start the transfer process.",
    icon: Send,
  },
  {
    title: "Verify & Approve",
    description: "Check your email for approval instructions. Confirm to initiate the transfer.",
    icon: CheckCircle,
  },
]

export default function TransferProcessPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
          <Badge variant="secondary" className="bg-white text-[#33BDC7] border-[#4DD184]">
            Domain Transfer
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
            Transfer Your Domain
            <span className="block text-[#3BD17A]">Seamless & Secure Process</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-[#33BDC7] max-w-3xl mx-auto leading-relaxed">
            Moving your domain to <span className="font-semibold">Vettedge.Domains</span> is quick and reliable. 
            Follow these simple steps to get started.
          </p>
        </div>
      </motion.section>

      {/* Steps Section */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="hover:shadow-lg p-4 transition-all duration-300 border-2 hover:border-[#33BDC7] rounded-2xl">
                  <CardHeader className="flex items-center space-x-4">
                    <div className="p-3 rounded-2xl bg-[#33BDC7]/10 text-[#33BDC7]">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl text-[#33BDC7]">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Button
            size="lg"
            className="rounded-full px-10 py-6 bg-[#33BDC7] hover:bg-[#2da7b0] text-white text-lg font-semibold shadow-md"
          >
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Start Transfer Now
          </Button>
          <p className="mt-4 text-gray-500 text-sm">
            Secure, fast, and backed by 24/7 expert support.
          </p>
        </motion.div>
      </section>
 
      <Footer />
    </div>
  )
}
