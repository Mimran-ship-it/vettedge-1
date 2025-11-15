'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, ExternalLink, X, ShoppingCart } from 'lucide-react';
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
  };
  tags: string[];
  image: string[];
  createdAt: string;
  registrar?: string;
  isAvailable: boolean;
  isSold: boolean;
};

// Generate chart data based on available domains
const generateChartData = (domains: Domain[]) => {
  // Filter out sold or unavailable domains before processing
  const availableDomains = domains.filter(domain => domain.isAvailable && !domain.isSold);
  
  if (availableDomains.length === 0) return [];
  
  // Sort domains by creation date or another relevant metric
  const sortedDomains = [...availableDomains].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  // Take the first 6 domains for the chart or all if less than 6
  const sampleDomains = sortedDomains.slice(0, 6);
  
  return sampleDomains.map((domain, index) => ({
    name: domain.name,
    da: domain.metrics.domainAuthority || 0,
    dr: domain.metrics.domainRank || 0,
    fullName: domain.name
  }));
};

// Calculate average metrics for available domains
const calculateAverageMetrics = (domains: Domain[]) => {
  // Only include available and not sold domains in the calculation
  const availableDomains = domains.filter(domain => domain.isAvailable && !domain.isSold);
  
  if (availableDomains.length === 0) return {};
  
  const total = availableDomains.reduce((acc, domain) => ({
    trustFlow: (acc.trustFlow || 0) + (domain.metrics.trustFlow || 0),
    citationFlow: (acc.citationFlow || 0) + (domain.metrics.citationFlow || 0),
    spamScore: (acc.spamScore || 0) + (domain.metrics.spamScore || 0),
    indexedPages: (acc.indexedPages || 0) + (domain.metrics.indexedPages || 0),
    monthlyTraffic: (acc.monthlyTraffic || 0) + (domain.metrics.monthlyTraffic || 0),
    keywords: (acc.keywords || 0) + (domain.metrics.keywords || 0),
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
    keywords: (total.keywords / total.count).toLocaleString()
  };
};

export function TopDomainsSection() {
  const [allDomains, setAllDomains] = useState<Domain[]>([]);
  const [availableDomains, setAvailableDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [loadingDomain, setLoadingDomain] = useState(false);
  const [activeTab, setActiveTab] = useState('da');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Function to fetch a specific domain's details
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

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDomain(null), 300); // Wait for animation to complete
  };

  // Function to add domain to cart
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

  // Function to handle buy now
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

  // Filter out sold or unavailable domains
  useEffect(() => {
    const filtered = allDomains.filter(domain => domain.isAvailable && !domain.isSold);
    setAvailableDomains(filtered);
  }, [allDomains]);

  // Sort functions for different categories
  const sortByDA = (a: Domain, b: Domain) => (b.metrics.domainAuthority || 0) - (a.metrics.domainAuthority || 0);
  const sortByDR = (a: Domain, b: Domain) => (b.metrics.domainRank || 0) - (a.metrics.domainRank || 0);
  const sortByTraffic = (a: Domain, b: Domain) => 
    (b.metrics.monthlyTraffic || 0) - (a.metrics.monthlyTraffic || 0);
  const sortByAge = (a: Domain, b: Domain) => (b.metrics.age || 0) - (a.metrics.age || 0);
  const sortByTF = (a: Domain, b: Domain) => (b.metrics.trustFlow || 0) - (a.metrics.trustFlow || 0);
  const sortByCF = (a: Domain, b: Domain) => (b.metrics.citationFlow || 0) - (a.metrics.citationFlow || 0);

  // Get top domains for each category, only including available ones
  const topDomains = {
    da: [...availableDomains].sort(sortByDA).slice(0, 5),
    dr: [...availableDomains].sort(sortByDR).slice(0, 5),
    traffic: [...availableDomains].filter(d => d.metrics.monthlyTraffic).sort(sortByTraffic).slice(0, 5),
    age: [...availableDomains].sort(sortByAge).slice(0, 5),
    tf: [...availableDomains].sort(sortByTF).slice(0, 5),
    cf: [...availableDomains].sort(sortByCF).slice(0, 5),
  };
  
  // Check if we have any domains with traffic data
  const hasTrafficData = availableDomains.some(domain => domain.metrics.monthlyTraffic);

  const chartData = generateChartData(availableDomains);
  const averageMetrics = calculateAverageMetrics(availableDomains);

  // Generate random trends for demo purposes (in a real app, this would come from historical data)
  const getRandomTrend = () => (Math.random() > 0.5 ? 'up' : 'down');
  const getRandomChange = () => (Math.random() * 5).toFixed(1);

  const getTrendIcon = (value: number) => {
    return value > 0 ? (
      <ArrowUp className="w-4 h-4 text-green-400 inline" />
    ) : (
      <ArrowDown className="w-4 h-4 text-red-400 inline" />
    );
  };

  const renderDomainCard = (domain: Domain, index: number) => (
    <div 
      key={domain._id} 
      className={`p-3 sm:p-4 cursor-pointer transition-all mb-3 border border-cyan-900/50 bg-cyan-950/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 ${selectedDomain?._id === domain._id ? 'border-cyan-400 bg-cyan-900/20' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold">
            {index + 1}
          </div>
          <div>
            <h4 className="font-medium text-white">{domain.name}</h4>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-xs text-cyan-300">DA: <span className="font-bold">{domain.metrics.domainAuthority}</span></span>
              <span className="text-xs text-blue-300">DR: <span className="font-bold">{domain.metrics.domainRank}</span></span>
              <span className="text-xs text-purple-300">Age: <span className="font-bold">{domain.metrics.age}y</span></span>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-cyan-600/20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 hover:text-white transition-colors w-full sm:w-auto mt-2 sm:mt-0"
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
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 bg-cyan-900/30" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-cyan-900/30 p-3 ">
                  <p className="text-xs text-cyan-300">Trust Flow</p>
                  <p className="text-xl font-bold text-white">{selectedDomain.metrics.trustFlow}</p>
                  <p className="text-xs text-cyan-400">{getTrendIcon(1)} 2.5%</p>
                </div>
                <div className="bg-cyan-900/30 p-3 ">
                  <p className="text-xs text-cyan-300">Citation Flow</p>
                  <p className="text-xl font-bold text-white">{selectedDomain.metrics.citationFlow}</p>
                  <p className="text-xs text-cyan-400">{getTrendIcon(1)} 1.8%</p>
                </div>
                <div className="bg-cyan-900/30 p-3 ">
                  <p className="text-xs text-cyan-300">Organic Traffic</p>
                  {selectedDomain.metrics.monthlyTraffic&&<p className="text-xl font-bold text-white">
                    {selectedDomain.metrics.monthlyTraffic ? selectedDomain.metrics.monthlyTraffic.toLocaleString() : 'N/A'}
                  </p>}
                  <p className="text-xs text-cyan-400">{getTrendIcon(1)} 3.2%</p>
                </div>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
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
            <Skeleton className="h-96  bg-cyan-900/30" />
            <Skeleton className="h-96  bg-cyan-900/30" />
          </div>
        </div>
      </section>
    );
  }

  // If no available domains, show a message
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
      <section className="py-16 px-2 md:px-16 lg:px-24 bg-gradient-to-br from-gray-950 to-cyan-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-green-400 text-transparent bg-clip-text">
              Domain Analytics Dashboard
            </h2>
            <p className="mt-2 text-gray-400">Discover our premium domains with detailed metrics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  mb-4 lg:mb-8">
            {/* Left Side: Chart */}
            <Card className="border border-cyan-800/50 pt-4 lg:pt-16 bg-cyan-950/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center">
                  <div className="w-2 h-5 bg-cyan-400 rounded-full mr-2"></div>
                  Domain Authority Metrics
                </CardTitle>
                <CardDescription className="text-cyan-300">
                  Growth trends over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-0 lg:p-6">
                <div className="h-72 md:h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e4a3e" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#33BDC7" 
                        tick={{ fontSize: 12 }}
                        padding={{ left: 0, right: 0 }}
                        tickMargin={6}
                      />
                      <YAxis 
                        stroke="#33BDC7"
                        tick={{ fontSize: 12 }}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(6, 95, 70, 0.9)',
                          border: '1px solid rgba(51, 189, 199, 0.3)',
                          borderRadius: '0.5rem',
                        }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#33BDC7' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="da" 
                        name="Domain Authority"
                        stroke="#36C374" 
                        strokeWidth={2}
                        dot={{ fill: '#36C374', r: 4 }}
                        activeDot={{ r: 6, fill: '#36C374' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="dr" 
                        name="Domain Rating"
                        stroke="#33BDC7" 
                        strokeWidth={2}
                        dot={{ fill: '#33BDC7', r: 4 }}
                        activeDot={{ r: 6, fill: '#33BDC7' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Right Side: Top Domains */}
            <Card className="border border-cyan-800/50 pt-8 bg-cyan-950/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <div className="w-2 h-5 bg-cyan-400  mr-2"></div>
                    Top Domains
                  </div>
                  <Tabs 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="bg-cyan-900/50 border border-cyan-800/50 p-1 h-auto flex gap-1 overflow-x-auto whitespace-nowrap ">
                      <TabsTrigger 
                        value="da" 
                        className="px-3 py-1 text-xs shrink-0 data-[state=active]:bg-cyan-600/50 data-[state=active]:text-white"
                      >
                        DA
                      </TabsTrigger>
                      <TabsTrigger 
                        value="dr" 
                        className="px-3 py-1 text-xs shrink-0 data-[state=active]:bg-cyan-600/50 data-[state=active]:text-white"
                      >
                        DR
                      </TabsTrigger>
                      {hasTrafficData && (
                        <TabsTrigger 
                          value="traffic" 
                          className="px-3 py-1 text-xs shrink-0 data-[state=active]:bg-cyan-600/50 data-[state=active]:text-white"
                        >
                          Traffic
                        </TabsTrigger>
                      )}
                      <TabsTrigger 
                        value="age" 
                        className="px-3 py-1 text-xs shrink-0 data-[state=active]:bg-cyan-600/50 data-[state=active]:text-white"
                      >
                        Age
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <CardDescription className="text-cyan-300">
                  {activeTab === 'da' && 'Highest Domain Authority'}
                  {activeTab === 'dr' && 'Highest Domain Rating'}
                  {activeTab === 'traffic' && 'Highest Traffic'}
                  {activeTab === 'age' && 'Oldest Domains'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-2 sm:p-4">
                <div className={`space-y-3 pr-1 sm:pr-2`}>
                  {activeTab === 'da' && topDomains.da.map((domain, index) => renderDomainCard(domain, index))}
                  {activeTab === 'dr' && topDomains.dr.map((domain, index) => renderDomainCard(domain, index))}
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
          {/* Backdrop */}
          <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}></div>
          
          {/* Modal Content */}
          <div 
            className={`relative bg-gradient-to-br from-cyan-950 to-gray-950  p-6 border border-cyan-800/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
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
                      <div className="w-1.5 h-4 bg-cyan-400 rounde d-full mr-2"></div>
                      Domain Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard 
                        title="Domain Authority" 
                        value={selectedDomain.metrics.domainAuthority} 
                        change={2.5} 
                        max={100}
                        color="cyan"
                      />
                      <MetricCard 
                        title="Domain Rank" 
                        value={selectedDomain.metrics.domainRank} 
                        change={3.1} 
                        max={100}
                        color="blue"
                      />
                      <MetricCard 
                        title="Trust Flow" 
                        value={selectedDomain.metrics.trustFlow} 
                        change={1.8} 
                        max={100}
                        color="cyan"
                      />
                      <MetricCard 
                        title="Citation Flow" 
                        value={selectedDomain.metrics.citationFlow} 
                        change={2.2} 
                        max={100}
                        color="blue"
                      />
                      <MetricCard 
                        title="Domain Age" 
                        value={`${selectedDomain.metrics.age} years`} 
                        change={0} 
                        color="purple"
                      />
                      {selectedDomain.metrics.monthlyTraffic&&<MetricCard 
                        title="Monthly Traffic" 
                        value={selectedDomain.metrics.monthlyTraffic ? selectedDomain.metrics.monthlyTraffic.toLocaleString() : 'N/A'} 
                        change={4.1} 
                        color="teal"
                      />}
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-cyan-900/20 border border-cyan-800/50  p-6 mb-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Pricing Details</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">List Price</span>
                          <span className="text-gray-300 line-through">${selectedDomain.Actualprice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Discount</span>
                          <span className="text-cyan-400">{Math.round((1 - selectedDomain.price / selectedDomain.Actualprice) * 100)}% OFF</span>
                        </div>
                        <div className="h-px bg-cyan-800/50 my-2"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-white">Your Price</span>
                          <span className="text-3xl font-bold text-white">${selectedDomain.price}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
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
                    
                    <div className="bg-cyan-900/20 border border-cyan-800/50  p-6">
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
const MetricCard = ({ title, value, change, max = 100, color = 'cyan' }: { 
  title: string; 
  value: string | number; 
  change?: number; 
  max?: number;
  color?: string;
}) => {
  const getColorClass = () => {
    switch(color) {
      case 'cyan': return 'bg-cyan-900/30 border-cyan-700';
      case 'blue': return 'bg-blue-900/30 border-blue-700';
      case 'purple': return 'bg-purple-900/30 border-purple-700';
      case 'teal': return 'bg-teal-900/30 border-teal-700';
      default: return 'bg-cyan-900/30 border-cyan-700';
    }
  };

  const getProgressColor = () => {
    switch(color) {
      case 'cyan': return 'bg-gradient-to-r from-cyan-500 to-cyan-400';
      case 'blue': return 'bg-gradient-to-r from-blue-500 to-blue-400';
      case 'purple': return 'bg-gradient-to-r from-purple-500 to-purple-400';
      case 'teal': return 'bg-gradient-to-r from-teal-500 to-teal-400';
      default: return 'bg-gradient-to-r from-cyan-500 to-cyan-400';
    }
  };

  const numericValue = typeof value === 'string' ? parseInt(value) || 0 : value;
  const progress = Math.min(100, Math.max(0, (numericValue / max) * 100));

  return (
    <div className={`${getColorClass()} p-3  border`}>
      <p className="text-xs text-cyan-300">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
      {change !== undefined && (
        <p className="text-xs text-cyan-400">
          {change > 0 ? <ArrowUp className="w-3 h-3 inline mr-1" /> : <ArrowDown className="w-3 h-3 inline mr-1" />}
          {Math.abs(change)}%
        </p>
      )}
      <div className="mt-2 h-1.5 w-full bg-cyan-900/50 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getProgressColor()} rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};