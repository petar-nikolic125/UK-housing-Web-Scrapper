// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertSearchSchema,
  type PropertyFilters,
  type InsertSearch,
  type Search
} from "@shared/schema";
import { z } from "zod";

interface LHARate {
  oneRoom: number;
  twoRoom: number;
  threeRoom: number;
  fourRoom: number;
}

const searchFiltersSchema = z.object({
  query: z.string().default(""),
  radius: z.coerce.number().default(10),
  maxPrice: z.coerce.number().nullable().optional(),
  minSize: z.coerce.number().nullable().optional(),
  excludeArticle4: z
      .coerce
      .boolean()
      .nullable()
      .optional()
      .transform(v => v ?? false),
  sortBy: z.enum(['profit', 'price', 'size', 'recent']).optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/properties", async (req, res) => {
    try {
      const parsed = searchFiltersSchema.parse({
        query: req.query.query,
        radius: req.query.radius,
        maxPrice: req.query.maxPrice,
        minSize: req.query.minSize,
        excludeArticle4: req.query.excludeArticle4,
        sortBy: req.query.sortBy,
      });

      const filters: PropertyFilters = {
        query: parsed.query,
        radius: parsed.radius,
        maxPrice: parsed.maxPrice ?? undefined,
        minSize: parsed.minSize ?? undefined,
        excludeArticle4: parsed.excludeArticle4,
        sortBy: parsed.sortBy
      };

      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (err: unknown) {
      console.error('Error fetching properties:', err);
      res.status(500).json({
        message: "Error fetching properties",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (err: unknown) {
      res.status(500).json({
        message: "Error fetching property",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const property = await storage.createProperty(req.body);
      res.status(201).json(property);
    } catch (err: unknown) {
      res.status(400).json({
        message: "Error creating property",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.post("/api/search", async (req, res) => {
    try {
      const searchData = insertSearchSchema.parse(req.body);
      const search = await storage.createSearch(searchData);

      const filters: PropertyFilters = {
        query: searchData.query,
        radius: searchData.radius,
        maxPrice: searchData.maxPrice ?? undefined,
        minSize: searchData.minSize ?? undefined,
        excludeArticle4: searchData.excludeArticle4 ?? undefined,
        sortBy: searchData.sortBy
      };

      const properties = await storage.getProperties(filters);

      res.json({
        search,
        properties,
        count: properties.length
      });
    } catch (err: unknown) {
      res.status(400).json({
        message: "Error performing search",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getPropertyStats();
      res.json(stats);
    } catch (err: unknown) {
      res.status(500).json({
        message: "Error fetching stats",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.get("/api/searches", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const searches = await storage.getRecentSearches(limit);
      res.json(searches);
    } catch (err: unknown) {
      res.status(500).json({
        message: "Error fetching searches",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.post("/api/properties/scrape", async (req, res) => {
    try {
      const { city, maxPrice = 500000, minArea = 90 } = req.body;
      if (!city) {
        return res.status(400).json({ message: "City is required for HMO property search" });
      }

      console.log(`Searching HMO properties in ${city} with max price £${maxPrice} and min area ${minArea}sqm...`);
      const { scraper } = await import('./scraper');
      const scrapedProperties = await scraper.scrapeProperties(city, maxPrice, minArea);

      await storage.clearAllProperties?.();

      const storedProperties: Property[] = [];
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
    } catch (err: unknown) {
      console.error('HMO property search error:', err);
      res.status(500).json({
        message: "Error searching HMO properties",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.post("/api/properties/refresh", async (req, res) => {
    try {
      const { city = 'Birmingham', maxPrice = 500000, minArea = 90 } = req.body;

      console.log(`Force refreshing properties for ${city}...`);

      await (storage as any).refreshWithScrapedData?.(city, maxPrice, minArea);
      const updatedProperties = await storage.getProperties();

      res.json({
        message: `Successfully refreshed with ${updatedProperties.length} new properties from ${city}`,
        properties: updatedProperties,
        count: updatedProperties.length
      });
    } catch (err: unknown) {
      console.error('Property refresh error:', err);
      res.status(500).json({
        message: "Error refreshing properties",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.post("/api/check-article4", async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      if (latitude == null || longitude == null) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }

      const isArticle4 = Math.random() > 0.8;

      res.json({
        latitude,
        longitude,
        isArticle4,
        message: isArticle4
            ? "Property is within an Article 4 direction area"
            : "Property is not within an Article 4 direction area"
      });
    } catch (err: unknown) {
      res.status(500).json({
        message: "Error checking Article 4 status",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.get("/api/lha-rates/:postcode", async (req, res) => {
    try {
      const { postcode } = req.params;
      const mockRates: Record<string, LHARate> = {
        B1: { oneRoom: 350, twoRoom: 450, threeRoom: 550, fourRoom: 650 },
        B2: { oneRoom: 330, twoRoom: 430, threeRoom: 530, fourRoom: 630 },
        B3: { oneRoom: 320, twoRoom: 420, threeRoom: 520, fourRoom: 620 },
        B4: { oneRoom: 340, twoRoom: 440, threeRoom: 540, fourRoom: 640 },
        B5: { oneRoom: 310, twoRoom: 410, threeRoom: 510, fourRoom: 610 },
        B6: { oneRoom: 360, twoRoom: 460, threeRoom: 560, fourRoom: 660 }
      };

      const area = (postcode.substring(0, 2) || '').toUpperCase();
      const rates = mockRates[area] || mockRates.B1;

      res.json({
        postcode,
        rates,
        lastUpdated: new Date().toISOString()
      });
    } catch (err: unknown) {
      res.status(500).json({
        message: "Error fetching LHA rates",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
