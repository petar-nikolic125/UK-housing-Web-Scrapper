import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      maxPrice,
      minArea,
      city,
      radius,
      excludeArticle4,
      search,
      limit = "50",
      offset = "0"
    } = req.query;

    const filters = {
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minArea: minArea ? Number(minArea) : undefined,
      city: city as string,
      radius: radius ? Number(radius) : undefined,
      excludeArticle4: excludeArticle4 === 'true',
      search: search as string,
    };

    const properties = await storage.getProperties(filters, Number(limit), Number(offset));
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}