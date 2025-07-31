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

    if (filters) {
      if (filters.maxPrice != null) {
        properties = properties.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.minSize != null) {
        properties = properties.filter(p => p.size >= filters.minSize!);
      }
      if (filters.excludeArticle4) {
        properties = properties.filter(p => !p.isArticle4);
      }
      if (filters.query) {
        const q = filters.query.toLowerCase();
        properties = properties.filter(p =>
            p.address.toLowerCase().includes(q) ||
            p.postcode.toLowerCase().includes(q)
        );
      }

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
