"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DomainCard } from "@/components/domains/domain-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWishlist } from "@/components/providers/wishlist-provider";

import type { Domain } from "@/types/domain";

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Get wishlist IDs for comparison
  const wishlistIdsMemo = useMemo(() => wishlistIds, [wishlistIds]);

  // Compute filtered domains based on search query
  const filteredDomains = useMemo(() => {
    if (!searchQuery) return domains;

    return domains.filter(
      (domain) =>
        domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [domains, searchQuery]);

  useEffect(() => {
    async function fetchLatestDomains() {
      setIsLoading(true);

      // Check if wishlist has items
      if (!wishlistIds || wishlistIds.length === 0) {
        setDomains([]);
        setIsLoading(false);
        return;
      }

      try {
        const ids = wishlistIds;
        const res = await fetch(`/api/domains?ids=${ids.join(",")}`);

        if (!res.ok) {
          throw new Error("Failed to fetch domains");
        }

        const freshDomains = await res.json();

        // Filter to only available domains and automatically remove unavailable ones from wishlist
        const availableDomains: Domain[] = [];
        const unavailableIds: string[] = [];

        freshDomains.forEach((domain: Domain) => {
          if (ids.includes(domain._id)) {
            // Check if domain is sold or not available
            if (domain.isSold || !domain.isAvailable) {
              unavailableIds.push(domain._id);
            } else {
              availableDomains.push(domain);
            }
          }
        });

        // Find IDs that didn't return a domain (deleted) and remove them
        const missingIds = ids.filter(
          (id) => !freshDomains.some((fetched: Domain) => fetched._id === id),
        );
        const allUnavailableIds = [...unavailableIds, ...missingIds];

        // Automatically remove unavailable domains from wishlist
        allUnavailableIds.forEach((id) => {
          removeFromWishlist(id);
        });

        setDomains(availableDomains);
      } catch (error) {
        console.error("Error fetching wishlist domains:", error);
        // Fallback: show nothing
        setDomains([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestDomains();
  }, [wishlistIdsMemo]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-24">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col max-w-7xl mx-auto md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Wishlist
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Keep track of domains you're interested in ({domains.length}{" "}
                domains)
              </p>
            </div>
          </div>
        </motion.div>

        {wishlistIds && wishlistIds.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <Input
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-300 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading your wishlist...
            </p>
          </div>
        ) : (
          <>
            {/* Show available domains */}
            {filteredDomains.length > 0 ? (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {filteredDomains.map((domain) => (
                  <motion.div key={domain._id} className="mb-6">
                    <DomainCard domain={domain} />
                  </motion.div>
                ))}
              </motion.div>
            ) : wishlistIds && wishlistIds.length > 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No domains found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                  Start adding domains to your wishlist to keep track of the
                  ones you're interested in purchasing.
                </p>
                <Button
                  size="lg"
                  asChild
                  className="dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <Link href="/domains">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Browse Domains
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
