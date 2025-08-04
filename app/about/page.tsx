import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Users, TrendingUp, Award, Globe, CheckCircle, Star, Target, Zap } from "lucide-react"
import Link from "next/link"
import { LiveChat } from "@/components/chat/live-chat"

export default function AboutPage() {
  const stats = [
    { label: "Domains Sold", value: "15,000+", icon: Globe },
    { label: "Happy Customers", value: "5,000+", icon: Users },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
    { label: "Years Experience", value: "5+", icon: Award },
  ]

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Every domain is thoroughly vetted and comes with secure transfer guarantees.",
    },
    {
      icon: Target,
      title: "Quality First",
      description: "We only offer premium domains with proven SEO value and clean histories.",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Quick domain transfers within 24-48 hours with full support.",
    },
    {
      icon: Star,
      title: "Expert Support",
      description: "24/7 customer support from domain industry experts.",
    },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=200&width=200",
      description: "10+ years in domain investing and SEO strategy.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/placeholder.svg?height=200&width=200",
      description: "Expert in domain analytics and technical SEO.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "/placeholder.svg?height=200&width=200",
      description: "Specializes in domain vetting and customer success.",
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
              About Vettedge.domains
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Transforming Domain Investment
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                Since 2019
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We're the trusted marketplace for premium expired domains, helping businesses and investors unlock the
              power of aged, authority-rich domains.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge variant="outline" className="mb-4">
                  Our Story
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Built by Domain Experts, For Domain Investors
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Founded in 2019 by a team of SEO specialists and domain investors, Vettedge.domains was born from the
                  frustration of finding quality expired domains in a market full of low-value, spammy options.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We developed a rigorous vetting process that analyzes domain history, backlink quality, traffic
                  patterns, and SEO potential to ensure every domain in our marketplace is a genuine investment
                  opportunity.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700">Rigorous 15-point domain vetting process</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700">Clean history guarantee on all domains</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700">Comprehensive SEO metrics and analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700">Secure transfers with money-back guarantee</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="h-full flex flex-col justify-center space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">98%</div>
                    <div className="text-blue-100">Customer Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">24/7</div>
                    <div className="text-blue-100">Expert Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">$50M+</div>
                    <div className="text-blue-100">Domains Sold</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Our Values
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">What Drives Us Forward</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our core values guide every decision we make and every domain we offer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Our Team
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Meet the Domain Experts</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our team combines decades of experience in domains, SEO, and digital marketing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Find Your Perfect Domain?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of successful businesses and investors who trust Vettedge.domains for their premium domain
            needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/domains">Browse Domains</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <LiveChat />
    </div>
  )
}
