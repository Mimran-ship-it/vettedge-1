"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageSquare, Send, Clock, Headphones, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ContactForm from "@/components/contact-form"

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
}

export function ContactSection() {

  const contactMethods = [
    { icon: Mail, title: "Email Support", description: "support@vettedge.domains" }, 
    { icon: MessageSquare, title: "Live Chat", description: "Available 24/7" },
  ]

  return (
    <section className="pt-20 pb-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
        >
          <Badge variant="outline" className="mb-4 px-4 py-2" style={{ borderColor: "#33BDC7", color: "#33BDC7" }}>
            Get In Touch
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#33BDC7" }}>
            Ready to Find Your
            <span className="block" style={{ color: "#33BDC7" }}>
              Perfect Domain ?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our domain experts are here to help you find the perfect expired domain for your business. Get personalized
            recommendations and expert guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInLeft}
          >
            <ContactForm 
              variant="home"
              headerTitle="Send us a Message"
              headerDescription="Get expert advice on domain selection and SEO potential"
            />
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInRight}
          >
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: "#33BDC7" }}>
                  Multiple Ways to Connect
                </h3>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
                  Choose the contact method that works best for you. Our team is available 24/7 to assist with your
                  domain investment needs.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    variants={fadeInUp}
                  >
                    <Card className="border-l-4 hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600" style={{ borderLeftColor: "#33BDC7" }}>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 border border-[#3BD17A] rounded-xl flex items-center justify-center">
                            <method.icon className="h-6 w-6 text-[#3BD17A]" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold" style={{ color: "#33BDC7" }}>
                              {method.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">{method.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Why Choose Us */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                variants={fadeInUp}
              >
                <Card style={{ backgroundColor: "#33BDC7", color: "white", border: "none" }} className="dark:bg-[#33BDC7]">
                  <CardContent className="pt-6">
                    <h4 className="text-xl font-semibold mb-4 flex items-center">
                      <Headphones className="h-6 w-6 mr-2" />
                      Why Choose Our Support?
                    </h4>
                    <div className="space-y-3">
                      {[
                        "Expert domain consultants available 24/7",
                        "Personalized domain recommendations",
                        "Free SEO analysis and potential assessment",
                        "Secure transfer assistance and guidance",
                      ].map((text, idx) => (
                        <div className="flex items-center space-x-3" key={idx}>
                          <CheckCircle className="h-5 w-5 text-white" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Office Hours */}
              {/* <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                variants={fadeInUp}
              >
                <Card className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 border border-[#38C172] rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-[#38C172]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2" style={{ color: "#33BDC7" }}>
                          Business Hours
                        </h4>
                        <div className="space-y-1 text-gray-600 dark:text-gray-300">
                          <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                          <p>Saturday: 10:00 AM - 4:00 PM PST</p>
                          <p>Sunday: Emergency support only</p>
                          <p className="font-medium mt-2" style={{ color: "#33BDC7" }}>
                            Live chat available 24/7
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div> */}
            </div>
          </motion.div>
        </div>

        {/* Can't find what you're looking for? */}
        <motion.div
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }} // triggers reliably
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
        >

          {/* <div className="max-w-4xl my-6 mx-auto">
            <Card style={{   border: "1px solid #e9ecef" }} className="dark:bg-gray-700 dark:border-gray-600">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: "#33BDC7" }}>
                  Can't find what you're looking for?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2" style={{ color: "#33BDC7" }}>Pre-Sales Assistance</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Need help choosing the right domain? Looking for niche-specific names or bulk deals?</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2" style={{ color: "#33BDC7" }}>Post-Purchase Help</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Get help with domain access, transfer guidance, and account-related questions.</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2" style={{ color: "#33BDC7" }}>Response Time</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">We aim to respond to all support and sales inquiries within 1 business day.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </motion.div>
      </div>
    </section>
  )
}
