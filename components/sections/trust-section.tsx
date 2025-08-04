import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Award, Users, TrendingUp, Globe, Lock, Zap, Star } from "lucide-react"

export function TrustSection() {
  const features = [
    {
      icon: Shield,
      title: "100% Secure Transfers",
      description: "Every domain transfer is protected with escrow service and money-back guarantee",
      color: "green",
    },
    {
      icon: CheckCircle,
      title: "Verified Domain History",
      description: "All domains undergo rigorous vetting to ensure clean history and no penalties",
      color: "blue",
    },
    {
      icon: Award,
      title: "Premium Quality Only",
      description: "Hand-picked domains with proven SEO value and established authority",
      color: "purple",
    },
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description: "Complete domain transfer and setup within 24-48 hours guaranteed",
      color: "orange",
    },
  ]

  const trustIndicators = [
    { icon: Users, label: "5,000+ Happy Customers", value: "5K+" },
    { icon: Globe, label: "15,000+ Domains Sold", value: "15K+" },
    { icon: TrendingUp, label: "98% Success Rate", value: "98%" },
    { icon: Star, label: "4.9/5 Customer Rating", value: "4.9★" },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Trusted by Thousands
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Industry Leaders
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Choose Vettedge
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We've built our reputation on trust, quality, and results. Here's why thousands of businesses and investors
            rely on us for their domain needs.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustIndicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <indicator.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{indicator.value}</div>
              <div className="text-gray-600 text-sm">{indicator.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-white"
            >
              <CardContent className="pt-8 pb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Badge */}
        <div className="mt-16 text-center">
          <Card className="inline-block bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-6 pb-6 px-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">SSL Secured & GDPR Compliant</div>
                  <div className="text-sm text-gray-600">Your data and transactions are fully protected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
