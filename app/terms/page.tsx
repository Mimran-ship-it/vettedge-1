"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, CreditCard, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactSection } from "@/components/sections/contact-section"

export default function TermsOfService() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <CheckCircle className="w-5 h-5" />,
      content: [
        "By accessing and using VettEdge.domains, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all visitors, users, and others who access or use the service."
      ]
    },
    {
      title: "2. Domain Services",
      icon: <FileText className="w-5 h-5" />,
      content: [
        "VettEdge provides premium expired domain names that have been thoroughly vetted for quality and SEO value.",
        "All domains are sold 'as-is' with no guarantees regarding future performance or search engine rankings.",
        "Domain transfer process typically takes 5-7 business days upon successful payment verification.",
        "We reserve the right to refuse service to any customer for any reason."
      ]
    },
    {
      title: "3. Payment Terms",
      icon: <CreditCard className="w-5 h-5" />,
      content: [
        "Payment is required in full before domain transfer initiation.",
        "We accept major credit cards, PayPal, and wire transfers for purchases over $10,000.",
        "All prices are in USD and subject to change without notice.",
        "Refunds are available within 48 hours of purchase if domain transfer has not been initiated."
      ]
    },
    {
      title: "4. User Responsibilities",
      icon: <Users className="w-5 h-5" />,
      content: [
        "You are responsible for maintaining the confidentiality of your account information.",
        "You agree to use purchased domains in compliance with all applicable laws and regulations.",
        "You will not use our services for any illegal or unauthorized purpose.",
        "You are responsible for all domain renewal fees after purchase."
      ]
    },
    {
      title: "5. Intellectual Property",
      icon: <Shield className="w-5 h-5" />,
      content: [
        "VettEdge retains ownership of all website content, design, and proprietary information.",
        "Domain names are transferred with full ownership rights upon successful completion of purchase.",
        "You may not reproduce, distribute, or create derivative works from our website content.",
        "All trademarks and service marks are property of their respective owners."
      ]
    },
    {
      title: "6. Limitation of Liability",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        "VettEdge shall not be liable for any indirect, incidental, or consequential damages.",
        "Our total liability shall not exceed the amount paid for the specific domain in question.",
        "We do not guarantee domain performance, traffic levels, or search engine rankings.",
        "Force majeure events are excluded from our liability obligations."
      ]
    }
  ]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header/>
      <div className="bg-gradient-to-r from-[#33BDC7] to-[#38C172] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-white/90">Legal terms and conditions for using VettEdge services</p>
          <Badge className="mt-4 bg-white/20 text-white border-white/30">
            Last Updated: January 2025
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <Card className="mb-8 border-[#33BDC7]/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#33BDC7]">Welcome to VettEdge</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              These Terms of Service ("Terms") govern your use of VettEdge.domains and our domain marketplace services. 
              By using our platform, you agree to these terms in their entirety. Please read them carefully before 
              making any purchases or using our services.
            </p>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="border-[#33BDC7]/20 hover:border-[#33BDC7]/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-[#33BDC7]">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#38C172] rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Terms */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="border-[#38C172]/20">
            <CardHeader>
              <CardTitle className="text-[#38C172]">Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Any disputes arising from these terms will be resolved through binding arbitration in accordance with 
                the rules of the American Arbitration Association.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                The arbitration will be conducted in English and the seat of arbitration will be New York, USA.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-blue-500">Modifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately 
                upon posting to our website.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Continued use of our services after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* International Transfers */}
               <Card className="mt-8 border-[#33BDC7]/20 hover:shadow-lg transition-shadow">
                 <CardHeader>
                   <CardTitle className="text-[#33BDC7]">International Data Transfers</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-gray-600 dark:text-gray-400 mb-4">
                     Your information may be transferred to and processed in countries other than your own. We ensure appropriate
                     safeguards are in place to protect your data in accordance with this privacy policy.
                   </p>
                   <p className="text-gray-600 dark:text-gray-400">
                     We comply with applicable data protection laws including GDPR, CCPA, and other regional privacy regulations.
                   </p>
                 </CardContent>
               </Card>
       
               {/* Contact Section */}
               <ContactSection />
             
      </div>
      <Footer/>
    </div>
  )
}
