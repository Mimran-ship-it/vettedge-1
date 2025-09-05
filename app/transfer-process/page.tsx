"use client"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Lock, Key, Send, CheckCircle, Loader2, MailCheck, ShieldCheck } from "lucide-react"

const steps = [
  {
    title: "Confirmation of Payment",
    description: "You'll receive an order confirmation email. Our team will verify the payment and prepare the domain for transfer. This usually takes up to 24 hours, but often much sooner.",
    icon: CheckCircle,
  },
  {
    title: "You Provide Transfer Info",
    description: "Depending on the registrar, we may need: Your registrar name (e.g. GoDaddy, Namecheap, Google Domains, etc.), Your account email/username (for internal transfer), Or a transfer code / EPP code request (for external transfer).",
    icon: Key,
  },
  {
    title: "We Initiate the Transfer",
    description: "If same registrar: We will 'transfer' the domain into your account using your email/username. If different registrar: We will unlock the domain and provide you with the EPP/Auth code.",
    icon: Send,
  },
  {
    title: "You Accept the Transfer",
    description: "For internal push: You'll receive an email notification from the registrar to accept the domain. For external transfer: You will need to approve the transfer from your own registrar dashboard.",
    icon: MailCheck,
  },
  {
    title: "Domain Successfully Transferred!",
    description: "Internal transfers typically complete within 1–24 hours. External transfers may take 3–7 days, depending on the registrars involved. You'll receive a confirmation email once the domain is successfully transferred to you.",
    icon: ShieldCheck,
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
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold leading-tight">
            Domain Transfer Process
            <span className="block text-[#3BD17A]">Thank you for purchasing a domain from our marketplace! 🎉</span>
          </h1>
          <p className="text-md md:text-lg lg:text-xl text-[#33BDC7] max-w-3xl mx-auto leading-relaxed">
            To ensure a smooth and secure handover, here's everything you need to know about the domain transfer process.
          </p>
        </div>
      </motion.section>

      {/* What Happens After Purchase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#33BDC7] mb-4">What Happens After You Buy a Domain?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Once your payment is confirmed, we begin the process of transferring ownership of the domain to you. This can happen in two ways:
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-2 p-3 border-[#33BDC7]/20 hover:border-[#33BDC7] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-[#33BDC7] flex items-center">
                    <Lock className="mr-2 h-5 w-5" />
                    Transfer to Your Registrar (Internal Transfer)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    If the domain is registered at the same registrar where you have an account, we can transfer it directly to your account.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full p-3 border-2 border-[#33BDC7]/20 hover:border-[#33BDC7] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-[#33BDC7] flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    Push to Other Registrar (External Transfer)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    If you want to move the domain to a different registrar, we will provide you with the necessary authorization code to initiate the transfer.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-[#33BDC7] mb-4">Please Contact Us After Payment</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              To begin the transfer process quickly, contact us via Live Chat or our Contact Form as soon as your payment is complete. Let us know:
            </p>
            
            <div className="bg-white rounded-xl p-6 max-w-3xl mx-auto border border-gray-200 mb-8">
              <ul className="space-y-3 text-left text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#33BDC7] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Your order number</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#33BDC7] mr-2 mt-0.5 flex-shrink-0" />
                  <span>The domain name you purchased</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#33BDC7] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Your preferred registrar and account details (if known)</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
             
             <Link href='/contact'> <Button variant="outline" size="lg" className="rounded-full px-8 py-4 border-[#33BDC7] text-[#33BDC7] hover:bg-[#33BDC7]/10 font-semibold">
                Contact Form
              </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-gray-500 text-sm">
              ⚡ The sooner we hear from you, the faster we can start your transfer!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#33BDC7] mb-4">Step-by-Step: How the Transfer Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow these steps to complete your domain transfer smoothly and securely.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg p-6 transition-all duration-300 border-2 hover:border-[#33BDC7] rounded-2xl flex flex-col">
                  <CardHeader className="flex items-center space-x-4 pb-4">
                    <div className="p-3 rounded-2xl bg-[#33BDC7]/10 text-[#33BDC7]">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl text-[#33BDC7]">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}