"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Search, ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { getMostFrequentDomain, addItem, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [topDomain, setTopDomain] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [topDomainCount, setTopDomainCount] = useState<number | null>(null);
  const [fullDomain, setFullDomain] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    const loadTop = async () => {
      try {
        const res = await fetch("/api/frequency/top", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          console.log("Top domain from API:", data);
          if (!cancelled && data && data.id) {
            setTopDomain({ id: data.id, name: data.name });
            // Fetch full domain data
            fetch(`/api/domains/${data.id}`)
              .then((res) => res.json())
              .then((domain) => setFullDomain(domain))
              .catch(() => {});
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

  const handleBuyNow = () => {
    if (!fullDomain || fullDomain.isSold || !fullDomain.isAvailable) {
      toast({
        title: "Domain Unavailable",
        description: "This domain is no longer available for purchase.",
        variant: "destructive",
      });
      return;
    }

    clearCart();

    addItem({
      id: fullDomain._id,
      name: fullDomain.name,
      price: fullDomain.price,
      domain: fullDomain,
      isSold: fullDomain.isSold,
    });

    if (!user) {
      router.push("/auth/signin?redirect=/checkout");
      return;
    } else {
      router.push("/checkout");
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
          src="/artboard.png"
          alt="Hero background"
          fill
          priority
          className="hidden md:block object-cover opacity-100 dark:opacity-80"
          quality={80}
        />
        <Image
          src="/hero-mobile.jpeg"
          alt="Hero background mobile"
          fill
          priority
          className="block md:hidden object-cover opacity-100 dark:opacity-80"
          quality={80}
        />
        {/* Gradient Overlay for better text legibility */}
        <div className="absolute inset-0 dark: bg-gradient-to-l dark:from-transparent   dark:via-slate-950/50 dark:to-slate-950" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-y-16 gap-x-12 items-center">
            {/* Left Content */}
            <motion.div
              className="left-card p-4 md:p-6 md:pb-3 space-y-6 text-center lg:text-left bg-white/70 rounded-lg dark:bg-slate-900/70 backdrop-blur-xss border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden h-full"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <motion.div className="space-y-6" variants={fadeUp} custom={0.2}>
                <Badge
                  variant="outline"
                  className="px-4 py-1.5 border-[#33BDC8] bg-[#33BDC8] dark:text-white font-semibold rounded-sm"
                >
                  🔥 Premium Aged Domains
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Vetted Aged Domains With <br />
                  <span className="text-[#33BDC8]">Real Authority</span>
                </h1>

                {/* <p className="text-lg sm:text-xl text-slate-600 dark:text-white leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Get the edge with VettEdge — where Aged Domains mean business.
                  Supercharge your brand with SEO-rich domains.
                </p> */}
              </motion.div>

              <div className=" grid grid-cols-2 dark:text-white">
                <p className="flex items-center text-bold">
                  <Check strokeWidth={3} color="#00ff00" className="mr-2" />
                  100% manual vetting
                </p>
                <p className="flex items-center text-bold">
                  <Check strokeWidth={3} color="#00ff00" className="mr-2" />
                  Real SEO metrics
                </p>
                <p className="flex items-center text-bold">
                  <Check strokeWidth={3} color="#00ff00" className="mr-2" />
                  Instant ownership
                </p>
                <p className="flex items-center text-bold">
                  <Check strokeWidth={3} color="#00ff00" className="mr-2" />
                  No spam history
                </p>
              </div>
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
                    <Button
                      variant="outline"
                      type="submit"
                      className="absolute right-2 top-4 bottom-2 px-6 bg-transparent border-[#33BDC8] dark:text-white hover:bg-[#33BDC8] rounded-xl transition-colors group"
                    >
                      Search
                    </Button>
                  </div>
                </form>
              </motion.div>
              {/* Additional Actions Section */}
              <motion.div
                className="mt-8 text-center"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={1.0}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-[#33BDC8] dark:text-white hover:bg-[#33BDC8] px-8 py-3 md:px-12 md:py-4 rounded-xl group shadow-md"
                  >
                    <Link href="/domains">
                      <span className="mr-2 font-semibold">
                        Search Premium Domains
                      </span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#33BDC8] dark:text-white hover:bg-[#33BDC8] px-8 py-3 md:px-12 md:py-4 rounded-xl group shadow-md"
                    onClick={() => setModalOpen(true)}
                  >
                    <span className="mr-2 font-semibold">
                      How Checkout Works
                    </span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Features & Metrics Card */}
            <motion.div
              className="h-full"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Card className="bg-white/70 rounded-lg dark:bg-slate-900/70 backdrop-blur-xss border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <CardContent className="p-4 md:p-6 md:pb-3 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Image
                        src="/shihlogo.png"
                        alt="Vettedge Logo"
                        width={30}
                        height={23}
                        className="object-contain mr-2"
                      />
                      <span className="font-bold text-xl text-slate-900 dark:text-slate-100">
                        Live Domain Metrics
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        Live
                      </span>
                    </div>
                  </div>
                  {/* Live Metrics Box */}
                  <div className="bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xl flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                        {topDomain?.name || "Live Domain Metrics"}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase tracking-wider"
                      >
                        Real-time
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {[
                        {
                          label: "Domain Rating",
                          value: "65",
                          color: "text-emerald-600 dark:text-emerald-400",
                        },
                        {
                          label: "Authority Backlinks",
                          value: "4K+",
                          color: "text-[#33BDC8]",
                        },
                        {
                          label: "Traffic",
                          value: "15K",
                          color: "text-purple-600 dark:text-purple-400",
                        },
                        {
                          label: "Age",
                          value: "5+ yrs",
                          color: "text-orange-500",
                        },
                      ].map((m, i) => (
                        <div
                          key={i}
                          className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center"
                        >
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {m.label}
                          </span>
                          <span className={`${m.color} font-bold text-sm`}>
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Footer Link */}
                  <div className="pt-2">
                    {!topDomain ? (
                      <div className="flex flex-col items-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#33BDC8] mb-2" />
                        <p className="text-xs text-slate-500">
                          Finding top domains...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                          🔥 High demand domain spotted!{" "}
                          {topDomainCount
                            ? `${topDomainCount} users added to cart`
                            : "Frequently added to carts."}
                        </p>
                        <div className="flex gap-3">
                          <Button
                            asChild
                            variant="outline"
                            className="flex-1 h-12 border-[#33BDC8] dark:text-white hover:bg-[#33BDC8] rounded-xl group"
                          >
                            <Link href={`/domains/${topDomain.id}`}>
                              <span className="mr-2">View Full Metrics</span>
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 h-12 border-[#33BDC8] dark:text-white hover:bg-[#33BDC8] rounded-xl group"
                            onClick={handleBuyNow}
                            disabled={
                              !fullDomain ||
                              !fullDomain.isAvailable ||
                              fullDomain.isSold
                            }
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal for Tutorial Video */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-black"
            >
              <X className="h-6 w-6" />
            </button>
            <video controls className="w-full h-auto" autoPlay>
              <source src="/tutorial.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
