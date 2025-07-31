import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { city = 'Birmingham', maxPrice = 500000, minArea = 90 } = req.body || {};
    
    const result = await (storage as any).refreshWithScrapedData?.(city, maxPrice, minArea);
    
    if (!result) {
      return res.status(500).json({ 
        message: 'Property refresh not available',
        fallback: true 
      });
    }

    res.json({ 
      message: `Properties refreshed for ${city}`,
      count: result.length || 0 
    });
  } catch (error) {
    console.error('Error refreshing properties:', error);
    res.status(500).json({ message: 'Failed to refresh properties' });
  }
}