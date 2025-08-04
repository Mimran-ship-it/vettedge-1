"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LiveChat } from "@/components/chat/live-chat"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    })

    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    })
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@vettedge.domains",
      action: "Send Email",
      color: "blue",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our experts",
      contact: "+1 (555) 123-4567",
      action: "Call Now",
      color: "green",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Instant support available",
      contact: "Available 24/7",
      action: "Start Chat",
      color: "purple",
    },
  ]

  const officeInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      details: ["123 Domain Street", "San Francisco, CA 94105", "United States"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM PST", "Saturday: 10:00 AM - 4:00 PM PST", "Sunday: Closed"],
    },
    {
      icon: Globe,
      title: "Global Reach",
      details: ["Serving customers worldwide", "Multi-language support", "Local payment methods"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Contact Us
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Get in Touch
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                We're Here to Help
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Have questions about domains? Need help with your purchase? Our expert team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Preferred Contact Method</h2>
            <p className="text-lg text-gray-600">We offer multiple ways to get in touch with our support team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200"
              >
                <CardContent className="pt-8 pb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br from-${method.color}-500 to-${method.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <method.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-3">{method.description}</p>
                  <p className="font-medium text-gray-900 mb-4">{method.contact}</p>
                  <Button
                    className={`bg-gradient-to-r from-${method.color}-500 to-${method.color}-600 hover:from-${method.color}-600 hover:to-${method.color}-700`}
                  >
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <Send className="h-6 w-6 mr-2 text-blue-600" />
                    Send us a Message
                  </CardTitle>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="domain">Domain Question</SelectItem>
                          <SelectItem value="purchase">Purchase Support</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Office Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get to Know Us Better</h2>
                <p className="text-lg text-gray-600 mb-8">
                  We're a team of domain experts passionate about helping businesses and investors find the perfect
                  domains to grow their online presence.
                </p>
              </div>

              <div className="space-y-6">
                {officeInfo.map((info, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <info.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-gray-600">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Stats */}
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Why Choose Vettedge?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">24/7</div>
                      <div className="text-blue-100 text-sm">Support Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">Less than 2 hours</div>
                      <div className="text-blue-100 text-sm">Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">98%</div>
                      <div className="text-blue-100 text-sm">Satisfaction Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">5000+</div>
                      <div className="text-blue-100 text-sm">Happy Customers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How quickly can I get my domain after purchase?
                </h3>
                <p className="text-gray-600">
                  Most domain transfers are completed within 24-48 hours. We'll keep you updated throughout the entire
                  process.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer refunds if I'm not satisfied?</h3>
                <p className="text-gray-600">
                  Yes, we offer a 7-day money-back guarantee if the domain doesn't meet the specifications we've
                  provided.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can you help me evaluate a domain's potential?
                </h3>
                <p className="text-gray-600">
                  Our domain experts can provide detailed analysis and recommendations based on your specific needs and
                  goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <LiveChat />
    </div>
  )
}
