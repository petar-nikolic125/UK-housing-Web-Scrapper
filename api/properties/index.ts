import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getHardcodedPropertiesForCity, HARDCODED_PROPERTIES } from '../../shared/hardcoded-properties';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get query parameters for filtering
    const query = (req.query.query as string) || '';
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
    const minSize = req.query.minSize ? parseInt(req.query.minSize as string) : undefined;
    const excludeArticle4 = req.query.excludeArticle4 === 'true';
    const sortBy = (req.query.sortBy as string) || 'profit';

    // Get all hardcoded properties from all cities
    let allProperties: any[] = [];
    Object.keys(HARDCODED_PROPERTIES).forEach(city => {
      const cityProperties = getHardcodedPropertiesForCity(city);
      allProperties.push(...cityProperties);
    });

    // Apply filters
    let filteredProperties = allProperties;

    if (query) {
      filteredProperties = filteredProperties.filter(prop =>
        prop.address.toLowerCase().includes(query.toLowerCase()) ||
        prop.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (maxPrice) {
      filteredProperties = filteredProperties.filter(prop => prop.price <= maxPrice);
    }

    if (minSize) {
      filteredProperties = filteredProperties.filter(prop => prop.size >= minSize);
    }

    if (excludeArticle4) {
      filteredProperties = filteredProperties.filter(prop => !prop.isArticle4);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price':
        filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case 'size':
        filteredProperties.sort((a, b) => b.size - a.size);
        break;
      case 'profit':
      default:
        filteredProperties.sort((a, b) => b.yearlyProfit - a.yearlyProfit);
        break;
    }

    // Add IDs if not present
    const propertiesWithIds = filteredProperties.map((prop, index) => ({
      id: prop.id || `hardcoded-${index}`,
      ...prop
    }));

    res.status(200).json(propertiesWithIds);
  } catch (error) {
    console.error('Error fetching properties:', error);
    
    // Fallback to Birmingham properties
    const fallbackProperties = getHardcodedPropertiesForCity('Birmingham').map((prop, index) => ({
      id: `fallback-${index}`,
      ...prop
    }));
    
    res.status(200).json(fallbackProperties);
  }
}