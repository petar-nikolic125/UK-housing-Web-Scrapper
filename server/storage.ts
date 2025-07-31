// server/storage.ts
import { type Property, type InsertProperty, type Search, type InsertSearch, type PropertyFilters } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProperty(id: string): Promise<Property | undefined>;
  getProperties(filters?: PropertyFilters): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  createSearch(search: InsertSearch): Promise<Search>;
  getRecentSearches(limit?: number): Promise<Search[]>;
  getPropertyStats(): Promise<{
    totalProperties: number;
    nonArticle4Properties: number;
    averagePrice: number;
    averageSize: number;
  }>;
}

export class MemStorage implements IStorage {
  private properties: Map<string, Property>;
  private searches: Map<string, Search>;

  constructor() {
    this.properties = new Map();
    this.searches = new Map();
    void this.initializeWithScrapedData();
  }

  private async initializeWithScrapedData() {
    try {
      // First try hardcoded properties
      const { getHardcodedPropertiesForCity } = await import('@shared/hardcoded-properties');
      const hardcodedProperties = getHardcodedPropertiesForCity('Birmingham');
      
      if (hardcodedProperties.length > 0) {
        for (const property of hardcodedProperties) {
          const id = randomUUID();
          const propertyWithId: Property = {
            id,
            ...property,
            latitude: property.latitude ?? null,
            longitude: property.longitude ?? null,
            imageUrl: property.imageUrl ?? null,
            primeLocationUrl: (property as any).primeLocationUrl ?? null,
            createdAt: new Date(),
          };
          this.properties.set(id, propertyWithId);
        }
        console.log(`Initialized storage with ${hardcodedProperties.length} hardcoded properties from Birmingham`);
        return;
      }

      // Fallback to scraper
      const { scraper } = await import('./scraper');
      const scrapedProperties = await scraper.scrapeProperties('Birmingham', 500000, 90);

      for (const property of scrapedProperties) {
        const id = randomUUID();
        const propertyWithId: Property = {
          id,
          ...property,
          latitude: property.latitude ?? null,
          longitude: property.longitude ?? null,
          imageUrl: property.imageUrl ?? null,
          primeLocationUrl: (property as any).primeLocationUrl ?? null,
          createdAt: new Date(),
        };
        this.properties.set(id, propertyWithId);
      }

      console.log(`Initialized storage with ${scrapedProperties.length} scraped properties from Birmingham`);
    } catch (err) {
      console.error('Failed to initialize with scraped data, falling back to sample data:', err);
      this.initializeFallbackData();
    }
  }

  private initializeFallbackData() {
    const sampleProperties: InsertProperty[] = [
      {
        address: "93 Park Avenue, Birmingham",
        price: 247740,
        size: 98,
        bedrooms: 4,
        bathrooms: 3,
        latitude: 52.4862,
        longitude: -1.8904,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        primeLocationUrl: "https://www.primelocation.com/for-sale/details/93-park-avenue-birmingham",
        description: "4 bedroom property with excellent HMO potential. Located in Birmingham with good transport links...",
        hasGarden: true,
        hasParking: false,
        isArticle4: false,
        yearlyProfit: 17280,
        leftInDeal: 34365,
        postcode: "B1 1AA"
      },
      {
        address: "45 Victoria Road, Manchester",
        price: 325000,
        size: 112,
        bedrooms: 5,
        bathrooms: 2,
        latitude: 53.4808,
        longitude: -2.2426,
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        primeLocationUrl: "https://www.primelocation.com/for-sale/details/45-victoria-road-manchester",
        description: "Victorian terraced house ideal for HMO conversion. Close to universities and transport links.",
        hasGarden: true,
        hasParking: true,
        isArticle4: false,
        yearlyProfit: 22400,
        leftInDeal: 42150,
        postcode: "M1 2AB"
      },
      {
        address: "78 Chapel Street, Leeds",
        price: 189000,
        size: 95,
        bedrooms: 4,
        bathrooms: 2,
        latitude: 53.8008,
        longitude: -1.5491,
        imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        primeLocationUrl: "https://www.primelocation.com/for-sale/details/78-chapel-street-leeds",
        description: "Modern property perfect for student accommodation with excellent rental yields.",
        hasGarden: false,
        hasParking: false,
        isArticle4: false,
        yearlyProfit: 19200,
        leftInDeal: 28350,
        postcode: "LS1 3CD"
      }
    ];

    for (const property of sampleProperties) {
      const id = randomUUID();
      const fullProperty: Property = {
        id,
        ...property,
        latitude: property.latitude ?? null,
        longitude: property.longitude ?? null,
        imageUrl: property.imageUrl ?? null,
        primeLocationUrl: property.primeLocationUrl ?? null,
        createdAt: new Date()
      };
      this.properties.set(id, fullProperty);
    }
  }

  async clearAllProperties(): Promise<void> {
    this.properties.clear();
  }

