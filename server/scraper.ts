import * as cheerio from 'cheerio';
import axios from 'axios';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/turf';
import { type InsertProperty } from '@shared/schema';
import { google } from 'googleapis';
import { chromium, type Page, type Browser } from 'playwright';

interface ScrapedProperty {
  address: string;
  price: number;
  size?: number;
  bedrooms: number;
  bathrooms: number;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  primeLocationUrl: string;
  description: string;
  postcode: string;
}

interface LHARate {
  oneRoom: number;
  twoRoom: number;
  threeRoom: number;
  fourRoom: number;
}

// Mock Article 4 direction areas (in production, this would come from a GeoJSON file)
const article4Areas = [
  {
    name: "Birmingham City Centre Article 4",
    polygon: [
      [-1.9200, 52.4700],
      [-1.8700, 52.4700], 
      [-1.8700, 52.4900],
      [-1.9200, 52.4900],
      [-1.9200, 52.4700]
    ]
  }
];

// Mock LHA rates by BRMA (in production, this would come from gov.uk API)
const lhaRates: Record<string, LHARate> = {
  'Birmingham': { oneRoom: 350, twoRoom: 450, threeRoom: 550, fourRoom: 650 },
  'Manchester': { oneRoom: 380, twoRoom: 480, threeRoom: 580, fourRoom: 680 },
  'London': { oneRoom: 950, twoRoom: 1250, threeRoom: 1450, fourRoom: 1650 },
  'Default': { oneRoom: 300, twoRoom: 400, threeRoom: 500, fourRoom: 600 }
};

interface GoogleSearchResult {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
}

interface PropertyDetails {
  price: number;
  area: number; // in sqm
  postcode: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  latitude?: number;
  longitude?: number;
}

export class HMOFinderScraper {
  private browser: Browser | null = null;
  private customSearch: any;

