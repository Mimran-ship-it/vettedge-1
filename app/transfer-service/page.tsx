"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, Shield, Clock, CheckCircle, Users, Headphones, FileText, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function TransferService() {
  const [formData, setFormData] = useState({
    domain: "",
    currentRegistrar: "",
    email: "",
    phone: "",
    details: ""
  })

  const steps = [
    {
      step: "1",
      title: "Initiate Transfer",
      description: "Submit your domain transfer request with current registrar details",
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: "2",
      title: "Verification",
      description: "We verify domain ownership and prepare transfer authorization",
      icon: <Shield className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Processing",
      description: "Domain transfer is processed securely between registrars",
      icon: <ArrowRightLeft className="w-6 h-6" />
    },
    {
      step: "4",
      title: "Completion",
      description: "Transfer completed and domain is ready for use",
      icon: <CheckCircle className="w-6 h-6" />
    }
  ]

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Process",
      description: "End-to-end encryption and secure handling of all transfer data"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Fast Turnaround",
      description: "Most transfers completed within 5-7 business days"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Support",
      description: "Dedicated transfer specialists guide you through every step"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Assistance",
      description: "Round-the-clock support for any transfer-related questions"
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Transfer request:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#33BDC7] to-[#38C172] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Domain Transfer Service</h1>
          <p className="text-xl text-white/90 mb-6">Seamless, secure domain transfers with expert assistance</p>
          <Badge className="bg-white/20 text-white border-white/30">
            Secure • Fast • Reliable
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Transfer Request Form */}
        <Card className="mb-12 border-[#33BDC7]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#33BDC7]">Request Domain Transfer</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Get started with your secure domain transfer today</p>
          </CardHeader>
          <CardContent className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Domain Name *
                  </label>
                  <Input
                    placeholder="example.com"
                    className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                    value={formData.domain}
                    onChange={(e) => handleInputChange("domain", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Current Registrar *
                  </label>
                  <Input
                    placeholder="GoDaddy, Namecheap, etc."
                    className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                    value={formData.currentRegistrar}
                    onChange={(e) => handleInputChange("currentRegistrar", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Additional Details
                </label>
                <Textarea
                  placeholder="Any specific requirements or concerns about the transfer..."
                  className="border-[#33BDC7]/20 focus:border-[#33BDC7]"
                  value={formData.details}
                  onChange={(e) => handleInputChange("details", e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#33BDC7] hover:bg-[#33BDC7]/90 text-white py-3"
              >
                Request Transfer
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transfer Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">Transfer Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="text-center border-[#33BDC7]/20 hover:border-[#33BDC7]/40 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#33BDC7] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <div className="text-[#38C172] mb-3 flex justify-center">{step.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-[#33BDC7]">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#33BDC7]">Why Choose Our Transfer Service</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-[#38C172]/20 hover:border-[#38C172]/40 transition-colors">
                <CardContent className="p-6">
                  <div className="text-[#38C172] mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-[#38C172]">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing & Timeline */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-[#33BDC7]/20">
            <CardHeader>
              <CardTitle className="text-[#33BDC7]">Transfer Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-[#33BDC7]/20 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Standard Transfer</h4>
                  <span className="text-2xl font-bold text-[#33BDC7]">Free</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Included with domain purchase
                </p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span>Secure transfer process</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span>Email support</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border-2 border-[#38C172] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Premium Transfer</h4>
                  <span className="text-2xl font-bold text-[#38C172]">$99</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  White-glove transfer service
                </p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span>Dedicated transfer specialist</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span>Priority processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#38C172]" />
                    <span>Phone support</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-blue-500">Transfer Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Day 1</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Transfer request initiated</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2-3
                  </div>
                  <div>
                    <h4 className="font-semibold">Days 2-3</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Verification and authorization</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5-7
                  </div>
                  <div>
                    <h4 className="font-semibold">Days 5-7</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Transfer completion</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card className="mb-12 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="w-5 h-5" />
              Important Transfer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-[#33BDC7]">Before Transfer</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Ensure domain is unlocked at current registrar</li>
                  <li>• Obtain authorization code (EPP code)</li>
                  <li>• Verify contact information is up to date</li>
                  <li>• Domain must be registered for at least 60 days</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-[#38C172]">During Transfer</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Domain will remain functional throughout</li>
                  <li>• Email and website services unaffected</li>
                  <li>• You'll receive status updates via email</li>
                  <li>• Support team available for questions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-[#33BDC7]/10 to-[#38C172]/10 border-[#33BDC7]/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-[#33BDC7]">Ready to Transfer Your Domain?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our expert team will handle your domain transfer with care and precision. Get started today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#33BDC7] hover:bg-[#33BDC7]/90 text-white px-8">
                Start Transfer
              </Button>
              <Button variant="outline" className="border-[#38C172] text-[#38C172] hover:bg-[#38C172] hover:text-white px-8">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