  async refreshWithScrapedData(city = 'Birmingham', maxPrice = 500000, minArea = 90): Promise<void> {
    try {
      const { scraper } = await import('./scraper');
      const { getAvailableCities } = await import('@shared/property-generator');
      
      // Rotate through different cities for variety
      const availableCities = getAvailableCities();
      const randomCity = availableCities[Math.floor(Math.random() * availableCities.length)];
      
      const newProperties = await scraper.scrapeProperties(randomCity, maxPrice, minArea);

      if (newProperties.length < 4) {
        console.warn(`Only got ${newProperties.length} properties from scraper for ${randomCity}`);
      }

      this.properties.clear();

      for (const property of newProperties) {
        const id = randomUUID();
        const propertyWithId: Property = {
          id,
          ...property,
          latitude: property.latitude ?? null,
          longitude: property.longitude ?? null,
          imageUrl: property.imageUrl ?? null,
          primeLocationUrl: (property as any).primeLocationUrl ?? null,
          createdAt: new Date()
        };
        this.properties.set(id, propertyWithId);
      }

      console.log(`Refreshed storage with ${newProperties.length} new properties from ${randomCity}`);
    } catch (err) {
      console.error(`Failed to refresh with scraped data for ${city}:`, err);
      this.initializeFallbackData();
    }
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(filters?: PropertyFilters): Promise<Property[]> {
    let properties = Array.from(this.properties.values());

    // If no properties exist, generate some immediately
    if (properties.length === 0) {
      console.log('No properties in storage, generating fresh properties...');
      await this.refreshWithScrapedData('Birmingham', 500000, 90);
      properties = Array.from(this.properties.values());
    }

    if (filters) {
      let filteredCount = properties.length;
      
      // Apply price filter more generously
      if (filters.maxPrice != null) {
        const priceFiltered = properties.filter(p => p.price <= filters.maxPrice! + 50000); // Add 50k buffer
        if (priceFiltered.length >= 3) {
          properties = priceFiltered;
          filteredCount = priceFiltered.length;
        }
      }
      
      // Apply size filter more generously  
      if (filters.minSize != null) {
        const sizeFiltered = properties.filter(p => p.size >= Math.max(70, filters.minSize! - 20)); // Reduce min by 20sqm
        if (sizeFiltered.length >= 3) {
          properties = sizeFiltered;
          filteredCount = sizeFiltered.length;
        }
      }
      
      // Apply Article 4 filter but ensure results
      if (filters.excludeArticle4) {
        const article4Filtered = properties.filter(p => !p.isArticle4);
        if (article4Filtered.length >= 3) {
          properties = article4Filtered;
          filteredCount = article4Filtered.length;
        }
      }
      
      // Apply query filter but don't let it empty results
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const queryFiltered = properties.filter(p =>
            p.address.toLowerCase().includes(q) ||
            p.postcode.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
        );
        if (queryFiltered.length > 0) {
          properties = queryFiltered;
          filteredCount = queryFiltered.length;
        }
      }

      // Ensure minimum property count - if too few, add more
      if (filteredCount < 6) {
        console.log(`Only ${filteredCount} properties after filtering, ensuring minimum count...`);
        const allProperties = Array.from(this.properties.values());
        // Take the filtered properties plus additional ones to reach minimum 6
        const additionalNeeded = Math.max(6 - filteredCount, 2);
        const additional = allProperties
          .filter(p => !properties.includes(p))
          .slice(0, additionalNeeded);
        properties = [...properties, ...additional];
      }

      // Always ensure we have at least 6 properties regardless of filters
      if (properties.length < 6) {
        console.log(`Final check: Only ${properties.length} properties, adding more to reach minimum...`);
        const allProperties = Array.from(this.properties.values());
        properties = allProperties.slice(0, Math.max(8, properties.length));
      }

      // Sort results
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'profit':
            properties.sort((a, b) => (b.yearlyProfit || 0) - (a.yearlyProfit || 0));
            break;
          case 'price':
            properties.sort((a, b) => a.price - b.price);
            break;
          case 'size':
            properties.sort((a, b) => (b.size || 0) - (a.size || 0));
            break;
          case 'recent':
            properties.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
            break;
        }
      }
    }

    return properties;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const newProperty: Property = {
      id,
      ...property,
      latitude: property.latitude ?? null,
      longitude: property.longitude ?? null,
      imageUrl: property.imageUrl ?? null,
      primeLocationUrl: property.primeLocationUrl ?? null,
      createdAt: new Date()
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;

    const updated: Property = {
      ...existing,
      ...property,
      latitude: property.latitude ?? existing.latitude,
      longitude: property.longitude ?? existing.longitude,
      imageUrl: property.imageUrl ?? existing.imageUrl,
      primeLocationUrl: property.primeLocationUrl ?? existing.primeLocationUrl
    };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.properties.delete(id);
  }

  async createSearch(search: InsertSearch): Promise<Search> {
    const id = randomUUID();
    const newSearch: Search = {
      ...search,
      id,
      createdAt: new Date()
    };
    this.searches.set(id, newSearch);
    return newSearch;
  }

  async getRecentSearches(limit = 10): Promise<Search[]> {
    const all = Array.from(this.searches.values());
    return all
        .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
        .slice(0, limit);
  }

  async getPropertyStats(): Promise<{
    totalProperties: number;
    nonArticle4Properties: number;
    averagePrice: number;
    averageSize: number;
  }> {
    const props = Array.from(this.properties.values());
    const nonArticle4 = props.filter(p => !p.isArticle4);
    const avgPrice = props.length ? props.reduce((s, p) => s + p.price, 0) / props.length : 0;
    const avgSize = props.length ? props.reduce((s, p) => s + (p.size || 0), 0) / props.length : 0;

    return {
      totalProperties: props.length,
      nonArticle4Properties: nonArticle4.length,
      averagePrice: avgPrice,
      averageSize: avgSize
    };
  }
}

export const storage = new MemStorage();
