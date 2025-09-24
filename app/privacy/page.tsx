"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Eye, Database, Lock, Users, Globe, Mail, AlertCircle } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useState } from "react"

// Contact Section Component
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Reset submission status after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <Card className="mt-12 bg-gradient-to-r from-[#33BDC7]/10 to-[#38C172]/10 border-[#33BDC7]/20 shadow-lg">
      <CardContent className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4 text-[#33BDC7]">Questions About Your Privacy?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              If you have questions about this Privacy Policy or want to exercise your rights, please contact our privacy team.
            </p>
          </div>
          
          {isSubmitted ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-6 text-center">
              <div className="text-green-600 dark:text-green-400 font-medium mb-2">Thank you for your message!</div>
              <p className="text-green-700 dark:text-green-300">Our privacy team will respond to your inquiry shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="border-[#33BDC7]/30 focus:border-[#33BDC7] focus:ring-[#33BDC7]/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="border-[#33BDC7]/30 focus:border-[#33BDC7] focus:ring-[#33BDC7]/20"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your inquiry..."
                  rows={5}
                  required
                  className="border-[#33BDC7]/30 focus:border-[#33BDC7] focus:ring-[#33BDC7]/20"
                />
              </div>
              
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-[#33BDC7] to-[#38C172] text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

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
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#33BDC7] to-[#38C172] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Privacy Policy</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">How we protect and handle your personal information</p>
          <Badge className="mt-4 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
            Last Updated: January 2025
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <Card className="mb-8 border-[#33BDC7]/20 shadow-lg">
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
            <Card key={index} className="border-[#33BDC7]/20 hover:border-[#33BDC7]/40 transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-[#33BDC7]">
                  <div className="p-2 bg-[#33BDC7]/10 rounded-lg">
                    {section.icon}
                  </div>
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
          <Card className="border-[#38C172]/20 hover:shadow-lg transition-shadow">
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

          <Card className="border-blue-500/20 hover:shadow-lg transition-shadow">
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
      <Footer />
    </div>
  );
}