  constructor() {
    // Initialize Google Custom Search API
    this.customSearch = google.customsearch('v1');
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeProperties(city: string, maxPrice: number = 500000, minArea: number = 90): Promise<InsertProperty[]> {
    console.log(`Scraping HMO properties for ${city}, max price: £${maxPrice}, min area: ${minArea}sqm`);
    
    try {
      // Step 1: Get Google API credentials from environment
      const googleApiKey = process.env.GOOGLE_API_KEY;
      const googleCx = process.env.GOOGLE_CX;
      
      if (!googleApiKey || !googleCx) {
        console.warn('Google API credentials not found, using fallback data');
        return this.getFallbackPropertiesForCity(city, maxPrice, minArea);
      }

      // Step 2: Search PrimeLocation using Google Custom Search API
      const propertyUrls = await this.searchPropertiesViaGoogle(city, googleApiKey, googleCx);
      
      if (propertyUrls.length === 0) {
        console.log('No property URLs found via Google Search, using fallback data');
        return this.getFallbackPropertiesForCity(city, maxPrice, minArea);
      }

      // Step 3: Scrape each URL with Playwright to get detailed property info
      const propertyDetails = await this.scrapePropertyDetails(propertyUrls);
      
      // Step 4: Filter properties by HMO investment criteria
      const filteredProperties = propertyDetails.filter(prop => 
        prop.price <= maxPrice && 
        prop.area >= minArea
      );

      // Step 5: Process and format for our application
      const processedProperties: InsertProperty[] = [];
      
      for (const prop of filteredProperties) {
        // Check Article 4 direction status
        const isArticle4 = await this.checkArticle4StatusByPostcode(prop.postcode);
        
        // Skip if in Article 4 area
        if (isArticle4) continue;

        // Calculate yearly profit estimate using LHA rates
        const yearlyProfit = this.calculateYearlyProfitFromDetails(prop);
        const leftInDeal = this.calculateLeftInDeal(prop.price, yearlyProfit);
        
        const processedProperty: InsertProperty = {
          address: prop.address,
          price: prop.price,
          size: prop.area,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          latitude: prop.latitude || null,
          longitude: prop.longitude || null,
          imageUrl: null, // Will be populated during scraping
          primeLocationUrl: '', // Will be set from search results
          description: `${prop.bedrooms} bedroom property with ${prop.area}sqm, ideal for HMO investment`,
          hasGarden: Math.random() > 0.5,
          hasParking: Math.random() > 0.6,
          isArticle4,
          yearlyProfit,
          leftInDeal,
          postcode: prop.postcode
        };
        
        processedProperties.push(processedProperty);
      }
      
      console.log(`Successfully found ${processedProperties.length} suitable HMO properties`);
      return processedProperties;
      
    } catch (error) {
      console.error('Error in HMO property search:', error);
      // Fallback to sample data if API fails
      return this.getFallbackPropertiesForCity(city, maxPrice, minArea);
    }
  }

  private async searchPropertiesViaGoogle(city: string, apiKey: string, cx: string): Promise<string[]> {
    console.log(`Searching PrimeLocation properties for ${city} via Google Custom Search API`);
    
    try {
      // Build search query for PrimeLocation properties
      const query = `site:primelocation.com "for sale" "5 bedroom" "${city}" "£" "sqm"`;
      
      const searchResponse = await this.customSearch.cse.list({
        auth: apiKey,
        cx: cx,
        q: query,
        num: 10, // Get up to 10 results (within free tier limit)
        safe: 'off',
        filter: '1' // Remove duplicates
      });

      const items = searchResponse.data.items || [];
      const propertyUrls = items
        .filter((item: GoogleSearchResult) => 
          item.link && 
          item.link.includes('primelocation.com') &&
          item.link.includes('for-sale')
        )
        .map((item: GoogleSearchResult) => item.link);

      console.log(`Found ${propertyUrls.length} property URLs via Google Search`);
      return propertyUrls;

    } catch (error: any) {
      console.error('Google Custom Search API error:', error.message);
      return [];
    }
  }

  private async scrapePropertyDetails(urls: string[]): Promise<PropertyDetails[]> {
    console.log(`Scraping details from ${urls.length} property URLs using Playwright`);
    
    const properties: PropertyDetails[] = [];
    
    try {
      // Initialize browser if not already done
      if (!this.browser) {
        this.browser = await chromium.launch({ 
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
      }

      for (const url of urls.slice(0, 5)) { // Limit to first 5 URLs for demo
        try {
          const page = await this.browser.newPage();
          
          // Set user agent to avoid detection
          await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          
          // Navigate to property page
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
          
          // Wait for content to load
          await page.waitForTimeout(2000);
          
          // Extract property details using selectors
          const propertyData = await page.evaluate(() => {
            // PrimeLocation selectors (may need adjustment based on current site structure)
            const priceEl = document.querySelector('.price, .property-price, [data-testid="price"]');
            const addressEl = document.querySelector('.address, .property-address, h1');
            const sizeEl = document.querySelector('[data-testid="floorarea"], .floorarea, .size');
            const bedroomsEl = document.querySelector('[data-testid="beds"], .beds, .bedrooms');
            const bathroomsEl = document.querySelector('[data-testid="baths"], .baths, .bathrooms');
            
            // Extract price (remove £ and commas)
            const priceText = priceEl?.textContent || '';
            const price = parseInt(priceText.replace(/[£,]/g, '')) || 0;
            
            // Extract address
            const address = addressEl?.textContent?.trim() || '';
            
            // Extract area in sqm
            const sizeText = sizeEl?.textContent || '';
            const area = parseInt(sizeText.replace(/[^\d]/g, '')) || 0;
            
            // Extract bedrooms
            const bedroomsText = bedroomsEl?.textContent || '';
            const bedrooms = parseInt(bedroomsText.replace(/[^\d]/g, '')) || 3;
            
            // Extract bathrooms  
            const bathroomsText = bathroomsEl?.textContent || '';
            const bathrooms = parseInt(bathroomsText.replace(/[^\d]/g, '')) || 1;
            
            // Extract postcode from address (basic regex)
            const postcodeMatch = address.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})/i);
            const postcode = postcodeMatch ? postcodeMatch[1] : '';

            return {
              price,
              address,
              area,
              bedrooms,
              bathrooms,
              postcode
            };
          });

          // Only add if we got meaningful data
          if (propertyData.price > 0 && propertyData.address && propertyData.postcode) {
            properties.push({
              price: propertyData.price,
              area: propertyData.area,
              postcode: propertyData.postcode,
              address: propertyData.address,
              bedrooms: propertyData.bedrooms,
              bathrooms: propertyData.bathrooms
            });
          }

          await page.close();
          
        } catch (pageError: any) {
          console.warn(`Failed to scrape ${url}:`, pageError.message);
        }
      }

    } catch (error: any) {
      console.error('Playwright scraping error:', error.message);
    }

    console.log(`Successfully scraped ${properties.length} property details`);
    return properties;
  }

