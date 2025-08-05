import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Marketing Director",
      company: "TechFlow Inc.",
      content:
        "Vettedge helped us find the perfect domain with incredible SEO history. Our organic traffic increased by 300% within 6 months!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Startup Founder",
      company: "InnovateLab",
      content:
        "The domain vetting process is thorough and transparent. We got exactly what was promised - clean history and great metrics.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "SEO Consultant",
      company: "Growth Partners",
      content:
        "I've bought 12 domains through Vettedge for my clients. Every single one delivered exceptional results. Highly recommended!",
      rating: 5,
      avatar: "ER",
    },
    {
      name: "David Kim",
      role: "E-commerce Owner",
      company: "RetailPro",
      content:
        "The customer support is outstanding. They helped me understand the SEO potential and guided me through the entire process.",
      rating: 5,
      avatar: "DK",
    },
    {
      name: "Lisa Thompson",
      role: "Brand Manager",
      company: "Creative Studios",
      content:
        "Fast, secure, and professional. The domain transfer was completed in 24 hours exactly as promised. Will definitely use again.",
      rating: 5,
      avatar: "LT",
    },
    {
      name: "James Wilson",
      role: "Investment Advisor",
      company: "Domain Capital",
      content:
        "Vettedge has the best selection of premium expired domains. Their analytics and insights help make informed investment decisions.",
      rating: 5,
      avatar: "JW",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Customer Success Stories
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Customers
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Are Saying
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what real customers say about their experience with
            Vettedge.domains.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Quote Icon */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Quote className="h-5 w-5 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>

                  {/* Author */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-blue-600">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16 text-center px-4">
          <Card className="inline-block bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 w-full max-w-xl mx-auto">
            <CardContent className="pt-6 pb-6 px-4 md:px-8">
              <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-6 md:space-y-0">
                {/* Rating */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">4.9</div>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>

                {/* Divider */}
                <div className="hidden md:block h-12 w-px bg-gray-300"></div>

                {/* Reviews */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">2,847</div>
                  <div className="text-sm text-gray-600">Customer Reviews</div>
                </div>

                {/* Divider */}
                <div className="hidden md:block h-12 w-px bg-gray-300"></div>

                {/* Satisfaction */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  )
}
