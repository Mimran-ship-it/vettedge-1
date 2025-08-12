'use client'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"

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
      name: "David Kim John",
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 border-[#38C172] text-[#38C172] font-medium"
          > 
            Customer Success Stories
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#33BDC7] mb-6">
            What Our Customers
            <span className="block text-[#3bd17a]">Are Saying</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what real customers say
            about their experience with Vettedge.domains.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 30 },
                visible: { opacity: 1, scale: 1, y: 0 }
              }}
              transition={{ duration: 0.4 }}
            >
              <Card className="hover:shadow-md transition-all duration-200 border border-gray-200 bg-white">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Quote Icon */}
                    <div className="w-10 h-10 border border-[#38C172] rounded-lg flex items-center justify-center">
                      <Quote className="h-5 w-5 text-[#38C172]" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                      <div className="w-12 h-12 bg-[#33BDC7] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-[#33BDC7]">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role}
                        </div>
                        <div className="text-sm text-[#38C172]">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Overall Rating */}
        <motion.div
          className="mt-16 text-center px-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="inline-block border border-yellow-300 bg-yellow-50 w-full max-w-xl mx-auto">
            <CardContent className="pt-6 pb-6 px-4 md:px-8">
              <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-6 md:space-y-0">
                {/* Rating */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#33BDC7] mb-1">
                    4.9
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>

                {/* Divider */}
                <div className="hidden md:block h-12 w-px bg-gray-300"></div>

                {/* Reviews */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#33BDC7] mb-1">
                    2,847
                  </div>
                  <div className="text-sm text-gray-600">Customer Reviews</div>
                </div>

                {/* Divider */}
                <div className="hidden md:block h-12 w-px bg-gray-300"></div>

                {/* Satisfaction */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#33BDC7] mb-1">
                    98%
                  </div>
                  <div className="text-sm text-gray-600">
                    Satisfaction Rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
