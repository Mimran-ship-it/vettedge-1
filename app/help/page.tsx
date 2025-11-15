"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, HelpCircle, MessageCircle, Phone, Mail, FileText, Shield, CreditCard, Globe, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      title: "Getting Started",
      icon: <HelpCircle className="w-6 h-6" />,
      articles: [
        "How to browse domains",
        "Understanding domain metrics",
        "Creating your account",
        "Making your first purchase"
      ]
    },
    {
      title: "Domain Management",
      icon: <Globe className="w-6 h-6" />,
      articles: [
        "Domain transfer process",
        "DNS management",
        "Domain renewal",
        "Changing ownership"
      ]
    },
    {
      title: "Billing & Payments",
      icon: <CreditCard className="w-6 h-6" />,
      articles: [
        "Payment methods",
        "Refund policy",
        "Invoice questions",
        "Bulk purchase discounts"
      ]
    },
    {
      title: "Security & Privacy",
      icon: <Shield className="w-6 h-6" />,
      articles: [
        "Account security",
        "Privacy protection",
        "Data handling",
        "Two-factor authentication"
      ]
    }
  ]

  const popularArticles = [
    "How long does domain transfer take?",
    "What makes a domain 'premium'?",
    "How to evaluate domain SEO value?",
    "Bulk domain purchase process",
    "Domain appraisal methodology"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#33BDC7] to-[#38C172] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl mb-8 text-white/90">Find answers to your questions about VettEdge domains</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for help articles..."
              className="pl-12 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-[#33BDC7]/20 hover:border-[#33BDC7]/40 transition-colors">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-[#33BDC7] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#33BDC7]">Live Chat</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get instant help from our support team</p>
              <Button className="bg-[#33BDC7] hover:bg-[#33BDC7]/90 text-white">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#38C172]/20 hover:border-[#38C172]/40 transition-colors">
            <CardContent className="p-6 text-center">
              <Phone className="w-12 h-12 text-[#38C172] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#38C172]">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Speak directly with our experts</p>
              <Button variant="outline" className="border-[#38C172] text-[#38C172] hover:bg-[#38C172] hover:text-white">
                +1 (555) 123-4567
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <CardContent className="p-6 text-center">
              <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-blue-500">Email Support</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Send us your detailed questions</p>
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">Popular Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#38C172]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{article}</span>
                    <ArrowRight className="w-4 h-4 text-[#33BDC7]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">Browse by Category</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="border-[#33BDC7]/20 hover:border-[#33BDC7]/40 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#33BDC7]">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.articles.map((article, articleIndex) => (
                      <div key={articleIndex} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800  cursor-pointer transition-colors">
                        <FileText className="w-4 h-4 text-[#38C172]" />
                        <span className="text-gray-700 dark:text-gray-300">{article}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-[#33BDC7]/10 to-[#38C172]/10 border-[#33BDC7]/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-[#33BDC7]">Still need help?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-[#33BDC7] hover:bg-[#33BDC7]/90 text-white">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-[#38C172] text-[#38C172] hover:bg-[#38C172] hover:text-white">
                  Schedule a Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
