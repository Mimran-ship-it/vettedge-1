import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  CheckCircle,
  Award,
  Users,
  TrendingUp,
  Globe,
  Lock,
  Zap,
  Star
} from "lucide-react"

export function TrustSection() {
  const features = [
    {
      icon: Shield,
      title: "100% Secure Transfers",
      description:
        "Every domain transfer is protected with escrow service and money-back guarantee",
    },
    {
      icon: CheckCircle,
      title: "Verified Domain History",
      description:
        "All domains undergo rigorous vetting to ensure clean history and no penalties",
    },
    {
      icon: Award,
      title: "Premium Quality Only",
      description:
        "Hand-picked domains with proven SEO value and established authority",
    },
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description:
        "Complete domain transfer and setup within 24-48 hours guaranteed",
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
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 border-[#38C172] text-[#38C172] font-medium"
          >
            Trusted by Thousands
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#33BDC7] mb-6">
            Why Industry Leaders
            <span className="block text-[#38C172]">
              Choose Vettedge
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We've built our reputation on trust, quality, and results. Here's
            why thousands of businesses and investors rely on us for their
            domain needs.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustIndicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-[#38C172] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <indicator.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#33BDC7] mb-2">
                {indicator.value}
              </div>
              <div className="text-gray-600 text-sm">{indicator.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-md transition-all duration-200 border border-gray-200"
            >
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-[#38C172] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#33BDC7] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Badge */}
        <div className="mt-16 text-center">
          <Card className="inline-block border border-[#38C172] bg-[#F6FFFA]">
            <CardContent className="pt-6 pb-6 px-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#33BDC7] rounded-xl flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#33BDC7]">
                    SSL Secured & GDPR Compliant
                  </div>
                  <div className="text-sm text-gray-600">
                    Your data and transactions are fully protected
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
