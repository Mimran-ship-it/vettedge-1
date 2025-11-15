"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, Users, Clock, CheckCircle, Star, Phone, Video, Mail } from "lucide-react"
import { useState } from "react"

export default function FreeConsultation() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    budget: "",
    goals: "",
    preferredTime: ""
  })

  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Guidance",
      description: "Get advice from domain industry veterans with 10+ years experience"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Personalized Strategy",
      description: "Receive tailored recommendations based on your specific needs"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Market Insights",
      description: "Learn about current domain trends and investment opportunities"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "No Obligation",
      description: "Completely free consultation with no pressure to purchase"
    }
  ]

  const consultationTypes = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Consultation",
      duration: "30 minutes",
      description: "Direct phone call with our domain experts"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Call",
      duration: "45 minutes",
      description: "Screen sharing session for detailed domain analysis"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Consultation",
      duration: "Detailed report",
      description: "Comprehensive written analysis and recommendations"
    }
  ]

  const topics = [
    "Domain investment strategy",
    "Portfolio optimization",
    "SEO domain selection",
    "Brand protection domains",
    "Domain valuation methods",
    "Market timing advice",
    "Bulk purchase planning",
    "Exit strategy planning"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Consultation request:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#33BDC7] to-[#38C172] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Consultation</h1>
          <p className="text-xl text-white/90 mb-6">Expert domain advice tailored to your business needs</p>
          <Badge className="bg-white/20 text-white border-white/30">
            100% Free • No Obligation • Expert Advice
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Consultation Request Form */}
        <Card className="mb-12 border-[#33BDC7]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#33BDC7]">Schedule Your Free Consultation</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Tell us about your domain needs and we'll provide expert guidance</p>
          </CardHeader>
          <CardContent className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Full Name *
                  </label>
                  <Input
                    placeholder="John Doe"
                    className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Company/Organization
                  </label>
                  <Input
                    placeholder="Your Company Name"
                    className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Budget Range
                  </label>
                  <select 
                    className="w-full p-2 border border-[#33BDC7]/20  focus:border-[#33BDC7] bg-white dark:bg-gray-800"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                  >
                    <option value="">Select budget range</option>
                    <option value="under-1k">Under $1,000</option>
                    <option value="1k-5k">$1,000 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-50k">$10,000 - $50,000</option>
                    <option value="50k-plus">$50,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Preferred Time
                  </label>
                  <select 
                    className="w-full p-2 border border-[#33BDC7]/20  focus:border-[#33BDC7] bg-white dark:bg-gray-800"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Your Goals & Questions *
                </label>
                <Textarea
                  placeholder="Tell us about your domain goals, specific questions, or challenges you're facing..."
                  className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                  value={formData.goals}
                  onChange={(e) => handleInputChange("goals", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#33BDC7] hover:bg-[#33BDC7]/90 text-white py-3"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Free Consultation
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Consultation Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">Choose Your Consultation Format</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {consultationTypes.map((type, index) => (
              <Card key={index} className="text-center border-[#33BDC7]/20 hover:border-[#33BDC7]/40 transition-colors">
                <CardContent className="p-6">
                  <div className="text-[#33BDC7] mb-4 flex justify-center">{type.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-[#33BDC7]">{type.title}</h3>
                  <Badge className="mb-3 bg-[#38C172]/10 text-[#38C172] border-[#38C172]/20">
                    {type.duration}
                  </Badge>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">Why Choose Our Consultation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-[#38C172]/20 hover:border-[#38C172]/40 transition-colors">
                <CardContent className="p-6">
                  <div className="text-[#38C172] mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-[#38C172]">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Topics We Cover */}
        <Card className="mb-12 border-[#33BDC7]/20">
          <CardHeader>
            <CardTitle className="text-center text-[#33BDC7]">Topics We Cover</CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-400">Our experts can help with any domain-related questions</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 ">
                  <CheckCircle className="w-4 h-4 text-[#38C172] flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{topic}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What to Expect */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-[#33BDC7]/20">
            <CardHeader>
              <CardTitle className="text-[#33BDC7]">What to Expect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#33BDC7] text-white full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Initial Assessment</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">We'll review your goals and current situation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#33BDC7] text-white full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Expert Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Detailed discussion of your domain strategy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#33BDC7] text-white full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Actionable Recommendations</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Specific next steps and opportunities</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#38C172]/20">
            <CardHeader>
              <CardTitle className="text-[#38C172]">Meet Our Experts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 ">
                  <h4 className="font-semibold text-[#33BDC7] mb-1">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Senior Domain Strategist</p>
                  <p className="text-xs text-gray-500">12+ years in domain investing, $50M+ in sales</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 ">
                  <h4 className="font-semibold text-[#33BDC7] mb-1">Michael Chen</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">SEO Domain Specialist</p>
                  <p className="text-xs text-gray-500">Former Google engineer, domain SEO expert</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 ">
                  <h4 className="font-semibold text-[#33BDC7] mb-1">Lisa Rodriguez</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Brand Protection Expert</p>
                  <p className="text-xs text-gray-500">Fortune 500 brand consulting experience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-[#33BDC7]/10 to-[#38C172]/10 border-[#33BDC7]/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-[#33BDC7]">Ready to Get Expert Domain Advice?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Schedule your free consultation today and discover how the right domains can transform your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#33BDC7] hover:bg-[#33BDC7]/90 text-white px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Book Now
              </Button>
              <Button variant="outline" className="border-[#38C172] text-[#38C172] hover:bg-[#38C172] hover:text-white px-8">
                <Clock className="w-5 h-5 mr-2" />
                View Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