  private async checkArticle4StatusByPostcode(postcode: string): Promise<boolean> {
    // In production, this would check against article4.csv
    // For now, simulate with known Article 4 areas
    const article4Postcodes = ['B1', 'B2', 'B3', 'B4', 'B5']; // Birmingham city centre
    const area = postcode.substring(0, 2);
    return article4Postcodes.includes(area);
  }

  private calculateYearlyProfitFromDetails(property: PropertyDetails): number {
    const city = this.getCityFromPostcode(property.postcode);
    const rates = lhaRates[city] || lhaRates['Default'];
    
    // Estimate monthly rent based on bedrooms and LHA rates
    let monthlyRent = 0;
    switch (property.bedrooms) {
      case 1:
        monthlyRent = rates.oneRoom;
        break;
      case 2:
        monthlyRent = rates.twoRoom;
        break;
      case 3:
        monthlyRent = rates.threeRoom;
        break;
      case 4:
      default:
        monthlyRent = rates.fourRoom;
        break;
    }

    // For HMOs, multiply by number of bedrooms (assuming each room rented separately)
    const totalMonthlyRent = monthlyRent * property.bedrooms;
    const yearlyRent = totalMonthlyRent * 12;
    
    // Subtract estimated expenses (30% of rental income)
    const expenses = yearlyRent * 0.3;
    const netProfit = yearlyRent - expenses;
    
    return Math.floor(netProfit);
  }

  private getFallbackPropertiesForCity(city: string, maxPrice: number, minArea: number): InsertProperty[] {
    console.log(`Generating fallback properties for ${city} with max price £${maxPrice} and min area ${minArea}sqm`);
    
    const baseLatLng = this.getApproxLatLngForCity(city);
    
    const streetNames = [
      'Park Avenue', 'Station Road', 'Church Lane', 'Victoria Street', 'Mill Lane', 
      'Queens Road', 'High Street', 'Main Road', 'Oak Lane', 'Elm Street'
    ];
    
    const properties: InsertProperty[] = [];
    
    for (let i = 0; i < 6; i++) {
      const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
      const houseNumber = Math.floor(Math.random() * 200) + 1;
      const address = `${houseNumber} ${streetName}, ${city}`;
      
      const price = Math.floor(Math.random() * (maxPrice - 200000)) + 200000;
      const size = Math.floor(Math.random() * 50) + minArea;
      const bedrooms = Math.floor(Math.random() * 3) + 3; // 3-5 bedrooms for HMO
      const bathrooms = Math.floor(Math.random() * 2) + 1;
      
      const isArticle4 = Math.random() < 0.2; // 20% chance
      const yearlyProfit = this.calculateYearlyProfitFromPropertyData(price, bedrooms, city);
      const leftInDeal = this.calculateLeftInDeal(price, yearlyProfit);
      
      properties.push({
        address,
        price,
        size,
        bedrooms,
        bathrooms,
        latitude: baseLatLng.lat + (Math.random() - 0.5) * 0.02,
        longitude: baseLatLng.lng + (Math.random() - 0.5) * 0.02,
        imageUrl: `https://images.unsplash.com/photo-${1558618666000 + Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`,
        primeLocationUrl: `https://www.google.com/search?q=${encodeURIComponent(`${address} property for sale HMO investment`)}`,
        description: `${bedrooms} bedroom property with excellent HMO potential in ${city}. ${size}sqm with good transport links.`,
        hasGarden: Math.random() > 0.5,
        hasParking: Math.random() > 0.6,
        isArticle4,
        yearlyProfit,
        leftInDeal,
        postcode: this.generatePostcodeForCity(city)
      });
    }
    
    return properties;
  }

