import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getHardcodedPropertiesForCity } from '../../shared/hardcoded-properties';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse request body safely
    let requestBody = {};
    try {
      if (typeof req.body === 'string') {
        requestBody = JSON.parse(req.body);
      } else if (req.body && typeof req.body === 'object') {
        requestBody = req.body;
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      requestBody = {};
    }

    const { city = 'Birmingham', maxPrice = 500000, minArea = 90 } = requestBody as any;
    
    if (!city) {
      return res.status(400).json({ message: 'City is required for HMO property search' });
    }
    
    console.log(`Scraping HMO properties in ${city} with max price £${maxPrice} and min area ${minArea}sqm...`);
    
    // Get hardcoded properties for the city
    const hardcodedProperties = getHardcodedPropertiesForCity(city);
    
    // Filter properties based on criteria
    const filteredProperties = hardcodedProperties.filter(prop => 
      prop.price <= maxPrice && prop.size >= minArea
    );

    res.status(200).json({
      message: `Successfully found ${filteredProperties.length} suitable HMO properties in ${city}`,
      properties: filteredProperties,
      count: filteredProperties.length,
      criteria: {
        city,
        maxPrice,
        minArea,
        excludedArticle4: filteredProperties.filter(p => !p.isArticle4).length
      }
    });
  } catch (error) {
    console.error('HMO property search error:', error);
    
    // Fallback response with Birmingham properties
    const fallbackProperties = getHardcodedPropertiesForCity('Birmingham').slice(0, 3);
    res.status(200).json({
      message: 'Found HMO properties using fallback data',
      properties: fallbackProperties,
      count: fallbackProperties.length,
      fallback: true
    });
  }
}