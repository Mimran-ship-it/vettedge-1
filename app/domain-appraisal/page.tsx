"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, BarChart3, Globe, DollarSign, CheckCircle, Star, Clock, Users } from "lucide-react"
import { useState } from "react"

export default function DomainAppraisal() {
  const [domain, setDomain] = useState("")
  const [email, setEmail] = useState("")
  const [details, setDetails] = useState("")

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Market Analysis",
      description: "Comprehensive market research and comparable domain sales analysis"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "SEO Metrics",
      description: "Domain authority, backlink profile, and search engine visibility assessment"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Traffic History",
      description: "Historical traffic data and user engagement patterns analysis"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Revenue Potential",
      description: "Monetization opportunities and estimated earning potential"
    }
  ]

  const process = [
    {
      step: "1",
      title: "Submit Domain",
      description: "Provide the domain name you want appraised along with any relevant details"
    },
    {
      step: "2",
      title: "Expert Analysis",
      description: "Our team conducts comprehensive research using industry-leading tools"
    },
    {
      step: "3",
      title: "Detailed Report",
      description: "Receive a professional appraisal report within 24-48 hours"
    },
    {
      step: "4",
      title: "Consultation",
      description: "Optional follow-up consultation to discuss findings and recommendations"
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ domain, email, details })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#33BDC7] to-[#38C172] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Domain Appraisal</h1>
          <p className="text-xl text-white/90 mb-6">Get professional valuation for your domain assets</p>
          <Badge className="bg-white/20 text-white border-white/30">
            Expert Analysis • 24-48 Hour Turnaround
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Appraisal Form */}
        <Card className="mb-12 border-[#33BDC7]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#33BDC7]">Request Free Appraisal</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Get started with your domain valuation today</p>
          </CardHeader>
          <CardContent className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Domain Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="example.com"
                    className="pl-10 border-[#33BDC7]/20 focus:border-[#33BDC7]"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Additional Details (Optional)
                </label>
                <Textarea
                  placeholder="Tell us about your domain's history, purpose, or any specific concerns..."
                  className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#33BDC7] hover:bg-[#33BDC7]/90 text-white py-3"
              >
                Request Free Appraisal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">What's Included</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-[#33BDC7]/20 hover:border-[#33BDC7]/40 transition-colors">
                <CardContent className="p-6">
                  <div className="text-[#33BDC7] mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-[#33BDC7]">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">Our Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((item, index) => (
              <Card key={index} className="text-center border-[#38C172]/20">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#38C172] text-white full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[#38C172]">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">Appraisal Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-[#33BDC7]/20">
              <CardHeader className="text-center">
                <CardTitle className="text-[#33BDC7]">Basic Appraisal</CardTitle>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">Free</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">Market value estimate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">Basic SEO metrics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">Email report</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-[#33BDC7] hover:bg-[#33BDC7]/90">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-[#38C172]/20 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#38C172] text-white">
                Most Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-[#38C172]">Professional</CardTitle>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">$99</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">Comprehensive analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">Detailed SEO audit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">Traffic analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">30-min consultation</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-[#38C172] hover:bg-[#38C172]/90">
                  Order Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20">
              <CardHeader className="text-center">
                <CardTitle className="text-blue-500">Enterprise</CardTitle>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">$299</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">Portfolio analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">Investment strategy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">Market positioning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span className="text-sm">1-hour consultation</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Us */}
        <Card className="bg-gradient-to-r from-[#33BDC7]/10 to-[#38C172]/10 border-[#33BDC7]/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-6 text-[#33BDC7]">Why Choose VettEdge Appraisals?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <Star className="w-8 h-8 text-[#38C172] mb-2" />
                <h4 className="font-semibold mb-2 text-[#33BDC7]">Expert Team</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Domain industry veterans with 10+ years experience
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-8 h-8 text-[#38C172] mb-2" />
                <h4 className="font-semibold mb-2 text-[#33BDC7]">Fast Turnaround</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Most appraisals completed within 24-48 hours
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-[#38C172] mb-2" />
                <h4 className="font-semibold mb-2 text-[#33BDC7]">Trusted by 1000+</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Domain investors and businesses worldwide
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
