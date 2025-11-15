'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
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
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/components/providers/cart-provider';
import { useToast } from '@/hooks/use-toast';

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
    let label = '';
    
    switch(metric) {
      case 'da':
        value = domain.metrics.domainAuthority || 0;
        label = 'Domain Authority';
        break;
      case 'dr':
        value = domain.metrics.domainRank || 0;
        label = 'Domain Rank';
        break;
      case 'tf':
        value = domain.metrics.trustFlow || 0;
        label = 'Trust Flow';
        break;
      case 'cf':
        value = domain.metrics.citationFlow || 0;
        label = 'Citation Flow';
        break;
      case 'score':
        value = domain.metrics.score || 0;
        label = 'Score';
        break;
      case 'traffic':
        value = domain.metrics.monthlyTraffic || 0;
        label = 'Monthly Traffic';
        break;
      case 'age':
        value = domain.metrics.age || 0;
        label = 'Domain Age';
        break;
      case 'refDomains':
        value = domain.metrics.referringDomains || 0;
        label = 'Referring Domains';
        break;
      case 'authLinks':
        value = domain.metrics.authorityLinksCount || 0;
        label = 'Authority Links';
        break;
      default:
        value = domain.metrics.domainAuthority || 0;
        label = 'Domain Authority';
    }
    
    return {
      name: domain.name,
      value: value,
      label: label,
      fullName: domain.name
    };
  });
};

// Calculate average metrics for available domains
const calculateAverageMetrics = (domains: Domain[]) => {
  const availableDomains = domains.filter(domain => domain.isAvailable && !domain.isSold);
  
  if (availableDomains.length === 0) return {};
  
  const total = availableDomains.reduce((acc, domain) => ({
    trustFlow: (acc.trustFlow || 0) + (domain.metrics.trustFlow || 0),
    citationFlow: (acc.citationFlow || 0) + (domain.metrics.citationFlow || 0),
    spamScore: (acc.spamScore || 0) + (domain.metrics.spamScore || 0),
    indexedPages: (acc.indexedPages || 0) + (domain.metrics.indexedPages || 0),
    monthlyTraffic: (acc.monthlyTraffic || 0) + (domain.metrics.monthlyTraffic || 0),
    keywords: (acc.keywords || 0) + (domain.metrics.keywords || 0),
    domainAuthority: (acc.domainAuthority || 0) + (domain.metrics.domainAuthority || 0),
    domainRank: (acc.domainRank || 0) + (domain.metrics.domainRank || 0),
    age: (acc.age || 0) + (domain.metrics.age || 0),
    score: (acc.score || 0) + (domain.metrics.score || 0),
    referringDomains: (acc.referringDomains || 0) + (domain.metrics.referringDomains || 0),
    authorityLinksCount: (acc.authorityLinksCount || 0) + (domain.metrics.authorityLinksCount || 0),
    count: acc.count + 1
  }), { count: 0 });

  return {
    trustFlow: Math.round(total.trustFlow / total.count),
    citationFlow: Math.round(total.citationFlow / total.count),
    spamScore: (total.spamScore / total.count).toFixed(1),
    indexedPages: Math.round(total.indexedPages / total.count).toLocaleString(),
    monthlyTraffic: (total.monthlyTraffic / total.count) > 1000 
      ? `${((total.monthlyTraffic / total.count) / 1000).toFixed(1)}K` 
      : Math.round(total.monthlyTraffic / total.count),
    keywords: (total.keywords / total.count).toLocaleString(),
    domainAuthority: Math.round(total.domainAuthority / total.count),
    domainRank: Math.round(total.domainRank / total.count),
    age: Math.round(total.age / total.count),
    score: Math.round(total.score / total.count),
    referringDomains: Math.round(total.referringDomains / total.count),
    authorityLinksCount: Math.round(total.authorityLinksCount / total.count)
  };
};

