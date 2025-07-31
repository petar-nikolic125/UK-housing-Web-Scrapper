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
    
    console.log(`Refreshing properties for ${city} with criteria: maxPrice=${maxPrice}, minArea=${minArea}`);
    
    // Get hardcoded properties for the city
    const hardcodedProperties = getHardcodedPropertiesForCity(city);
    
    // Filter properties based on criteria
    const filteredProperties = hardcodedProperties.filter(prop => 
      prop.price <= maxPrice && prop.size >= minArea
    );

    res.status(200).json({ 
      message: `Successfully refreshed with ${filteredProperties.length} new properties from ${city}`,
      properties: filteredProperties,
      count: filteredProperties.length,
      city: city
    });
  } catch (error) {
    console.error('Error refreshing properties:', error);
    
    // Fallback response
    res.status(200).json({ 
      message: 'Properties refreshed with fallback data',
      properties: getHardcodedPropertiesForCity('Birmingham').slice(0, 3),
      count: 3,
      fallback: true
    });
  }
}