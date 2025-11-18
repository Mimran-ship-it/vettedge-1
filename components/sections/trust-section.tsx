"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  CheckCircle,
  SearchCheck,
  TrendingUp,
  Type,
  Award,
  Store,
  ListChecks,
  Globe,
  Lock,
  Zap,
  Star,
  CreditCard,
  Headset,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface DomainStats {
  totalDomains: number
  soldDomains: number
  availableDomains: number
  yearsInMarket: number
}

export function TrustSection() {
  const [stats, setStats] = useState<DomainStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/domains/stats')
        if (!response.ok) throw new Error('Failed to fetch domain stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching domain stats:', error)
        // Fallback to default values
        setStats({
          totalDomains: 100,
          soldDomains: 50,
          availableDomains: 50,
          yearsInMarket: 5,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    }),
  }

  const features = [
    {
      icon: Shield,
      title: "Competitive Pricing",
      description:
        "Premium domains at prices lower than competitors, without compromising on quality.",
    },
    {
      icon: SearchCheck,
      title: "Expert Vetting",
      description:
        "Every domain is manually reviewed for SEO metrics, history, brandability, and niche relevance.",
    },
    {
      icon: TrendingUp,
      title: "SEO-Edge",
      description:
        "Domains with strong DA/DR metrics, aged backlinks, and historical traffic ready for your business.",
    },
    {
      icon: Type,
      title: "Brand-Centric Selection",
      description:
        "Memorable, niche-relevant names perfect for startups, agencies, and investment portfolios.",
    },
  ]

  const trustIndicators = [
    { icon: Globe, label: "Domains Sold", value: stats ? `${stats.soldDomains}+` : '...' },
    { icon: ListChecks, label: "Total Listings", value: stats ? `${stats.totalDomains}+` : '...' },
    { icon: Store, label: "Years on Market", value: stats ? `${stats.yearsInMarket}+` : '...' },
  ]

  return (
    <section className="py-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 mb-10 sm:mb-20">
          {/* Trust Indicators - Left side on large screens */}
          <div className="lg:w-2/5">
            <div className="">
              <div className="space-y-6">
                {trustIndicators.map((indicator, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-gray-800 2xl p-5 shadow-md border border-gray-100 dark:border-gray-700 flex items-center"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    custom={index * 0.15}
                    variants={fadeUp}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-14 h-14 bg-transparent rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <indicator.icon className="h-6 w-6 text-[#33BDC7]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-3xl font-bold text-[#33BDC7]">
                        {indicator.value}
                      </div>
                      <div className="text-[#33BDC7] font-medium">
                        {indicator.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid - Right side on large screens */}
          <div className="lg:w-3/5">
            {/* Mobile L-shaped layout */}
            <div className="sm:hidden space-y-0">
  {/* L-shape 1: Green theme */}
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={fadeUp}
    className="relative min-h-[220px] w-full z-[99999]  rounded-none p-0 overflow-hidden "
  >
    <div className="absolute border-r-2 border-l-2 border-t-2 border-[#33BDC7] top-0 left-0 w-full h-1/2 p-6 flex items-center">
      <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed font-sans">
        {features[0].description}
      </p>
    </div>
    <div className="absolute bottom-0 right-0 w-2/3 h-1/2 p-6  border-t-2 border-[#33BDC7] flex items-center justify-center ">
      <h3 className="text-xl font-bold text-[#36C374] text-center font-serif leading-tight">
       
      </h3>
    </div>
    <div className="absolute bottom-0 left-0 w-1/3   h-1/2 p-6 border-l-2 border-b-2 border-r-2 border-[#33BDC7] flex items-center justify-center ">
      <h3 className="text-lg p-2 font-bold text-[#33BDC7] text-center font-serif leading-tight">
        {features[0].title}
      </h3>
      
    </div>
    
  </motion.div>
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={fadeUp}
    className="relative mt-[-5rem] min-h-[220px] w-full  rounded-none p-0 overflow-hidden  "
  >
    <div className="absolute top-0 left-0 w-2/3 h-1/2 p-6 border-r-2 border-b-2 border-[#36C374] flex items-center justify-center ">
      <h3 className="text-xl font-bold text-[#36C374] text-center font-serif leading-tight">
       
      </h3>
    </div>
    <div className="absolute top-0 right-0 w-1/3   h-1/2 p-6 border-r-2 border-t-2 border-[#36C374] flex items-center justify-center ">
      <h3 className="text-xl font-bold text-[#36C374] text-center font-serif leading-tight">
        {features[1].title}
      </h3>
      
    </div>
    <div className="absolute border-r-2 border-l-2 border-b-2 border-[#36C374] bottom-0 left-0 w-full h-1/2 p-6 flex items-center">
      <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed font-sans">
        {features[1].description}
      </p>
    </div>
  </motion.div>
  {/* L-shape 2: Cyan theme */}
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={fadeUp}
    className="relative min-h-[220px] mt-5 w-full z-[99999]  rounded-none p-0 overflow-hidden "
  >
    <div className="absolute border-r-2 border-l-2 border-t-2 border-[#33BDC7] top-0 left-0 w-full h-1/2 p-6 flex items-center">
      <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed font-sans">
        {features[2].description}
      </p>
    </div>
    <div className="absolute bottom-0 right-0 w-2/3 h-1/2 p-6  border-t-2 border-[#33BDC7] flex items-center justify-center ">
      <h3 className="text-xl font-bold text-[#33BDC7] text-center font-serif leading-tight">
       
      </h3>
    </div>
    <div className="absolute bottom-0 left-0 w-1/3   h-1/2 p-6 border-l-2 border-b-2 border-r-2 border-[#33BDC7] flex items-center justify-center ">
      <h3 className="text-xl font-bold text-[#33BDC7] text-center font-serif leading-tight">
        {features[2].title}
      </h3>
      
    </div>
    
  </motion.div>
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={fadeUp}
    className="relative mt-[-5rem] min-h-[220px] w-full  rounded-none p-0 overflow-hidden  "
  >
    <div className="absolute top-0 left-0 w-2/3 h-1/2 p-6 border-r-2 border-b-2 border-[#36C374] flex items-center justify-center ">
      <h3 className="text-xl font-bold text-[#36C374] text-center font-serif leading-tight">
       
      </h3>
    </div>
    <div className="absolute top-0 right-0 w-1/3   h-1/2 p-6 border-r-2 border-t-2 border-[#36C374] flex items-center justify-center ">
      <h3 className="text-xl font-bold text-[#36C374] text-center font-serif leading-tight">
        {features[3].title}
      </h3>
      
    </div>
    <div className="absolute border-r-2 border-l-2 border-b-2 border-[#36C374] bottom-0 left-0 w-full h-1/2 p-6 flex items-center">
      <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed font-sans">
        {features[3].description}
      </p>
    </div>
  </motion.div>
</div>
            {/* Desktop layout (unchanged) */}
            <div className="hidden sm:grid grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={index * 0.15}
                  variants={fadeUp}
                  whileHover={{ y: -10 }}
                  className="h-full"
                >
                  <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                    <div className="h-2 bg-gradient-to-r from-[#38C172] to-[#33BDC7] w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <CardContent className="pt-6 pb-4 px-4 sm:pt-8 sm:pb-6 sm:px-6 flex flex-col h-full">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#38C172]/10 to-[#33BDC7]/10 2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:from-[#38C172]/20 group-hover:to-[#33BDC7]/20 transition-all duration-300">
                        <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-[#38C172] group-hover:text-[#33BDC7] transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 group-hover:text-[#33BDC7] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <motion.div
          className="flex flex-col md:flex-row justify-center items-center gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          {/* Support Badge */}
          <Card className="inline-block border-0 shadow-xl bg-gradient-to-r from-[#38C172]/10 to-[#33BDC7]/10 dark:from-[#38C172]/20 dark:to-[#33BDC7]/20 backdrop-blur-sm">
            <CardContent className="pt-6 pb-6 px-8">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                  <Headset className="h-7 w-7 text-[#38C172]" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg text-gray-800 dark:text-white">
                    Comprehensive Support
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    From pre-sale inquiries to seamless domain transfer
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Badge */}
          <Card className="inline-block border-0 shadow-xl bg-gradient-to-r from-[#38C172]/10 to-[#33BDC7]/10 dark:from-[#38C172]/20 dark:to-[#33BDC7]/20 backdrop-blur-sm">
            <CardContent className="pt-6 pb-6 px-8">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 flex items-center justify-center">
                  <Lock className="h-7 w-7 text-[#38C172]" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg text-gray-800 dark:text-white">
                    SSL Secured & GDPR Compliant
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Your data and transactions are fully protected
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Badge */}
          <Card className="inline-block border-0 shadow-xl bg-gradient-to-r from-[#38C172]/10 to-[#33BDC7]/10 dark:from-[#38C172]/20 dark:to-[#33BDC7]/20 backdrop-blur-sm">
            <CardContent className="pt-6 pb-6 px-8">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 flex items-center justify-center">
                  <CreditCard className="h-7 w-7 text-[#38C172]" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg text-gray-800 dark:text-white">
                    Flexible Payment Options
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Pay securely via Stripe, PayPal, with full protection
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}