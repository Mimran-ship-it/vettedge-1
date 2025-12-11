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
import { motion, useInView } from "framer-motion"
import { useEffect, useState, useRef, useMemo } from "react"

interface DomainStats {
  totalDomains: number
  soldDomains: number
  availableDomains: number
  yearsInMarket: number
}

interface TrustIndicator {
  icon: any
  label: string
  value: string
}

// Fixed Animated Counter Component
const AnimatedCounter = ({ value, duration = 2, trigger }: { value: string; duration?: number; trigger: boolean }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  // Reset animation when value changes
  useEffect(() => {
    if (prevValue !== value) {
      setCount(0);
      setHasAnimated(false);
      setPrevValue(value);
    }
  }, [value, prevValue]);

  // Start animation when trigger is true
  useEffect(() => {
    if (!trigger || hasAnimated) return;

    // Skip animation if value is "..." or not a number
    if (value === '...' || !value.match(/(\d+)/)) {
      return;
    }

    // Extract numeric value and suffix
    const numericMatch = value.match(/(\d+)/);
    if (!numericMatch) return;

    const numericValue = parseInt(numericMatch[0]);
    const suffix = value.replace(numericMatch[0], '');

    let startTime: number | null = null;
    let animationFrame: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * numericValue);
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateCount);
      } else {
        setHasAnimated(true);
      }
    };

    animationFrame = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [trigger, value, duration, hasAnimated]);

  // If value is "..." or not a number, just show the value
  if (value === '...' || !value.match(/(\d+)/)) {
    return <span>{value}</span>;
  }

  return (
    <span>
      {count}{value.replace(/\d+/g, '')}
    </span>
  );
};

export function TrustSection() {
  const [stats, setStats] = useState<DomainStats | null>(null)
  const [loading, setLoading] = useState(true)
  const mobileTrustRef = useRef(null);
  const isMobileInView = useInView(mobileTrustRef, { once: true, margin: "-100px" });

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

  // Use useMemo to prevent recreating the array on every render
  const trustIndicators = useMemo<TrustIndicator[]>(() => [
    { icon: Globe, label: "Domains Sold", value: stats ? `${stats.soldDomains}` : '...' },
    { icon: ListChecks, label: "Total Listings", value: stats ? `${stats.totalDomains}` : '...' },
    { icon: Store, label: "Years on Market", value: stats ? `${stats.yearsInMarket}+` : '...' },
  ], [stats]);

  return (
    <section className="py-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 mb-10 sm:mb-20">
          {/* Trust Indicators - Right side on large screens */}
          <div className="lg:w-2/5 lg:mt-8 lg:order-2">
            {/* Mobile View - Fixed to use AnimatedCounter with shared trigger */}
            <div className="lg:hidden" ref={mobileTrustRef}>
              <motion.div
                className="flex items-center justify-between gap-2 sm:gap-4 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                {trustIndicators.map((indicator, index) => (
                  <div key={indicator.label} className="contents">
                    <div className="flex-1 text-center min-w-0">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#33BDC7] leading-tight">
                        <AnimatedCounter value={indicator.value} trigger={isMobileInView} />
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-[#33BDC7] font-medium mt-0.5 sm:mt-1 break-words">
                        {indicator.label}
                      </div>
                    </div>
                    {index < trustIndicators.length - 1 && (
                      <div className="w-px h-10 sm:h-12 bg-gray-200 dark:bg-gray-600 flex-shrink-0"></div>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="space-y-6 ">
                {trustIndicators.map((indicator, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-5 shadow-md border border-gray-100 dark:border-gray-700 flex items-center"
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
          <div className="lg:w-3/5 lg:order-1 lg:mr-6">
            {/* Mobile L-shaped layout */}
            <div className="sm:hidden space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="feature-card group relative overflow-hidden backdrop-blur-xl p-2 opacity-0 transition-transform duration-500 hover:-translate-y-1 hover:border-blue-400/60"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />

                    <div className="relative flex items-start gap-1">
                      <div>
                        <h3 className="text-lg font-semibold mb-0 text-gray-800 dark:text-[#33BDC7]">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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