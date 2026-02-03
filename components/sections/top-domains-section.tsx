"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  ExternalLink,
  X,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  Clock,
  Link,
  Globe,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/hooks/use-toast";

type Domain = {
  _id: string;
  name: string;
  description: string;
  price: number;
  Actualprice: number;
  metrics: {
    domainRank: number;
    domainAuthority: number;
    monthlyTraffic: number | null;
    age: number;
    trustFlow: number;
    citationFlow: number;
    spamScore: number;
    indexedPages: number;
    keywords: number;
    score?: number;
    referringDomains?: number;
    authorityLinksCount?: number;
  };
  tags: string[];
  image: string[];
  createdAt: string;
  registrar?: string;
  isAvailable: boolean;
  isSold: boolean;
};

// Generate chart data based on selected metric
const generateChartData = (domains: Domain[], metric: string) => {
  if (domains.length === 0) return [];

  // Take top 5 domains for the selected metric
  const topDomains = [...domains].slice(0, 5);

  return topDomains.map((domain) => {
    let value = 0;
    let label = "";

    switch (metric) {
      case "da":
        value = domain.metrics.domainAuthority || 0;
        label = "Domain Authority";
        break;
      case "dr":
        value = domain.metrics.domainRank || 0;
        label = "Domain Rank";
        break;
      case "tf":
        value = domain.metrics.trustFlow || 0;
        label = "Trust Flow";
        break;
      case "cf":
        value = domain.metrics.citationFlow || 0;
        label = "Citation Flow";
        break;
      case "score":
        value = domain.metrics.score || 0;
        label = "Score";
        break;
      case "traffic":
        value = domain.metrics.monthlyTraffic || 0;
        label = "Monthly Traffic";
        break;
      case "age":
        value = domain.metrics.age || 0;
        label = "Domain Age";
        break;
      case "refDomains":
        value = domain.metrics.referringDomains || 0;
        label = "Referring Domains";
        break;
      case "authLinks":
        value = domain.metrics.authorityLinksCount || 0;
        label = "Authority Links";
        break;
      default:
        value = domain.metrics.domainAuthority || 0;
        label = "Domain Authority";
    }

    return {
      name: domain.name,
      value: value,
      label: label,
      fullName: domain.name,
    };
  });
};

// Calculate average metrics for available domains
const calculateAverageMetrics = (domains: Domain[]) => {
  const availableDomains = domains.filter(
    (domain) => domain.isAvailable && !domain.isSold,
  );

  if (availableDomains.length === 0) return {};

  const total = availableDomains.reduce(
    (acc, domain) => ({
      trustFlow: (acc.trustFlow || 0) + (domain.metrics.trustFlow || 0),
      citationFlow:
        (acc.citationFlow || 0) + (domain.metrics.citationFlow || 0),
      spamScore: (acc.spamScore || 0) + (domain.metrics.spamScore || 0),
      indexedPages:
        (acc.indexedPages || 0) + (domain.metrics.indexedPages || 0),
      monthlyTraffic:
        (acc.monthlyTraffic || 0) + (domain.metrics.monthlyTraffic || 0),
      keywords: (acc.keywords || 0) + (domain.metrics.keywords || 0),
      domainAuthority:
        (acc.domainAuthority || 0) + (domain.metrics.domainAuthority || 0),
      domainRank: (acc.domainRank || 0) + (domain.metrics.domainRank || 0),
      age: (acc.age || 0) + (domain.metrics.age || 0),
      score: (acc.score || 0) + (domain.metrics.score || 0),
      referringDomains:
        (acc.referringDomains || 0) + (domain.metrics.referringDomains || 0),
      authorityLinksCount:
        (acc.authorityLinksCount || 0) +
        (domain.metrics.authorityLinksCount || 0),
      count: acc.count + 1,
    }),
    { count: 0 },
  );

  return {
    trustFlow: Math.round(total.trustFlow / total.count),
    citationFlow: Math.round(total.citationFlow / total.count),
    spamScore: (total.spamScore / total.count).toFixed(1),
    indexedPages: Math.round(total.indexedPages / total.count).toLocaleString(),
    monthlyTraffic:
      total.monthlyTraffic / total.count > 1000
        ? `${(total.monthlyTraffic / total.count / 1000).toFixed(1)}K`
        : Math.round(total.monthlyTraffic / total.count),
    keywords: (total.keywords / total.count).toLocaleString(),
    domainAuthority: Math.round(total.domainAuthority / total.count),
    domainRank: Math.round(total.domainRank / total.count),
    age: Math.round(total.age / total.count),
    score: Math.round(total.score / total.count),
    referringDomains: Math.round(total.referringDomains / total.count),
    authorityLinksCount: Math.round(total.authorityLinksCount / total.count),
  };
};

