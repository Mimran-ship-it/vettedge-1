"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, TrendingUp, Link, Eye, BarChart3, Globe, Target, CheckCircle, AlertTriangle, ArrowUp } from "lucide-react"
import { useState } from "react"

export default function SEOAnalysis() {
  const [domain, setDomain] = useState("")

  const metrics = [
    {
      title: "Domain Authority",
      value: 85,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-[#33BDC7]",
      description: "Overall domain strength and credibility"
    },
    {
      title: "Backlink Profile",
      value: 92,
      icon: <Link className="w-6 h-6" />,
      color: "text-[#38C172]",
      description: "Quality and quantity of referring domains"
    },
    {
      title: "Traffic Potential",
      value: 78,
      icon: <Eye className="w-6 h-6" />,
      color: "text-blue-500",
      description: "Estimated organic search visibility"
    },
    {
      title: "Technical SEO",
      value: 95,
      icon: <BarChart3 className="w-6 h-6" />,
      color: "text-purple-500",
      description: "Site structure and technical optimization"
    }
  ]

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Keyword Analysis",
      description: "Identify high-value keywords and ranking opportunities for your domain"
    },
    {
      icon: <Link className="w-8 h-8" />,
      title: "Backlink Audit",
      description: "Comprehensive analysis of your domain's link profile and authority"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Competitor Research",
      description: "Compare your domain against industry competitors and benchmarks"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Traffic Insights",
      description: "Historical traffic data and growth potential assessment"
    }
  ]

  const benefits = [
    "Identify untapped SEO opportunities",
    "Understand your domain's true market value",
    "Discover high-converting keyword targets",
    "Optimize your content strategy",
    "Track competitor performance",
    "Improve search engine rankings"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#33BDC7] to-[#38C172] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SEO Analysis</h1>
          <p className="text-xl text-white/90 mb-6">Comprehensive SEO audit and optimization insights</p>
          <Badge className="bg-white/20 text-white border-white/30">
            Professional Analysis • Actionable Insights
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Analysis Form */}
        <Card className="mb-12 border-[#33BDC7]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#33BDC7]">Get Your SEO Analysis</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Enter your domain to receive a comprehensive SEO report</p>
          </CardHeader>
          <CardContent className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="example.com"
                  className="pl-10 border-[#33BDC7]/20 focus:border-[#33BDC7]"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>
              <Button className="bg-[#33BDC7] hover:bg-[#33BDC7]/90 text-white px-8">
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sample Metrics */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">Sample SEO Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="border-[#33BDC7]/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${metric.color}`}>{metric.icon}</div>
                    <Badge variant="outline" className={`${metric.color} border-current`}>
                      {metric.value}/100
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{metric.title}</h3>
                  <Progress value={metric.value} className="mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">Analysis Features</h2>
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

        {/* Benefits & Pricing */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Benefits */}
          <Card className="border-[#38C172]/20">
            <CardHeader>
              <CardTitle className="text-[#38C172]">What You'll Get</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#38C172] flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-[#33BDC7]/20">
            <CardHeader>
              <CardTitle className="text-[#33BDC7]">SEO Analysis Packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-[#33BDC7]/20 ">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-[#33BDC7]">Basic Analysis</h4>
                  <span className="text-2xl font-bold">$49</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Essential SEO metrics and recommendations
                </p>
                <Button variant="outline" className="w-full border-[#33BDC7] text-[#33BDC7] hover:bg-[#33BDC7] hover:text-white">
                  Get Basic
                </Button>
              </div>

              <div className="p-4 border-2 border-[#38C172]  relative">
                <Badge className="absolute -top-2 left-4 bg-[#38C172] text-white">Popular</Badge>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-[#38C172]">Professional</h4>
                  <span className="text-2xl font-bold">$149</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Comprehensive analysis with competitor insights
                </p>
                <Button className="w-full bg-[#38C172] hover:bg-[#38C172]/90 text-white">
                  Get Professional
                </Button>
              </div>

              <div className="p-4 border border-blue-500/20 ">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-blue-500">Enterprise</h4>
                  <span className="text-2xl font-bold">$299</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Advanced analysis with ongoing monitoring
                </p>
                <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sample Report Preview */}
        <Card className="mb-12 border-[#33BDC7]/20">
          <CardHeader>
            <CardTitle className="text-[#33BDC7]">Sample Report Preview</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">See what insights you'll receive</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-[#33BDC7]">Top Keywords</h4>
                <div className="space-y-2">
                  {["domain investing", "Aged Domains", "SEO domains"].map((keyword, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{keyword}</span>
                      <Badge variant="outline" className="text-xs">
                        <ArrowUp className="w-3 h-3 mr-1" />
                        {Math.floor(Math.random() * 50) + 10}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-[#38C172]">Technical Issues</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">SSL Certificate Valid</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Page Speed Optimization</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Mobile Responsive</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-blue-500">Opportunities</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm font-medium">Content Gap Analysis</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">15 missing topics identified</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm font-medium">Link Building</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">23 potential link sources</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-[#33BDC7]/10 to-[#38C172]/10 border-[#33BDC7]/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-[#33BDC7]">Ready to Optimize Your Domain?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get detailed SEO insights and actionable recommendations to maximize your domain's potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#33BDC7] hover:bg-[#33BDC7]/90 text-white px-8">
                Start Analysis
              </Button>
              <Button variant="outline" className="border-[#38C172] text-[#38C172] hover:bg-[#38C172] hover:text-white px-8">
                View Sample Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