// Metric options for dropdown
const metricOptions = [
  { value: 'da', label: 'Domain Authority', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'dr', label: 'Domain Rank', icon: <BarChart3 className="w-4 h-4" /> },
  { value: 'tf', label: 'Trust Flow', icon: <Shield className="w-4 h-4" /> },
  { value: 'cf', label: 'Citation Flow', icon: <Link className="w-4 h-4" /> },
  { value: 'score', label: 'Score', icon: <BarChart3 className="w-4 h-4" /> },
  { value: 'traffic', label: 'Monthly Traffic', icon: <Globe className="w-4 h-4" /> },
  { value: 'age', label: 'Domain Age', icon: <Clock className="w-4 h-4" /> },
  { value: 'refDomains', label: 'Referring Domains', icon: <Link className="w-4 h-4" /> },
  { value: 'authLinks', label: 'Authority Links', icon: <Shield className="w-4 h-4" /> }
];

export function TopDomainsSection() {
  const [allDomains, setAllDomains] = useState<Domain[]>([]);
  const [availableDomains, setAvailableDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [loadingDomain, setLoadingDomain] = useState(false);
  const [activeTab, setActiveTab] = useState('da');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { addItem, clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch('/api/domains');
        const data = await response.json();
        setAllDomains(data);
      } catch (error) {
        console.error('Error fetching domains:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  useEffect(() => {
    const filtered = allDomains.filter(domain => domain.isAvailable && !domain.isSold);
    setAvailableDomains(filtered);
  }, [allDomains]);

  useEffect(() => {
    // Update chart data when active tab changes
    const updateChartData = () => {
      setChartLoading(true);
      
      // Get the sorted domains for the active tab
      let sortedDomains: Domain[] = [];
      
      switch(activeTab) {
        case 'da':
          sortedDomains = [...availableDomains].sort((a, b) => (b.metrics.domainAuthority || 0) - (a.metrics.domainAuthority || 0));
          break;
        case 'dr':
          sortedDomains = [...availableDomains].sort((a, b) => (b.metrics.domainRank || 0) - (a.metrics.domainRank || 0));
          break;
        case 'tf':
          sortedDomains = [...availableDomains].sort((a, b) => (b.metrics.trustFlow || 0) - (a.metrics.trustFlow || 0));
          break;
        case 'cf':
          sortedDomains = [...availableDomains].sort((a, b) => (b.metrics.citationFlow || 0) - (a.metrics.citationFlow || 0));
          break;
        case 'score':
          sortedDomains = [...availableDomains].sort((a, b) => (b.metrics.score || 0) - (a.metrics.score || 0));
          break;
        case 'traffic':
          sortedDomains = [...availableDomains].filter(d => d.metrics.monthlyTraffic).sort((a, b) => (b.metrics.monthlyTraffic || 0) - (a.metrics.monthlyTraffic || 0));
          break;
        case 'age':
          sortedDomains = [...availableDomains].sort((a, b) => (b.metrics.age || 0) - (a.metrics.age || 0));
          break;
        case 'refDomains':
          sortedDomains = [...availableDomains].sort((a, b) => (b.metrics.referringDomains || 0) - (a.metrics.referringDomains || 0));
          break;
        case 'authLinks':
          sortedDomains = [...availableDomains].sort((a, b) => (b.metrics.authorityLinksCount || 0) - (a.metrics.authorityLinksCount || 0));
          break;
        default:
          sortedDomains = [...availableDomains].sort((a, b) => (b.metrics.domainAuthority || 0) - (a.metrics.domainAuthority || 0));
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
      console.error('Error fetching domain details:', error);
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
    
    toast({
      title: "Added to Cart",
      description: `${domain.name} has been added to your cart.`,
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
    
    toast({
      title: "Added to Cart",
      description: `${domain.name} has been added to your cart. Redirecting to checkout...`,
    });
    
    if (!user) {
      router.push("/auth/signin?redirect=/checkout");
      return;
    } else {
      router.push("/checkout");
    }
  };

  const topDomains = {
    da: [...availableDomains].sort((a, b) => (b.metrics.domainAuthority || 0) - (a.metrics.domainAuthority || 0)).slice(0, 5),
    dr: [...availableDomains].sort((a, b) => (b.metrics.domainRank || 0) - (a.metrics.domainRank || 0)).slice(0, 5),
    traffic: [...availableDomains].filter(d => d.metrics.monthlyTraffic).sort((a, b) => (b.metrics.monthlyTraffic || 0) - (a.metrics.monthlyTraffic || 0)).slice(0, 5),
    age: [...availableDomains].sort((a, b) => (b.metrics.age || 0) - (a.metrics.age || 0)).slice(0, 5),
    tf: [...availableDomains].sort((a, b) => (b.metrics.trustFlow || 0) - (a.metrics.trustFlow || 0)).slice(0, 5),
    cf: [...availableDomains].sort((a, b) => (b.metrics.citationFlow || 0) - (a.metrics.citationFlow || 0)).slice(0, 5),
    score: [...availableDomains].sort((a, b) => (b.metrics.score || 0) - (a.metrics.score || 0)).slice(0, 5),
    refDomains: [...availableDomains].sort((a, b) => (b.metrics.referringDomains || 0) - (a.metrics.referringDomains || 0)).slice(0, 5),
    authLinks: [...availableDomains].sort((a, b) => (b.metrics.authorityLinksCount || 0) - (a.metrics.authorityLinksCount || 0)).slice(0, 5)
  };
  
  const hasTrafficData = availableDomains.some(domain => domain.metrics.monthlyTraffic);
  const hasRefDomains = availableDomains.some(domain => domain.metrics.referringDomains);
  const hasAuthLinks = availableDomains.some(domain => domain.metrics.authorityLinksCount);

  const averageMetrics = calculateAverageMetrics(availableDomains);

  const getTrendIcon = (value: number) => {
    return value > 0 ? (
      <ArrowUp className="w-4 h-4 text-green-400 inline" />
    ) : (
      <ArrowDown className="w-4 h-4 text-red-400 inline" />
    );
  };

  const getMetricDescription = (metric: string) => {
    switch(metric) {
      case 'da': return 'Highest Domain Authority';
      case 'dr': return 'Highest Domain Rank';
      case 'traffic': return 'Highest Traffic';
      case 'age': return 'Oldest Domains';
      case 'tf': return 'Highest Trust Flow';
      case 'cf': return 'Highest Citation Flow';
      case 'score': return 'Highest Score';
      case 'refDomains': return 'Most Referring Domains';
      case 'authLinks': return 'Most Authority Links';
      default: return '';
    }
  };

  const getChartTitle = (metric: string) => {
    switch(metric) {
      case 'da': return 'Domain Authority';
      case 'dr': return 'Domain Rank';
      case 'traffic': return 'Monthly Traffic';
      case 'age': return 'Domain Age';
      case 'tf': return 'Trust Flow';
      case 'cf': return 'Citation Flow';
      case 'score': return 'Score';
      case 'refDomains': return 'Referring Domains';
      case 'authLinks': return 'Authority Links';
      default: return 'Domain Metrics';
    }
  };

  const renderDomainCard = (domain: Domain, index: number) => (
    <div 
      key={domain._id} 
      className={`p-0 rounded-lg cursor-pointer transition-all  ${selectedDomain?._id === domain._id ? 'border-cyan-400 bg-cyan-900/20' : ''}`}
    >
      <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border border-cyan-800/40 rounded-lg bg-cyan-900/30 hover:bg-cyan-900/40 transition-all">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold">
            {index + 1}
          </div>
          <div>
            <h4 className="font-medium text-white">{domain.name}</h4>
            <div className="sm:flex hidden sm:flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-cyan-300">DA: <span className="font-bold">{domain.metrics.domainAuthority}</span></span>
              <span className="text-xs text-blue-300">DR: <span className="font-bold">{domain.metrics.domainRank}</span></span>
              <span className="text-xs text-pink-300">Age: <span className="font-bold">{domain.metrics.age}y</span></span>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 sm:mt-0 w-full sm:w-auto border border-[#53EAFD] bg-cyan-700/60 hover:bg-cyan-700 text-[#53EAFD] text-sm px-4 py-2 rounded-lg transition-all"
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
          {loadingDomain ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full bg-cyan-900/30" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-16 bg-cyan-900/30" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-cyan-900/30 p-3 rounded-lg">
                  <p className="text-xs text-cyan-300">Trust Flow</p>
                  <p className="text-xl font-bold text-white">{selectedDomain.metrics.trustFlow || 'N/A'}</p>
                </div>
                <div className="bg-cyan-900/30 p-3 rounded-lg">
                  <p className="text-xs text-cyan-300">Citation Flow</p>
                  <p className="text-xl font-bold text-white">{selectedDomain.metrics.citationFlow || 'N/A'}</p>
                </div>
                <div className="bg-cyan-900/30 p-3 rounded-lg">
                  <p className="text-xs text-cyan-300">Organic Traffic</p>
                  <p className="text-xl font-bold text-white">
                    {selectedDomain.metrics.monthlyTraffic ? selectedDomain.metrics.monthlyTraffic.toLocaleString() : 'N/A'}
                  </p>
                    </div>
               
                             </div>
              <div className="mt-3 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="text-lg font-bold text-white">
                    ${selectedDomain.price} <span className="text-sm line-through text-gray-500">${selectedDomain.Actualprice}</span>
                  </p>
                </div>
                <Button 
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  onClick={() => handleAddToCart(selectedDomain)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-gray-950 to-cyan-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-green-400 text-transparent bg-clip-text">
              Domain Analytics Dashboard
            </h2>
            <p className="mt-2 text-gray-400">Discover our premium domains with detailed metrics</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-xl bg-cyan-900/30" />
            <Skeleton className="h-96 rounded-xl bg-cyan-900/30" />
          </div>
        </div>
      </section>
    );
  }

  if (availableDomains.length === 0) {
    return (
      <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-gray-950 to-cyan-950">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-green-400 text-transparent bg-clip-text mb-4">
            No Available Domains
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're currently updating our inventory. Please check back later for our latest available premium domains.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pt-16 px-4 md:px-6 bg-gradient-to-br from-gray-950 to-cyan-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-green-400 text-transparent bg-clip-text">
              Domain Analytics Dashboard
            </h2>
            <p className="mt-2 text-gray-400">Discover our premium domains with detailed metrics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
  {/* Left Side: Chart */}
  <Card className="flex flex-col justify-between border border-cyan-800/50 bg-cyan-950/30 backdrop-blur-sm h-full">
    <CardHeader>
      <CardTitle className="text-white mt-4 flex items-center">
        <div className="w-2 h-5 bg-cyan-400 rounded-full mr-2"></div>
        {getChartTitle(activeTab)} Metrics
      </CardTitle>
      <CardDescription className="text-cyan-300">
        Top 5 domains by {getMetricDescription(activeTab).toLowerCase()}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-1 flex items-center">
  <div className="h-[28rem]  !w-full"> {/* Increased height from h-80 to 28rem */}
    {chartLoading ? (
      <div className="flex items-center justify-center h-full">
        <Skeleton className="h-[26rem] w-full bg-cyan-900/30" />
      </div>
    ) : (
      <div className="w-[120%] sm:w-full  ms-[-3rem] sm:ms-0 h-full">
  <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e4a3e" />
          <XAxis
            dataKey="name"
            stroke="#33BDC7"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#33BDC7"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(6, 95, 70, 0.9)',
              border: '1px solid rgba(51, 189, 199, 0.3)',
              borderRadius: '0.5rem',
            }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#33BDC7' }}
            formatter={(value) => [value, chartData[0]?.label || 'Value']}
          />
          <Bar
            dataKey="value"
            name={chartData[0]?.label || 'Value'}
            fill="#36C374"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      </div>
    )}
  </div>
</CardContent>

  </Card>

  {/* Right Side: Top Domains */}
  <Card className="flex flex-col border border-cyan-800/50 bg-cyan-950/30 backdrop-blur-sm h-full">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-white flex items-center">
          <div className="w-2 h-5 bg-cyan-400 rounded-full mr-2"></div>
          Top Domains
        </CardTitle>

        {/* Custom Dropdown */}
        <div className="relative mt-2">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-cyan-300 bg-cyan-900/50 border border-cyan-700 rounded-lg hover:bg-cyan-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <span className="flex items-center">
              {metricOptions.find(opt => opt.value === activeTab)?.icon}
              <span className="ml-2">
                {metricOptions.find(opt => opt.value === activeTab)?.label}
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 z-10 w-48 mt-1 bg-cyan-950 border border-cyan-800 rounded-lg shadow-lg">
              <div className="py-1">
                {metricOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setActiveTab(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                      activeTab === option.value
                        ? 'text-cyan-300 bg-cyan-900/50'
                        : 'text-gray-300 hover:bg-cyan-900/30'
                    }`}
                  >
                    {option.icon}
                    <span className="ml-2">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <CardDescription className="text-cyan-300">
        {getMetricDescription(activeTab)}
      </CardDescription>
    </CardHeader>

    <CardContent className="flex-1 overflow-y-auto">
      <div className="space-y-3 pr-2">
        {activeTab === 'da' && topDomains.da.map((domain, index) => renderDomainCard(domain, index))}
        {activeTab === 'dr' && topDomains.dr.map((domain, index) => renderDomainCard(domain, index))}
        {activeTab === 'tf' && topDomains.tf.map((domain, index) => renderDomainCard(domain, index))}
        {activeTab === 'cf' && topDomains.cf.map((domain, index) => renderDomainCard(domain, index))}
        {activeTab === 'score' && topDomains.score.map((domain, index) => renderDomainCard(domain, index))}
        {activeTab === 'refDomains' && topDomains.refDomains.map((domain, index) => renderDomainCard(domain, index))}
        {activeTab === 'authLinks' && topDomains.authLinks.map((domain, index) => renderDomainCard(domain, index))}
        {activeTab === 'traffic' && hasTrafficData && topDomains.traffic.map((domain, index) => renderDomainCard(domain, index))}
        {activeTab === 'age' && topDomains.age.map((domain, index) => renderDomainCard(domain, index))}
      </div>
    </CardContent>
  </Card>
</div>


      
        </div>
      </section>

      {/* Domain Detail Modal */}
      {selectedDomain && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={closeModal}
        >
          <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}></div>
          
          <div 
            className={`relative bg-gradient-to-br from-cyan-950 to-gray-950 rounded-xl p-6 border border-cyan-800/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 p-2 rounded-full bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/50 transition-colors"
              onClick={closeModal}
            >
              <X className="w-5 h-5" />
            </button>
            
            {loadingDomain ? (
              <div className="space-y-6">
                <Skeleton className="h-10 w-64 bg-cyan-900/30" />
                <Skeleton className="h-6 w-full bg-cyan-900/30" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-40 bg-cyan-900/30" />
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-24 bg-cyan-900/30" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <Skeleton className="h-48 bg-cyan-900/30" />
                    <Skeleton className="h-48 bg-cyan-900/30" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedDomain.name}</h2>
                    <p className="text-cyan-300">{selectedDomain.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <div className="w-1.5 h-4 bg-cyan-400 rounded-full mr-2"></div>
                      Domain Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard 
                        title="Domain Authority" 
                        value={selectedDomain.metrics.domainAuthority || 0} 
                        change={2.5} 
                        max={100}
                        color="cyan"
                        icon={<TrendingUp className="w-4 h-4" />}
                      />
                      <MetricCard 
                        title="Domain Rank" 
                        value={selectedDomain.metrics.domainRank || 0} 
                        change={3.1} 
                        max={100}
                        color="blue"
                        icon={<BarChart3 className="w-4 h-4" />}
                      />
                      <MetricCard 
                        title="Trust Flow" 
                        value={selectedDomain.metrics.trustFlow || 0} 
                        change={1.8} 
                        max={100}
                        color="purple"
                        icon={<Shield className="w-4 h-4" />}
                      />
                      <MetricCard 
                        title="Citation Flow" 
                        value={selectedDomain.metrics.citationFlow || 0} 
                        change={2.2} 
                        max={100}
                        color="orange"
                        icon={<Link className="w-4 h-4" />}
                      />
                      <MetricCard 
                        title="Domain Age" 
                        value={`${selectedDomain.metrics.age || 0} years`} 
                        change={0} 
                        color="pink"
                        icon={<Clock className="w-4 h-4" />}
                      />
                      {selectedDomain.metrics.monthlyTraffic && (
                        <MetricCard 
                          title="Monthly Traffic" 
                          value={selectedDomain.metrics.monthlyTraffic.toLocaleString()} 
                          change={4.1} 
                          color="teal"
                          icon={<Globe className="w-4 h-4" />}
                        />
                      )}
                   
                    
                      {selectedDomain.metrics.score && (
                        <MetricCard 
                          title="Score" 
                          value={selectedDomain.metrics.score} 
                          change={3.5} 
                          max={100}
                          color="indigo"
                          icon={<BarChart3 className="w-4 h-4" />}
                        />
                      )}
                      {selectedDomain.metrics.referringDomains && (
                        <MetricCard 
                          title="Referring Domains" 
                          value={selectedDomain.metrics.referringDomains.toLocaleString()} 
                          change={4.2} 
                          color="teal"
                          icon={<Link className="w-4 h-4" />}
                        />
                      )}
                      {selectedDomain.metrics.authorityLinksCount && (
                        <MetricCard 
                          title="Authority Links" 
                          value={selectedDomain.metrics.authorityLinksCount.toLocaleString()} 
                          change={3.7} 
                          color="purple"
                          icon={<Shield className="w-4 h-4" />}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-cyan-900/20 border border-cyan-800/50 rounded-xl p-6 mb-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Pricing Details</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">List Price</span>
                          <span className="text-gray-300 line-through">${selectedDomain.Actualprice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Discount</span>
                          <span className="text-cyan-400">
                            {Math.round((1 - selectedDomain.price / selectedDomain.Actualprice) * 100)}% OFF
                          </span>
                        </div>
                        <div className="h-px bg-cyan-800/50 my-2"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-white">Your Price</span>
                          <span className="text-3xl font-bold text-white">${selectedDomain.price}</span>
                        </div>
                        <div className="flex space-x-3 mt-6">
                          <Button 
                            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                            onClick={() => handleAddToCart(selectedDomain)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                          <Button 
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleBuyNow(selectedDomain)}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-cyan-900/20 border border-cyan-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Domain Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDomain.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            className="bg-cyan-800/50 text-cyan-300 hover:bg-cyan-700/50 border-cyan-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Additional Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Registrar</p>
                            <p className="text-white">{selectedDomain.registrar || 'GoDaddy'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Status</p>
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></span>
                              <span className="text-white">Available</span>
                            </div>
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

// Helper component for metric cards
const MetricCard = ({ 
  title, 
  value, 
  change, 
  max = 100, 
  color = 'cyan',
  icon
}: { 
  title: string; 
  value: string | number; 
  change?: number; 
  max?: number;
  color?: string;
  icon?: React.ReactNode;
}) => {
  const getColorClass = () => {
    switch(color) {
      case 'cyan': return 'bg-cyan-900/30 border-cyan-700';
      case 'blue': return 'bg-blue-900/30 border-blue-700';
      case 'purple': return 'bg-purple-900/30 border-purple-700';
      case 'teal': return 'bg-teal-900/30 border-teal-700';
      case 'orange': return 'bg-orange-900/30 border-orange-700';
      case 'pink': return 'bg-pink-900/30 border-pink-700';
      case 'red': return 'bg-red-900/30 border-red-700';
      case 'green': return 'bg-green-900/30 border-green-700';
      case 'yellow': return 'bg-yellow-900/30 border-yellow-700';
      case 'indigo': return 'bg-indigo-900/30 border-indigo-700';
      default: return 'bg-cyan-900/30 border-cyan-700';
    }
  };

  const getProgressColor = () => {
    switch(color) {
      case 'cyan': return 'bg-gradient-to-r from-cyan-500 to-cyan-400';
      case 'blue': return 'bg-gradient-to-r from-blue-500 to-blue-400';
      case 'purple': return 'bg-gradient-to-r from-purple-500 to-purple-400';
      case 'teal': return 'bg-gradient-to-r from-teal-500 to-teal-400';
      case 'orange': return 'bg-gradient-to-r from-orange-500 to-orange-400';
      case 'pink': return 'bg-gradient-to-r from-pink-500 to-pink-400';
      case 'red': return 'bg-gradient-to-r from-red-500 to-red-400';
      case 'green': return 'bg-gradient-to-r from-green-500 to-green-400';
      case 'yellow': return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
      case 'indigo': return 'bg-gradient-to-r from-indigo-500 to-indigo-400';
      default: return 'bg-gradient-to-r from-cyan-500 to-cyan-400';
    }
  };

  const numericValue = typeof value === 'string' ? 
    (value === 'N/A' ? 0 : parseInt(value) || 0) : 
    value;
  const progress = Math.min(100, Math.max(0, (numericValue / max) * 100));

  return (
    <div className={`${getColorClass()} p-3 rounded-lg border`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-cyan-300 flex items-center">
          {icon && <span className="mr-1">{icon}</span>}
          {title}
        </p>
      
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      {typeof value === 'number' && max !== undefined && (
        <div className="mt-2 h-1.5 w-full bg-cyan-900/50 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};