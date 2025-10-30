export async function getDomainStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/domains`);
    if (!response.ok) {
      throw new Error('Failed to fetch domain stats');
    }
    
    const domains = await response.json();
    
    const totalDomains = domains.length;
    const soldDomains = domains.filter((domain: any) => domain.isSold).length;
    const availableDomains = domains.filter((domain: any) => domain.isAvailable && !domain.isSold).length;
    
    return { 
      totalDomains,
      soldDomains,
      availableDomains,
      yearsInMarket: 5, // This can be made dynamic if you have a creation date for your marketplace
    };
  } catch (error) {
    console.error('Error fetching domain stats:', error);
    // Return default values in case of error
    return {
      totalDomains: 100,
      soldDomains: 50,
      availableDomains: 50,
      yearsInMarket: 5,
    };
  }
}