// Metric options for dropdown
const metricOptions = [
  {
    value: "da",
    label: "Domain Authority",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    value: "dr",
    label: "Domain Rank",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  { value: "tf", label: "Trust Flow", icon: <Shield className="w-4 h-4" /> },
  { value: "cf", label: "Citation Flow", icon: <Link className="w-4 h-4" /> },
  { value: "score", label: "Score", icon: <BarChart3 className="w-4 h-4" /> },
  {
    value: "traffic",
    label: "Monthly Traffic",
    icon: <Globe className="w-4 h-4" />,
  },
  { value: "age", label: "Domain Age", icon: <Clock className="w-4 h-4" /> },
  {
    value: "refDomains",
    label: "Referring Domains",
    icon: <Link className="w-4 h-4" />,
  },
  {
    value: "authLinks",
    label: "Authority Links",
    icon: <Shield className="w-4 h-4" />,
  },
];

export function TopDomainsSection() {
  const [allDomains, setAllDomains] = useState<Domain[]>([]);
  const [availableDomains, setAvailableDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [loadingDomain, setLoadingDomain] = useState(false);
  const [activeTab, setActiveTab] = useState("da");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { addItem, clearCart } = useCart();
  const { toast } = useToast();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch("/api/domains");
        const data = await response.json();
        setAllDomains(data);
      } catch (error) {
        console.error("Error fetching domains:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  useEffect(() => {
    const filtered = allDomains?.filter(
      (domain) => domain.isAvailable && !domain.isSold,
    );
    setAvailableDomains(filtered);
  }, [allDomains]);

  // Detect small screens for responsive chart tweaks
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsSmallScreen(
        "matches" in e ? e.matches : (e as MediaQueryList).matches,
      );
    };
    // Set initial
    setIsSmallScreen(mql.matches);
    // Subscribe
    if ("addEventListener" in mql) {
      mql.addEventListener("change", onChange as (ev: Event) => void);
    } else {
      // @ts-ignore older Safari
      mql.addListener(onChange);
    }
    return () => {
      if ("removeEventListener" in mql) {
        mql.removeEventListener("change", onChange as (ev: Event) => void);
      } else {
        // @ts-ignore older Safari
        mql.removeListener(onChange);
      }
    };
  }, []);

  useEffect(() => {
    // Update chart data when active tab changes
    const updateChartData = () => {
      setChartLoading(true);

      // Get the sorted domains for the active tab
      let sortedDomains: Domain[] = [];

      switch (activeTab) {
        case "da":
          sortedDomains = [...availableDomains].sort(
            (a, b) =>
              (b.metrics.domainAuthority || 0) -
              (a.metrics.domainAuthority || 0),
          );
          break;
        case "dr":
          sortedDomains = [...availableDomains].sort(
            (a, b) => (b.metrics.domainRank || 0) - (a.metrics.domainRank || 0),
          );
          break;
        case "tf":
          sortedDomains = [...availableDomains].sort(
            (a, b) => (b.metrics.trustFlow || 0) - (a.metrics.trustFlow || 0),
          );
          break;
        case "cf":
          sortedDomains = [...availableDomains].sort(
            (a, b) =>
              (b.metrics.citationFlow || 0) - (a.metrics.citationFlow || 0),
          );
          break;
        case "score":
          sortedDomains = [...availableDomains].sort(
            (a, b) => (b.metrics.score || 0) - (a.metrics.score || 0),
          );
          break;
        case "traffic":
          sortedDomains = [...availableDomains]
            .filter((d) => d.metrics.monthlyTraffic)
            .sort(
              (a, b) =>
                (b.metrics.monthlyTraffic || 0) -
                (a.metrics.monthlyTraffic || 0),
            );
          break;
        case "age":
          sortedDomains = [...availableDomains].sort(
            (a, b) => (b.metrics.age || 0) - (a.metrics.age || 0),
          );
          break;
        case "refDomains":
          sortedDomains = [...availableDomains].sort(
            (a, b) =>
              (b.metrics.referringDomains || 0) -
              (a.metrics.referringDomains || 0),
          );
          break;
        case "authLinks":
          sortedDomains = [...availableDomains].sort(
            (a, b) =>
              (b.metrics.authorityLinksCount || 0) -
              (a.metrics.authorityLinksCount || 0),
          );
          break;
        default:
          sortedDomains = [...availableDomains].sort(
            (a, b) =>
              (b.metrics.domainAuthority || 0) -
              (a.metrics.domainAuthority || 0),
          );
      }

      // Generate chart data with the sorted domains
      const data = generateChartData(sortedDomains, activeTab);
      setChartData(data);

      // Simulate loading delay for smooth transition
      setTimeout(() => {
        setChartLoading(false);
      }, 300);
    };

    if (availableDomains.length > 0) {
      updateChartData();
    }
  }, [activeTab, availableDomains]);

  const fetchDomainDetails = async (domainId: string) => {
    setLoadingDomain(true);
    try {
      const response = await fetch(`/api/domains/${domainId}`);
      const data = await response.json();
      setSelectedDomain(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching domain details:", error);
    } finally {
      setLoadingDomain(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDomain(null), 300);
  };

  const handleAddToCart = (domain: Domain) => {
    if (domain.isSold || !domain.isAvailable) {
      toast({
        title: "Domain Unavailable",
        description: "This domain is no longer available for purchase.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: domain._id,
      name: domain.name,
      price: domain.price,
      domain: domain,
      isSold: domain.isSold,
    });
  };

  const handleBuyNow = (domain: Domain) => {
    if (domain.isSold || !domain.isAvailable) {
      toast({
        title: "Domain Unavailable",
        description: "This domain is no longer available for purchase.",
        variant: "destructive",
      });
      return;
    }

    clearCart();
    addItem({
      id: domain._id,
      name: domain.name,
      price: domain.price,
      domain: domain,
      isSold: domain.isSold,
    });

    if (!user) {
      router.push("/auth/signin?redirect=/checkout");
      return;
    } else {
      router.push("/checkout");
    }
  };

  const topDomains = {
    da: [...availableDomains]
      .sort(
        (a, b) =>
          (b.metrics.domainAuthority || 0) - (a.metrics.domainAuthority || 0),
      )
      .slice(0, 5),
    dr: [...availableDomains]
      .sort((a, b) => (b.metrics.domainRank || 0) - (a.metrics.domainRank || 0))
      .slice(0, 5),
    traffic: [...availableDomains]
      .filter((d) => d.metrics.monthlyTraffic)
      .sort(
        (a, b) =>
          (b.metrics.monthlyTraffic || 0) - (a.metrics.monthlyTraffic || 0),
      )
      .slice(0, 5),
    age: [...availableDomains]
      .sort((a, b) => (b.metrics.age || 0) - (a.metrics.age || 0))
      .slice(0, 5),
    tf: [...availableDomains]
      .sort((a, b) => (b.metrics.trustFlow || 0) - (a.metrics.trustFlow || 0))
      .slice(0, 5),
    cf: [...availableDomains]
      .sort(
        (a, b) => (b.metrics.citationFlow || 0) - (a.metrics.citationFlow || 0),
      )
      .slice(0, 5),
    score: [...availableDomains]
      .sort((a, b) => (b.metrics.score || 0) - (a.metrics.score || 0))
      .slice(0, 5),
    refDomains: [...availableDomains]
      .sort(
        (a, b) =>
          (b.metrics.referringDomains || 0) - (a.metrics.referringDomains || 0),
      )
      .slice(0, 5),
    authLinks: [...availableDomains]
      .sort(
        (a, b) =>
          (b.metrics.authorityLinksCount || 0) -
          (a.metrics.authorityLinksCount || 0),
      )
      .slice(0, 5),
  };

  const hasTrafficData = availableDomains.some(
    (domain) => domain.metrics.monthlyTraffic,
  );

  const getMetricDescription = (metric: string) => {
    switch (metric) {
      case "da":
        return "Highest Domain Authority";
      case "dr":
        return "Highest Domain Rank";
      case "traffic":
        return "Highest Traffic";
      case "age":
        return "Oldest Domains";
      case "tf":
        return "Highest Trust Flow";
      case "cf":
        return "Highest Citation Flow";
      case "score":
        return "Highest Score";
      case "refDomains":
        return "Most Referring Domains";
      case "authLinks":
        return "Most Authority Links";
      default:
        return "";
    }
  };

  const getChartTitle = (metric: string) => {
    switch (metric) {
      case "da":
        return "Domain Authority";
      case "dr":
        return "Domain Rank";
      case "traffic":
        return "Monthly Traffic";
      case "age":
        return "Domain Age";
      case "tf":
        return "Trust Flow";
      case "cf":
        return "Citation Flow";
      case "score":
        return "Score";
      case "refDomains":
        return "Referring Domains";
      case "authLinks":
        return "Authority Links";
      default:
        return "Domain Metrics";
    }
  };

  const renderDomainCard = (domain: Domain, index: number) => (
    <div
      key={domain._id}
      className={`p-0 rounded-lg cursor-pointer transition-all border ${
        selectedDomain?._id === domain._id
          ? "border-[#2BA9B8] bg-[#E6F7F5] dark:border-cyan-400 dark:bg-cyan-900/20"
          : "border-[#2BA9B8]/20 bg-white dark:border-cyan-800/40 dark:bg-cyan-900/30"
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg transition-all ${
          selectedDomain?._id === domain._id
            ? "bg-[#E6F7F5]"
            : "bg-white hover:bg-[#E6F7F5]"
        } dark:border-cyan-800/40 dark:bg-cyan-900/30 dark:hover:bg-cyan-900/40`}
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-[#2BA9B8]/10 flex items-center justify-center text-[#2BA9B8] font-bold dark:bg-cyan-900/50 dark:text-cyan-400">
            {index + 1}
          </div>
          <div>
            <h4 className="font-medium text-black dark:text-white">
              {domain.name}
            </h4>
            <div className="sm:flex hidden sm:flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-black/70 dark:text-cyan-300">
                DA:{" "}
                <span className="font-bold">
                  {domain.metrics.domainAuthority}
                </span>
              </span>
              <span className="text-xs text-black/70 dark:text-blue-300">
                DR:{" "}
                <span className="font-bold">{domain.metrics.domainRank}</span>
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 sm:mt-0 w-full sm:w-auto border border-[#2BA9B8] hover:bg-[#E6F7F5] text-[#2BA9B8] text-sm px-4 py-2 rounded-lg transition-all dark:border-[#53EAFD] dark:bg-cyan-700/60 dark:hover:bg-cyan-700 dark:text-[#53EAFD]"
          onClick={(e) => {
            e.stopPropagation();
            fetchDomainDetails(domain._id);
          }}
        >
          View <ExternalLink className="ml-1 w-3 h-3" />
        </Button>
      </div>

      {selectedDomain?._id === domain._id && (
        <div className="mt-4 pt-4 border-t border-cyan-800/50">
          {!loadingDomain && (
            <div className="p-3">
              {/* Simplified Inline Details for Quick View */}
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Trust Flow</p>
                  <p className="font-bold">
                    {selectedDomain.metrics.trustFlow}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Traffic</p>
                  <p className="font-bold">
                    {selectedDomain.metrics.monthlyTraffic
                      ? selectedDomain.metrics.monthlyTraffic.toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="font-bold text-[#2BA9B8]">
                    ${selectedDomain.price}
                  </p>
                </div>
              </div>
              <Button
                className="w-full bg-[#2BA9B8] text-white"
                onClick={() => handleAddToCart(selectedDomain)}
              >
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 max-w-7xl! mx-auto px-4 md:px-6 dark:from-gray-950 dark:to-cyan-950 dark:bg-gradient-to-br">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-5xl tracking-tight text-[#2BA9B8] dark:bg-gradient-to-r dark:from-cyan-400 dark:to-green-400 dark:text-transparent dark:bg-clip-text">
              Domain Analytics Dashboard
            </h2>
            <p className="mt-2 text-black/70 dark:text-gray-400">
              Discover our premium domains with detailed metrics
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 bg-[#E6F7F5] dark:bg-cyan-900/30" />
            <Skeleton className="h-96 bg-[#E6F7F5] dark:bg-cyan-900/30" />
          </div>
        </div>
      </section>
    );
  }

  if (availableDomains.length === 0) {
    return (
      <section className="py-16 px-4 md:px-6 dark:from-gray-950 dark:to-cyan-950 dark:bg-gradient-to-br">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:bg-gradient-to-r dark:from-cyan-400 dark:to-green-400 dark:text-transparent dark:bg-clip-text mb-4">
            No Available Domains
          </h2>
          <p className="text-black/70 dark:text-gray-400 max-w-2xl mx-auto">
            We're currently updating our inventory. Please check back later for
            our latest available premium domains.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pt-4 px-4 md:py-8   dark:bg-gray-900 ">
        <div className=" mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="sm:text-3xl mt-4 text-2xl md:text-5xl font-bold tracking-tight text-[#2BA9B8] dark:bg-gradient-to-r dark:from-cyan-400 dark:to-green-400 dark:text-transparent dark:bg-clip-text">
              Domain Analytics Dashboard
            </h2>
            <p className="mt-2 text-black/70 dark:text-gray-400">
              Discover our premium domains with detailed metrics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
            {/* Left Side: Chart */}
            <Card className="flex flex-col justify-between h-full border border-[#2BA9B8]/20 bg-white backdrop-blur-sm shadow-sm dark:border-cyan-800/50 dark:bg-cyan-950/30">
              <CardHeader>
                <CardTitle className="mt-4 flex items-center text-black dark:text-white">
                  <div className="w-2 h-5 bg-[#2BA9B8] dark:bg-cyan-400 rounded-full mr-2"></div>
                  {getChartTitle(activeTab)}
                </CardTitle>
                <CardDescription className="text-black/60 dark:text-cyan-300">
                  Top 5 domains by{" "}
                  {getMetricDescription(activeTab).toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center">
                <div className="h-[28rem] sm:h-[28rem] !w-full">
                  {chartLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="h-[26rem] w-full bg-gray-200 dark:bg-cyan-900/30" />
                    </div>
                  ) : (
                    <>
                      {/* Small Screen Chart - Vertical Bar Chart with Horizontal Labels */}
                      <div className="sm:hidden h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            margin={{
                              top: 10,
                              right: 10,
                              left: -20,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#cbd5e1"
                              className="dark:stroke-[#1e4a3e]"
                            />
                            <XAxis
                              dataKey="name"
                              stroke="#111827"
                              tick={{ fontSize: 10 }}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                              className="dark:[&_*]:fill-white  "
                              tickFormatter={(value: string) =>
                                value.length > 6
                                  ? value.slice(0, 6) + "..."
                                  : value
                              }
                            />
                            <YAxis
                              stroke="#111827"
                              className="dark:[&_*]:fill-white  "
                              tick={{ fontSize: 10 }}
                            />
                            <Tooltip
                              cursor={false}
                              contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "0.5rem",
                              }}
                              itemStyle={{ color: "#111827" }}
                              labelStyle={{ color: "#111827" }}
                              formatter={(value) => [
                                value,
                                chartData[0]?.label || "Value",
                              ]}
                            />
                            <Bar
                              dataKey="value"
                              name={chartData[0]?.label || "Value"}
                              fill="#2BA9B8"
                              radius={[4, 4, 0, 0]}
                              barSize={24}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Medium to Large Screen Chart - Vertical Bar Chart */}
                      <div className="hidden sm:block mb-10 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            margin={{
                              top: 20,
                              right: 20,
                              left: 0,
                              bottom: 50,
                            }} // extra bottom margin for vertical labels
                          >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#cbd5e1"
                                className="dark:stroke-[#1e4a3e]"
                              />
                              <XAxis
                                dataKey="name"
                                stroke="#111827"
                                tick={{ fontSize: 10, fill: "#111827" }}
                                angle={-90} // rotate labels 90 degrees (negative for upward rotation)
                                textAnchor="end" // align the text properly
                                interval={0} // show all labels
                                dy={3} // push labels slightly down
                                className="dark:[&_*]:fill-white"
                                tickFormatter={
                                  (name) =>
                                    name.length > 10
                                      ? `${name.slice(0, 8)}...`
                                      : name
                                  // truncate long names
                                }
                              />
                              <YAxis
                                stroke="#111827"
                                tick={{ fontSize: 12, fill: "#111827" }}
                                className="dark:[&_*]:fill-white"
                              />
                              <Tooltip
                                cursor={false}
                                contentStyle={{
                                  backgroundColor: "#ffffff",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: "0.5rem",
                                }}
                                itemStyle={{ color: "#111827" }}
                                labelStyle={{ color: "#111827" }}
                                formatter={(value) => [
                                  value,
                                  chartData[0]?.label || "Value",
                                ]}
                              />
                              <Bar
                                dataKey="value"
                                name={chartData[0]?.label || "Value"}
                                fill="#2BA9B8"
                                radius={[4, 4, 0, 0]}
                                barSize={40} // thin bars
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right Side: Top Domains */}
            <Card className="flex flex-col h-full border px-4 py-2 border-[#2BA9B8]/20 bg-white backdrop-blur-sm shadow-sm dark:border-cyan-800/50 dark:bg-cyan-950/30">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <CardTitle className="flex items-center mt-2 text-black dark:text-white">
                    <div className="w-2 h-5 bg-[#2BA9B8] dark:bg-cyan-400 rounded-full mr-2"></div>
                    Top Domains
                  </CardTitle>

                  {/* Custom Dropdown */}
                  <div className="relative mt-2">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-black bg-white border border-[#2BA9B8]/20 rounded-lg hover:bg-[#E6F7F5] focus:outline-none focus:ring-2 focus:ring-[#2BA9B8] dark:text-cyan-300 dark:bg-cyan-900/50 dark:border-cyan-700 dark:hover:bg-cyan-800/50 dark:focus:ring-cyan-500"
                    >
                      <span className="flex items-center text-xs">
                        {
                          metricOptions.find((opt) => opt.value === activeTab)
                            ?.icon
                        }
                        <span className="ml-2 text-xs">
                          {
                            metricOptions.find((opt) => opt.value === activeTab)
                              ?.label
                          }
                        </span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 ml-2 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 z-10 w-48 mt-1 bg-white border border-[#2BA9B8]/20 rounded-lg shadow-lg dark:bg-cyan-950 dark:border-cyan-800">
                        <div className="py-1">
                          {metricOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setActiveTab(option.value);
                                setIsDropdownOpen(false);
                              }}
                              className={`flex items-center w-full px-4 py-2 text-xs text-left ${
                                activeTab === option.value
                                  ? "text-[#2BA9B8] bg-[#E6F7F5] dark:text-cyan-300 dark:bg-cyan-900/50"
                                  : "text-black hover:bg-[#E6F7F5] dark:text-gray-300 dark:hover:bg-cyan-900/30"
                              }`}
                            >
                              {option.icon}
                              <span className="ml-2 ">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <CardDescription className="text-black/60 dark:text-cyan-300">
                  {getMetricDescription(activeTab)}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  {topDomains[activeTab as keyof typeof topDomains]?.map(
                    (domain, index) => renderDomainCard(domain, index),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Domain Detail Modal */}
      {selectedDomain && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeModal}
        >
          <div
            className={`absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
              isModalOpen ? "opacity-100" : "opacity-0"
            }`}
          ></div>

          <div
            className={`relative bg-white p-6 border border-gray-200 shadow-xl rounded-xl dark:bg-gray-900 dark:border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
              isModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              onClick={closeModal}
            >
              <X className="w-5 h-5" />
            </button>

            {loadingDomain ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedDomain.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedDomain.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Domain Metrics (Cleaned up) */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <div className="w-1.5 h-4 bg-[#2BA9B8] dark:bg-cyan-400 rounded-full mr-2"></div>
                      Domain Metrics
                    </h3>

                    {/* FLAT GRID LAYOUT - NO BOXES */}
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <MetricCard
                        title="Domain Authority"
                        value={selectedDomain.metrics.domainAuthority || 0}
                        max={100}
                        color="cyan"
                        icon={<TrendingUp />}
                      />
                      <MetricCard
                        title="Domain Rank"
                        value={selectedDomain.metrics.domainRank || 0}
                        max={100}
                        color="blue"
                        icon={<BarChart3 />}
                      />
                      <MetricCard
                        title="Trust Flow"
                        value={selectedDomain.metrics.trustFlow || 0}
                        max={100}
                        color="purple"
                        icon={<Shield />}
                      />
                      <MetricCard
                        title="Citation Flow"
                        value={selectedDomain.metrics.citationFlow || 0}
                        max={100}
                        color="orange"
                        icon={<Link />}
                      />
                      <MetricCard
                        title="Domain Age"
                        value={`${selectedDomain.metrics.age || 0} years`}
                        color="pink"
                        icon={<Clock />}
                      />
                      {selectedDomain.metrics.monthlyTraffic && (
                        <MetricCard
                          title="Monthly Traffic"
                          value={selectedDomain.metrics.monthlyTraffic.toLocaleString()}
                          color="teal"
                          icon={<Globe />}
                        />
                      )}
                      {selectedDomain.metrics.score && (
                        <MetricCard
                          title="Score"
                          value={selectedDomain.metrics.score}
                          max={100}
                          color="indigo"
                          icon={<BarChart3 />}
                        />
                      )}
                      {selectedDomain.metrics.referringDomains && (
                        <MetricCard
                          title="Referring Domains"
                          value={selectedDomain.metrics.referringDomains.toLocaleString()}
                          color="teal"
                          icon={<Link />}
                        />
                      )}
                      {selectedDomain.metrics.authorityLinksCount && (
                        <MetricCard
                          title="Authority Links"
                          value={selectedDomain.metrics.authorityLinksCount.toLocaleString()}
                          color="purple"
                          icon={<Shield />}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Column: Pricing & Info (Cleaned up) */}
                  <div>
                    {/* Pricing Section - No Box */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                        Pricing Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            List Price
                          </span>
                          <span className="text-gray-400 line-through">
                            ${selectedDomain.Actualprice}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Discount
                          </span>
                          <span className="text-[#2BA9B8] dark:text-cyan-400 font-medium">
                            {Math.round(
                              (1 -
                                selectedDomain.price /
                                  selectedDomain.Actualprice) *
                                100,
                            )}
                            % OFF
                          </span>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-black dark:text-white">
                            Your Price
                          </span>
                          <span className="text-3xl font-bold text-black dark:text-white">
                            ${selectedDomain.price}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <Button
                            className="flex-1 bg-[#2BA9B8] hover:bg-[#2BA9B8]/90 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white"
                            onClick={() => handleAddToCart(selectedDomain)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            className="flex-1 bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white"
                            onClick={() => handleBuyNow(selectedDomain)}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200 dark:bg-gray-800 mb-8"></div>

                    {/* Info Section - No Box */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                        Domain Industry
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedDomain.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                        Additional Info
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1">
                            Registrar
                          </p>
                          <p className="text-black dark:text-white font-medium">
                            {selectedDomain.registrar || "GoDaddy"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1">
                            Status
                          </p>
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            <span className="text-black dark:text-white font-medium">
                              Available
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Completely redesigned MetricCard - Minimalist, no box
const MetricCard = ({
  title,
  value,
  max = 100,
  color = "cyan",
  icon,
}: {
  title: string;
  value: string | number;
  change?: number;
  max?: number;
  color?: string;
  icon?: React.ReactNode;
}) => {
  // Map color names to text colors
  const colorMap: Record<string, string> = {
    cyan: "text-cyan-600 dark:text-cyan-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    orange: "text-orange-600 dark:text-orange-400",
    pink: "text-pink-600 dark:text-pink-400",
    teal: "text-teal-600 dark:text-teal-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
    red: "text-red-600 dark:text-red-400",
    green: "text-green-600 dark:text-green-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
  };

  const bgMap: Record<string, string> = {
    cyan: "bg-cyan-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    teal: "bg-teal-500",
    indigo: "bg-indigo-500",
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };

  const textColor = colorMap[color] || "text-gray-600";
  const bgColor = bgMap[color] || "bg-gray-500";

  const numericValue =
    typeof value === "string" ? (value === "N/A" ? 0 : parseInt(value)) : value;
  const progress = Math.min(100, Math.max(0, (numericValue / max) * 100));

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center gap-2 text-sm font-medium ${textColor} mb-1`}
      >
        {icon && <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
        <span>{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      {/* Optional minimalist progress bar */}
      {typeof value === "number" && max !== undefined && (
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
          <div
            className={`h-full ${bgColor} rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};
