"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Search,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/cart-provider";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { getMostFrequentDomain } = useCart();
  const [topDomain, setTopDomain] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadTop = async () => {
      try {
        const res = await fetch("/api/frequency/top", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data && data.id) {
            setTopDomain({ id: data.id, name: data.name });
            return;
          }
        }
      } catch {
        // ignore and fallback
      }
      const topLocal = getMostFrequentDomain();
      if (!cancelled) setTopDomain(topLocal);
    };
    loadTop();
    return () => {
      cancelled = true;
    };
  }, [getMostFrequentDomain]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/domains?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Hero background"
          fill
          priority
          className="object-cover opacity-100 dark:opacity-80"
          quality={80}
        />
        {/* Gradient Overlay for better text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 dark:via-slate-950/50 dark:to-slate-950" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-y-16 gap-x-12 items-center">
          
          {/* Left Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <motion.div className="space-y-6" variants={fadeUp} custom={0.2}>
              <Badge
                variant="outline"
                className="px-4 py-1.5 border-[#33BDC8] bg-[#33BDC8]  dark:text-[#33BDC8] font-semibold"
              >
                🔥 Premium Aged Domains
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Vetted Aged Domains With <br />
                <span className="text-[#33BDC8]">Real Authority</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Get the edge with VettEdge — where Aged Domains mean business.
                Supercharge your brand with SEO-rich domains.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto lg:mx-0"
              variants={fadeUp}
              custom={0.4}
            >
              <form onSubmit={handleSearch} className="relative group">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-slate-400 group-focus-within:text-[#33BDC8] transition-colors h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search your domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-16 pl-12 pr-32 text-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-xl focus:ring-2 focus:ring-[#33BDC8] outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-6 bg-[#33BDC8] hover:bg-[#2ba9b8] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>

          {/* Right Content - Features & Metrics Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Card className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 space-y-8">
                
                {/* Icons Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { Icon: Search, color: "text-[#33BDC8]", title: "Search", desc: "Browse domains" },
                    { Icon: TrendingUp, color: "text-purple-500", title: "Metrics", desc: "SEO & Stats" },
                    { Icon: ShoppingBag, color: "text-emerald-500", title: "Buy", desc: "Instant checkout" },
                  ].map(({ Icon, color, title, desc }, i) => (
                    <div key={i} className="text-center space-y-2">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto bg-slate-100 dark:bg-slate-800 transition-transform hover:scale-110`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{title}</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                    </div>
                  ))}
                </div>

                {/* Live Metrics Box */}
                <div className="bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                      Live Domain Metrics
                    </h4>
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">Real-time</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Authority", value: "65", color: "text-emerald-600 dark:text-emerald-400" },
                      { label: "Links", value: "4K+", color: "text-[#33BDC8]" },
                      { label: "Traffic", value: "15K", color: "text-purple-600 dark:text-purple-400" },
                      { label: "Age", value: "5+ yrs", color: "text-orange-500" },
                    ].map((m, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{m.label}</span>
                        <span className={`${m.color} font-bold text-lg`}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Footer Link */}
                <div className="pt-2">
                  {!topDomain ? (
                    <div className="flex flex-col items-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#33BDC8] mb-2" />
                      <p className="text-xs text-slate-500">Finding top domains...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                        🔥 High demand domain spotted! Frequently added to carts.
                      </p>
                      <Button 
                        asChild 
                        className="w-full h-14 bg-[#33BDC8] hover:bg-[#2ba9b8] text-white rounded-xl shadow-lg group"
                      >
                        <Link href={`/domains/${topDomain.id}`}>
                          <span className="mr-2 font-bold tracking-wide uppercase">{topDomain.name}</span>
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  );
}