import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSearchSchema, type PropertyFilters } from "@shared/schema";
import { z } from "zod";

const searchFiltersSchema = z.object({
  query: z.string().default(""),
  radius: z.coerce.number().default(10),
  maxPrice: z.coerce.number().optional(),
  minSize: z.coerce.number().optional(),
  excludeArticle4: z.coerce.boolean().optional(),
  sortBy: z.enum(['profit', 'price', 'size', 'recent']).optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all properties with optional filters
  app.get("/api/properties", async (req, res) => {
    try {
      // Parse query parameters manually to handle string to number conversion
      const rawFilters = req.query;
      const filters: PropertyFilters = {
        query: rawFilters.query as string || "",
        radius: rawFilters.radius ? parseInt(rawFilters.radius as string) : 10,
        maxPrice: rawFilters.maxPrice ? parseInt(rawFilters.maxPrice as string) : undefined,
        minSize: rawFilters.minSize ? parseInt(rawFilters.minSize as string) : undefined,
        excludeArticle4: rawFilters.excludeArticle4 === 'true',
        sortBy: rawFilters.sortBy as PropertyFilters['sortBy']
      };
      
      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ message: "Error fetching properties", error: error.message });
    }
  });

  // Get single property by ID
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Error fetching property", error });
    }
  });

  // Create new property
  app.post("/api/properties", async (req, res) => {
    try {
      // Note: In production, this would validate against actual property sources
      const property = await storage.createProperty(req.body);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Error creating property", error });
    }
  });

  // Search properties and save search
  app.post("/api/search", async (req, res) => {
    try {
      const searchData = insertSearchSchema.parse(req.body);
      const search = await storage.createSearch(searchData);
      
      const filters: PropertyFilters = {
        query: searchData.query,
        radius: searchData.radius,
        maxPrice: searchData.maxPrice || undefined,
        minSize: searchData.minSize || undefined,
        excludeArticle4: searchData.excludeArticle4 || undefined,
      };
      
      const properties = await storage.getProperties(filters);
      
      res.json({
        search,
        properties,
        count: properties.length
      });
    } catch (error) {
      res.status(400).json({ message: "Error performing search", error });
    }
  });

  // Get property statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getPropertyStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats", error });
    }
  });

  // Get recent searches
  app.get("/api/searches", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const searches = await storage.getRecentSearches(limit);
      res.json(searches);
    } catch (error) {
      res.status(500).json({ message: "Error fetching searches", error });
    }
  });

  // Scrape HMO properties using Google Custom Search API + Playwright
  app.post("/api/properties/scrape", async (req, res) => {
    try {
      const { city, maxPrice = 500000, minArea = 90 } = req.body;
      
      if (!city) {
        return res.status(400).json({ message: "City is required for HMO property search" });
      }

      console.log(`Searching HMO properties in ${city} with max price £${maxPrice} and min area ${minArea}sqm...`);
      
      // Import scraper dynamically to avoid initialization issues
      const { scraper } = await import('./scraper');
      
      // Scrape properties using Google Custom Search API approach
      const scrapedProperties = await scraper.scrapeProperties(city, maxPrice, minArea);
      
      // Store properties in memory storage
      const storedProperties = [];
      for (const property of scrapedProperties) {
        const stored = await storage.createProperty(property);
        storedProperties.push(stored);
      }
      
      res.json({
        message: `Successfully found ${storedProperties.length} suitable HMO properties in ${city}`,
        properties: storedProperties,
        count: storedProperties.length,
        criteria: {
          city,
          maxPrice,
          minArea,
          excludedArticle4: storedProperties.filter(p => !p.isArticle4).length
        }
      });
      
    } catch (error) {
      console.error('HMO property search error:', error);
      res.status(500).json({ message: "Error searching HMO properties", error: error.message });
    }
  });

  // Article 4 direction checker endpoint
  app.post("/api/check-article4", async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }
      
      // TODO: Implement actual Article 4 direction checking using GeoJSON data
      // For now, return mock result based on coordinates
      const isArticle4 = Math.random() > 0.8; // 20% chance of being in Article 4 area
      
      res.json({
        latitude,
        longitude,
        isArticle4,
        message: isArticle4 ? "Property is within an Article 4 direction area" : "Property is not within an Article 4 direction area"
      });
    } catch (error) {
      res.status(500).json({ message: "Error checking Article 4 status", error });
    }
  });

  // Local Housing Allowance rate lookup
  app.get("/api/lha-rates/:postcode", async (req, res) => {
    try {
      const { postcode } = req.params;
      
      // TODO: Implement actual LHA rate lookup
      // Mock LHA rates based on postcode area
      const mockRates = {
        B1: { oneRoom: 350, twoRoom: 450, threeRoom: 550, fourRoom: 650 },
        B2: { oneRoom: 330, twoRoom: 430, threeRoom: 530, fourRoom: 630 },
        B3: { oneRoom: 320, twoRoom: 420, threeRoom: 520, fourRoom: 620 },
        B4: { oneRoom: 340, twoRoom: 440, threeRoom: 540, fourRoom: 640 },
        B5: { oneRoom: 310, twoRoom: 410, threeRoom: 510, fourRoom: 610 },
        B6: { oneRoom: 360, twoRoom: 460, threeRoom: 560, fourRoom: 660 },
      };

      const postcodeArea = postcode.substring(0, 2).toUpperCase();
      const rates = mockRates[postcodeArea as keyof typeof mockRates] || mockRates.B1;
      
      res.json({
        postcode,
        rates,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching LHA rates", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
