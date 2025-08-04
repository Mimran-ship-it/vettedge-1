"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageSquare, Send, Clock, Headphones, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

    setFormData({ name: "", email: "", message: "" })
    setLoading(false)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "support@vettedge.domains",
      color: "blue",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+1 (555) 123-4567",
      color: "green",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Available 24/7",
      color: "purple",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Get In Touch
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Find Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Perfect Domain?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our domain experts are here to help you find the perfect expired domain for your business. Get personalized
            recommendations and expert guidance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <Send className="h-6 w-6 mr-3 text-blue-600" />
                Send us a Message
              </CardTitle>
              <p className="text-gray-600">Get expert advice on domain selection and SEO potential</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">How can we help you?</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us about your domain needs, target niche, or any specific requirements..."
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Get Expert Advice
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multiple Ways to Connect</h3>
              <p className="text-lg text-gray-600 mb-8">
                Choose the contact method that works best for you. Our team is available 24/7 to assist with your domain
                investment needs.
              </p>
            </div>

            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br from-${method.color}-500 to-${method.color}-600 rounded-xl flex items-center justify-center`}
                      >
                        <method.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{method.title}</h4>
                        <p className="text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Why Choose Us */}
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="pt-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <Headphones className="h-6 w-6 mr-2" />
                  Why Choose Our Support?
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Expert domain consultants available 24/7</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Personalized domain recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Free SEO analysis and potential assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Secure transfer assistance and guidance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h4>
                    <div className="space-y-1 text-gray-600">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                      <p>Saturday: 10:00 AM - 4:00 PM PST</p>
                      <p>Sunday: Emergency support only</p>
                      <p className="text-blue-600 font-medium mt-2">Live chat available 24/7</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
