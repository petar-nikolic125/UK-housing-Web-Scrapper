import { type Property, type InsertProperty, type Search, type InsertSearch, type PropertyFilters } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Property operations
  getProperty(id: string): Promise<Property | undefined>;
  getProperties(filters?: PropertyFilters): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  
  // Search operations
  createSearch(search: InsertSearch): Promise<Search>;
  getRecentSearches(limit?: number): Promise<Search[]>;
  
  // Statistics
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
    this.initializeWithSampleData();
  }

  private initializeWithSampleData() {
    const sampleProperties: InsertProperty[] = [
      {
        address: "93 Park Avenue, Birmingham",
        price: 247740,
        size: 98,
        bedrooms: 4,
        bathrooms: 3,
        latitude: 52.4862,
        longitude: -1.8904,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
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
        address: "65 Station Road, Birmingham",
        price: 482061,
        size: 130,
        bedrooms: 3,
        bathrooms: 2,
        latitude: 52.4814,
        longitude: -1.8998,
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        primeLocationUrl: "https://www.primelocation.com/for-sale/details/65-station-road-birmingham",
        description: "3 bedroom property with excellent HMO potential. Located in Birmingham with good transport links...",
        hasGarden: false,
        hasParking: false,
        isArticle4: false,
        yearlyProfit: 13824,
        leftInDeal: null,
        postcode: "B2 4QA"
      },
      {
        address: "49 Church Lane, Birmingham",
        price: 222984,
        size: 117,
        bedrooms: 4,
        bathrooms: 3,
        latitude: 52.4756,
        longitude: -1.8967,
        imageUrl: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        primeLocationUrl: "https://www.primelocation.com/for-sale/details/49-church-lane-birmingham",
        description: "4 bedroom property with excellent HMO potential. Located in Birmingham with good transport links...",
        hasGarden: true,
        hasParking: false,
        isArticle4: false,
        yearlyProfit: 17280,
        leftInDeal: 40564,
        postcode: "B3 2NG"
      },
      {
        address: "12 Victoria Street, Birmingham",
        price: 385000,
        size: 145,
        bedrooms: 5,
        bathrooms: 2,
        latitude: 52.4833,
        longitude: -1.8936,
        imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        primeLocationUrl: "https://www.primelocation.com/for-sale/details/12-victoria-street-birmingham",
        description: "5 bedroom Victorian property with excellent HMO conversion potential. Period features throughout...",
        hasGarden: true,
        hasParking: false,
        isArticle4: false,
        yearlyProfit: 22400,
        leftInDeal: 52200,
        postcode: "B4 7ET"
      },
      {
        address: "78 Mill Lane, Birmingham",
        price: 299950,
        size: 102,
        bedrooms: 3,
        bathrooms: 2,
        latitude: 52.4901,
        longitude: -1.8845,
        imageUrl: "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        primeLocationUrl: "https://www.primelocation.com/for-sale/details/78-mill-lane-birmingham",
        description: "3 bedroom modern property with parking and HMO potential. Recently renovated throughout...",
        hasGarden: false,
        hasParking: true,
        isArticle4: false,
        yearlyProfit: 15600,
        leftInDeal: 45992,
        postcode: "B5 4DH"
      },
      {
        address: "134 Queens Road, Birmingham",
        price: 450000,
        size: 180,
        bedrooms: 6,
        bathrooms: 3,
        latitude: 52.4729,
        longitude: -1.9026,
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        primeLocationUrl: "https://www.primelocation.com/for-sale/details/134-queens-road-birmingham",
        description: "6 bedroom detached property perfect for HMO conversion. Large garden and parking...",
        hasGarden: true,
        hasParking: true,
        isArticle4: false,
        yearlyProfit: 28800,
        leftInDeal: 67500,
        postcode: "B6 5JL"
      }
    ];

    sampleProperties.forEach(property => {
      const id = randomUUID();
      const fullProperty: Property = {
        ...property,
        id,
        createdAt: new Date()
      };
      this.properties.set(id, fullProperty);
    });
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(filters?: PropertyFilters): Promise<Property[]> {
    let properties = Array.from(this.properties.values());

    if (filters) {
      // Apply filters
      if (filters.maxPrice) {
        properties = properties.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.minSize) {
        properties = properties.filter(p => p.size >= filters.minSize!);
      }
      if (filters.excludeArticle4) {
        properties = properties.filter(p => !p.isArticle4);
      }
      if (filters.query) {
        const query = filters.query.toLowerCase();
        properties = properties.filter(p => 
          p.address.toLowerCase().includes(query) || 
          p.postcode.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'profit':
            properties.sort((a, b) => (b.yearlyProfit || 0) - (a.yearlyProfit || 0));
            break;
          case 'price':
            properties.sort((a, b) => a.price - b.price);
            break;
          case 'size':
            properties.sort((a, b) => b.size - a.size);
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
      ...property,
      id,
      createdAt: new Date()
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;

    const updated: Property = { ...existing, ...property };
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
    const searches = Array.from(this.searches.values());
    return searches
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getPropertyStats(): Promise<{
    totalProperties: number;
    nonArticle4Properties: number;
    averagePrice: number;
    averageSize: number;
  }> {
    const properties = Array.from(this.properties.values());
    const nonArticle4 = properties.filter(p => !p.isArticle4);
    
    return {
      totalProperties: properties.length,
      nonArticle4Properties: nonArticle4.length,
      averagePrice: properties.reduce((sum, p) => sum + p.price, 0) / properties.length,
      averageSize: properties.reduce((sum, p) => sum + p.size, 0) / properties.length
    };
  }
}

export const storage = new MemStorage();
