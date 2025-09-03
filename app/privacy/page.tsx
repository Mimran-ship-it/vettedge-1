"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Database, Lock, Users, Globe, Mail, AlertCircle } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="w-5 h-5" />,
      content: [
        "Personal information: Name, email address, phone number, and billing address",
        "Payment information: Credit card details and transaction history (securely processed)",
        "Usage data: Website interactions, pages visited, and search queries",
        "Technical data: IP address, browser type, device information, and cookies"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="w-5 h-5" />,
      content: [
        "Process domain purchases and transfers",
        "Provide customer support and respond to inquiries",
        "Send important updates about your account and purchases",
        "Improve our services and website functionality",
        "Comply with legal obligations and prevent fraud"
      ]
    },
    {
      title: "Information Sharing",
      icon: <Users className="w-5 h-5" />,
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "Domain registrars receive necessary information for transfer completion",
        "Payment processors handle transaction data securely",
        "Legal authorities may receive information when required by law",
        "Service providers who assist our operations under strict confidentiality agreements"
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="w-5 h-5" />,
      content: [
        "SSL encryption for all data transmission",
        "Secure servers with regular security updates and monitoring",
        "Access controls limiting employee access to personal data",
        "Regular security audits and vulnerability assessments",
        "Immediate notification procedures for any security incidents"
      ]
    },
    {
      title: "Your Rights",
      icon: <Shield className="w-5 h-5" />,
      content: [
        "Access: Request copies of your personal data",
        "Correction: Update or correct inaccurate information",
        "Deletion: Request removal of your personal data (subject to legal requirements)",
        "Portability: Receive your data in a structured, machine-readable format",
        "Objection: Opt-out of certain data processing activities"
      ]
    },
    {
      title: "Cookies and Tracking",
      icon: <Globe className="w-5 h-5" />,
      content: [
        "Essential cookies for website functionality and security",
        "Analytics cookies to understand user behavior and improve services",
        "Marketing cookies for personalized content and advertisements",
        "You can control cookie preferences through your browser settings",
        "Some features may not work properly if cookies are disabled"
      ]
    }
  ]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header/>
      <div className="bg-gradient-to-r from-[#33BDC7] to-[#38C172] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/90">How we protect and handle your personal information</p>
          <Badge className="mt-4 bg-white/20 text-white border-white/30">
            Last Updated: January 2025
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <Card className="mb-8 border-[#33BDC7]/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#33BDC7]">Your Privacy Matters</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              At VettEdge, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our domain marketplace services.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We believe in transparency and want you to understand exactly how your information is handled. 
              If you have any questions about this policy, please don't hesitate to contact us.
            </p>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
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

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="border-[#38C172]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#38C172]">
                <AlertCircle className="w-5 h-5" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We retain your personal information only as long as necessary to provide our services and comply with legal obligations.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Account data is typically retained for 7 years after account closure for legal and tax purposes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-500">
                <Mail className="w-5 h-5" />
                Marketing Communications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We may send you promotional emails about new domains, special offers, and industry insights.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                You can unsubscribe at any time using the link in our emails or by contacting us directly.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* International Transfers */}
        <Card className="mt-8 border-[#33BDC7]/20">
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

        {/* Contact Information */}
        <Card className="mt-12 bg-gradient-to-r from-[#33BDC7]/10 to-[#38C172]/10 border-[#33BDC7]/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-[#33BDC7]">Questions About Your Privacy?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              If you have questions about this Privacy Policy or want to exercise your rights, please contact our privacy team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <div className="text-gray-600 dark:text-gray-400">
                <strong>Email:</strong> privacy@vettedge.domains
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <strong>Phone:</strong> +1 (555) 123-4567
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <strong>Response Time:</strong> Within 30 days
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer/>
    </div>
  )
}
