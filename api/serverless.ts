import express from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Import the routes setup without creating an HTTP server
async function setupApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Import and setup routes directly
  const { storage } = await import("../server/storage.js");
  const { insertSearchSchema } = await import("../shared/schema.js");
  const { z } = await import("zod");

  // Define the same routes as in server/routes.ts but without creating HTTP server
  app.get("/api/properties", async (req, res) => {
    try {
      const rawFilters = req.query;
      const filters = {
        query: rawFilters.query as string || "",
        radius: rawFilters.radius ? parseInt(rawFilters.radius as string) : 10,
        maxPrice: rawFilters.maxPrice ? parseInt(rawFilters.maxPrice as string) : undefined,
        minSize: rawFilters.minSize ? parseInt(rawFilters.minSize as string) : undefined,
        excludeArticle4: rawFilters.excludeArticle4 === 'true',
        sortBy: rawFilters.sortBy as any
      };
      
      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ message: "Error fetching properties", error: error.message });
    }
  });

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

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats", error });
    }
  });

  app.post("/api/properties/refresh", async (req, res) => {
    try {
      const { city = "Birmingham", maxPrice = 500000, minArea = 90 } = req.body;
      await (storage as any).refreshWithScrapedData?.(city, maxPrice, minArea);
      res.json({ message: `Successfully refreshed with new data from ${city}` });
    } catch (error) {
      res.status(500).json({ message: "Error refreshing properties", error });
    }
  });

  return app;
}

// Create the app instance
let app: express.Express | null = null;

// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    app = await setupApp();
  }
  
  return app(req, res);
}