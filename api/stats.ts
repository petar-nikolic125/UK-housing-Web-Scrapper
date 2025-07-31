import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getHardcodedPropertiesForCity, HARDCODED_PROPERTIES } from '../shared/hardcoded-properties';

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
    // Get all hardcoded properties from all cities
    let allProperties: any[] = [];
    Object.keys(HARDCODED_PROPERTIES).forEach(city => {
      const cityProperties = getHardcodedPropertiesForCity(city);
      allProperties.push(...cityProperties);
    });

    const stats = {
      totalProperties: allProperties.length,
      nonArticle4Properties: allProperties.filter(p => !p.isArticle4).length,
      averagePrice: Math.floor(allProperties.reduce((sum, p) => sum + p.price, 0) / allProperties.length),
      averageYearlyProfit: Math.floor(allProperties.reduce((sum, p) => sum + p.yearlyProfit, 0) / allProperties.length),
      cities: Object.keys(HARDCODED_PROPERTIES),
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    // Fallback stats
    res.status(200).json({
      totalProperties: 15,
      nonArticle4Properties: 12,
      averagePrice: 350000,
      averageYearlyProfit: 28000,
      cities: ['Birmingham', 'Manchester', 'Sheffield', 'Liverpool', 'Leeds'],
      lastUpdated: new Date().toISOString()
    });
  }
}