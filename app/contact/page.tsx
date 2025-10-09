"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { HelpCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Clock, MessageSquare, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LiveChat } from "@/components/chat/live-chat"
import ContactForm from "@/components/contact-form"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    if (formData.message.trim().length < 10) {
      toast({
        title: "Validation Error",
        description: "Message must be at least 10 characters long.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
        })
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive"
      })
      console.error("Contact form error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStartChat = () => {
    // Dispatch custom event to open the LiveChat component
    window.dispatchEvent(new Event("openLiveChat"))
  }

  const contactMethods = [
    { icon: Mail, title: "Email Support", description: "Get help via email", contact: "support@vettedge.domains", action: "Send Email", link: 'https://mail.google.com/mail/u/0/?fs=1&to=support@vettedge.domains&tf=cm', isExternal: true }, 
    { icon: MessageSquare, title: "Live Chat", description: "Instant support available", contact: "Available 24/7", action: "Start Chat", link: '', isExternal: false },
  ]

  const officeInfo = [
    { icon: HelpCircle, title: "Pre-Sales Assistance", details: ["Need help choosing the right domain?", "Looking for niche-specific names or bulk deals?"] },
    { icon: CheckCircle, title: "Post-Purchase Help", details: ["Get help with domain access", "Transfer guidance", "Account-related questions"] },
    { icon: Clock, title: "Response Time", details: ["We aim to respond to all support and sales inquiries", "Within 1 business day"] },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
          <Badge variant="secondary" className="bg-[#33BDC7]/10 text-[#33BDC7] border-[#33BDC7]/30 px-4 py-2 mx-auto lg:mx-0">
            Contact Us
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
            Get in Touch
            <span className="block text-[#3BD17A]">We're Here to Help</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-[#33BDC7] max-w-3xl mx-auto leading-relaxed">
            Have questions about domains? Need help with your purchase? Our expert team is ready to assist you.
          </p>
        </div>
      </motion.section>

      {/* Contact Methods */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#33BDC7] dark:text-[#33BDC7] mb-4">Choose Your Preferred Contact Method</h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">We offer multiple ways to get in touch with our support team</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-[#33BDC7] dark:bg-gray-700 dark:border-gray-600">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 border border-[#4DD184] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <method.icon className="h-8 w-8 text-[#4DD184]" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-[#33BDC7] dark:text-[#33BDC7] mb-2">{method.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{method.description}</p>
                    <p className="font-medium text-gray-900 dark:text-white mb-4">{method.contact}</p>
                    {method.isExternal ? (
                      <Link href={method.link}>
                        <Button className="bg-[#33BDC7] hover:from-[#33BDC7]">
                          {method.action}
                        </Button>
                      </Link>
                    ) : (
                      <Button onClick={handleStartChat} className="bg-[#33BDC7] hover:from-[#33BDC7]">
                        {method.action}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Can't Find Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Can't find what you're looking for? - appears first on mobile, second on desktop */}
            {/* Can't find what you're looking for? - appears first on mobile, second on desktop */}
<motion.div
  className="order-1 lg:order-2"
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  variants={fadeUp}
>
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
    <CardContent className="pt-10 pb-10 px-6 md:px-12">
      {/* Section Title */}
      <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center text-[#33BDC7] dark:text-[#4dd9e2]">
        Can't find what you're looking for?
      </h3>

      {/* Grid Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Item 1 */}
        <div className="text-center space-y-2">
          <h4 className="font-semibold text-lg text-[#33BDC7] dark:text-[#4dd9e2]">
            Pre-Sales Assistance
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Need help choosing the right domain? Looking for niche-specific
            names or bulk deals?
          </p>
        </div>

        {/* Item 2 */}
        <div className="text-center space-y-2">
          <h4 className="font-semibold text-lg text-[#33BDC7] dark:text-[#4dd9e2]">
            Post-Purchase Help
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Get help with domain access, transfer guidance, and account-related
            questions.
          </p>
        </div>

        {/* Item 3 */}
        <div className="text-center space-y-2">
          <h4 className="font-semibold text-lg text-[#33BDC7] dark:text-[#4dd9e2]">
            Response Time
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            We aim to respond to all support and sales inquiries within 1
            business day.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</motion.div>

            {/* Contact Form - appears second on mobile, first on desktop */}
            <motion.div
              className="order-2 lg:order-1"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl font-bold flex items-center text-[#33BDC7]">
                    <Send className="h-6 w-6 mr-2 text-[#33BDC7]" />
                    Send us a Message
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{contactMethods[0].description}</p>
                </CardHeader>
                <CardContent>
                <ContactForm 
                  variant="contact"
                  showHeader={false}
                />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#33BDC7] dark:text-[#33BDC7] mb-4">Frequently Asked Questions</h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">Quick answers to common questions</p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Can I request a specific niche or category of domain?",
                answer: "Absolutely. Contact us with your preferred niche or keywords and we'll suggest available options or source domains for you."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes — we offer a 14-day refund policy. A 5% handling fee applies, and payment gateway fees (like PayPal's) are non-refundable. Domains must be unused and returned to us."
              },
              {
                question: "Are expired domains safe to use for SEO?",
                answer: "If properly vetted — yes. We only sell aged/expired domains with clean histories and strong SEO potential, making them ideal for authority sites, PBNs, niche blogs, or brand foundations."
              },
              {
                question: "How long does the transfer take?",
                answer: "Registrar push transfers are usually completed within a few hours. Traditional transfers (via EPP code) may take up to 5–7 days depending on the registrar."
              },
              {
                question: "Are the domains clean and free of penalties?",
                answer: "Yes. Every domain we list is manually vetted to ensure it's free from spam, Google penalties, or blacklists."
              },
              {
                question: "Can I request backlink or SEO metrics for a domain?",
                answer: "Definitely. Contact us and we'll provide a snapshot of the domain's metrics — such as referring domains, domain authority, and other relevant data."
              }
            ].map(({ question, answer }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="dark:bg-gray-700 dark:border-gray-600">
                  <CardContent className="pt-6">
                    <h3 className="text-base md:text-lg font-semibold text-[#33BDC7] dark:text-[#33BDC7] mb-2">{question}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
      <LiveChat />
    </div>
  )
}