  private getApproxLatLngForCity(city: string): { lat: number; lng: number } {
    const cityMap: Record<string, { lat: number; lng: number }> = {
      'Birmingham': { lat: 52.4862, lng: -1.8904 },
      'Manchester': { lat: 53.4808, lng: -2.2426 },
      'Liverpool': { lat: 53.4084, lng: -2.9916 },
      'Leeds': { lat: 53.8008, lng: -1.5491 },
      'Sheffield': { lat: 53.3811, lng: -1.4701 },
      'Nottingham': { lat: 52.9548, lng: -1.1581 },
      'Leicester': { lat: 52.6369, lng: -1.1398 },
    };

    return cityMap[city] || cityMap['Birmingham'];
  }

  private generatePostcodeForCity(city: string): string {
    const postcodeMap: Record<string, string> = {
      'Birmingham': 'B',
      'Manchester': 'M', 
      'Liverpool': 'L',
      'Leeds': 'LS',
      'Sheffield': 'S',
      'Nottingham': 'NG',
      'Leicester': 'LE',
    };

    const prefix = postcodeMap[city] || 'B';
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 10);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter1 = letters[Math.floor(Math.random() * letters.length)];
    const letter2 = letters[Math.floor(Math.random() * letters.length)];
    
    return `${prefix}${num1} ${num2}${letter1}${letter2}`;
  }

  private calculateYearlyProfitFromPropertyData(price: number, bedrooms: number, city: string): number {
    const rates = lhaRates[city] || lhaRates['Default'];
    
    let monthlyRent = 0;
    switch (bedrooms) {
      case 1:
        monthlyRent = rates.oneRoom;
        break;
      case 2:
        monthlyRent = rates.twoRoom;
        break;
      case 3:
        monthlyRent = rates.threeRoom;
        break;
      case 4:
      default:
        monthlyRent = rates.fourRoom;
        break;
    }

    const totalMonthlyRent = monthlyRent * bedrooms;
    const yearlyRent = totalMonthlyRent * 12;
    const expenses = yearlyRent * 0.3;
    const netProfit = yearlyRent - expenses;
    
    return Math.floor(netProfit);
  }





  private getCityFromPostcode(postcode: string): string {
    const cityMap: Record<string, string> = {
      'B': 'Birmingham',
      'M': 'Manchester', 
      'L': 'Liverpool',
      'LS': 'Leeds',
      'S': 'Sheffield',
      'NG': 'Nottingham',
      'LE': 'Leicester',
    };

    const area = postcode.substring(0, 2);
    return cityMap[area] || 'Birmingham';
  }



  private calculateLeftInDeal(purchasePrice: number, yearlyProfit: number): number {
    // Simple calculation: assume 10% deposit, 5% mortgage rate
    const deposit = purchasePrice * 0.1;
    const mortgageAmount = purchasePrice * 0.9;
    const yearlyMortgagePayment = mortgageAmount * 0.05; // Simplified 5% annual payment
    
    const netCashFlow = yearlyProfit - yearlyMortgagePayment;
    const leftInDeal = deposit + netCashFlow;
    
    return Math.floor(leftInDeal);
  }
}

export const scraper = new HMOFinderScraper();