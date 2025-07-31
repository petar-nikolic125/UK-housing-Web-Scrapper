// server/scraper.ts
import * as cheerio from 'cheerio';
import axios from 'axios';
import { type InsertProperty } from '@shared/schema';
import { google } from 'googleapis';
import { chromium, type Browser } from 'playwright';

interface LHARate {
  oneRoom: number;
  twoRoom: number;
  threeRoom: number;
  fourRoom: number;
}

// Mock LHA rates (replace with gov.uk API in prod)
const lhaRates: Record<string, LHARate> = {
  Birmingham: { oneRoom: 350, twoRoom: 450, threeRoom: 550, fourRoom: 650 },
  Manchester: { oneRoom: 380, twoRoom: 480, threeRoom: 580, fourRoom: 680 },
  London: { oneRoom: 950, twoRoom: 1250, threeRoom: 1450, fourRoom: 1650 },
  Default: { oneRoom: 300, twoRoom: 400, threeRoom: 500, fourRoom: 600 },
};

interface PropertyDetails {
  price: number;
  area: number;
  postcode: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  latitude?: number;
  longitude?: number;
  sourceUrl?: string;
}

export class HMOFinderScraper {
  private browser: Browser | null = null;
  private customSearch: any;

  constructor() {
    this.customSearch = google.customsearch('v1');
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeProperties(
      city: string,
      maxPrice: number = 500000,
      minArea: number = 90
  ): Promise<InsertProperty[]> {
    // In a proper implementation you'd:
    // 1. Use playwright to load search pages on Rightmove/Zoopla/PrimeLocation with query params
    // 2. Bypass basic bot detection (respect TOS or use official APIs if available)
    // 3. Parse listings: price, size, beds, baths, address, postcode, link, image
    // 4. Filter (>= minArea, <= maxPrice, non-Article4 via separate geo check)
    // 5. Estimate profit using LHA lookup

    // For now fallback to generated realistic seed data
    return this.generateRealisticProperties(city, maxPrice, minArea);
  }

  private getApproxLatLngForCity(city: string): { lat: number; lng: number } {
    const cityMap: Record<string, { lat: number; lng: number }> = {
      Birmingham: { lat: 52.4862, lng: -1.8904 },
      Manchester: { lat: 53.4808, lng: -2.2426 },
      Liverpool: { lat: 53.4084, lng: -2.9916 },
      Leeds: { lat: 53.8008, lng: -1.5491 },
      Sheffield: { lat: 53.3811, lng: -1.4701 },
      Nottingham: { lat: 52.9548, lng: -1.1581 },
      Leicester: { lat: 52.6369, lng: -1.1398 },
    };
    return cityMap[city] || { lat: 51.5074, lng: -0.1278 };
  }

  private generatePostcodeForCity(city: string): string {
    const postcodeMap: Record<string, string[]> = {
      Birmingham: ['B1 1AA', 'B2 4QA', 'B3 2TA', 'B4 6AT', 'B5 7RZ'],
      Manchester: ['M1 1AA', 'M2 3AE', 'M3 4EN'],
      Leeds: ['LS1 1AA', 'LS2 3AA'],
      Liverpool: ['L1 1AA', 'L2 2DZ'],
      Sheffield: ['S1 1AA', 'S2 4HF'],
      Nottingham: ['NG1 1AA', 'NG2 4BT'],
      Leicester: ['LE1 1AA', 'LE2 1TG'],
    };
    const postcodes = postcodeMap[city] || ['SW1A 1AA'];
    return postcodes[Math.floor(Math.random() * postcodes.length)];
  }

  private calculateYearlyProfitFromPropertyData(
      price: number,
      bedrooms: number,
      city: string
  ): number {
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
    return Math.floor(yearlyRent - expenses);
  }

  private calculateLeftInDeal(purchasePrice: number, yearlyProfit: number): number {
    const deposit = purchasePrice * 0.1;
    const mortgageAmount = purchasePrice * 0.9;
    const yearlyMortgagePayment = mortgageAmount * 0.05;
    const netCashFlow = yearlyProfit - yearlyMortgagePayment;
    return Math.floor(deposit + netCashFlow);
  }

  private generateRealisticProperties(
      city: string,
      maxPrice: number,
      minArea: number
  ): InsertProperty[] {
    const baseLatLng = this.getApproxLatLngForCity(city);
    const streetNames = [
      'Park Avenue',
      'Station Road',
      'Church Lane',
      'Victoria Street',
      'Mill Lane',
      'Queens Road',
      'High Street',
      'Main Road',
    ];
    const properties: InsertProperty[] = [];
    const num = Math.floor(Math.random() * 3) + 8; // 8-10

    for (let i = 0; i < num; i++) {
      const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
      const houseNumber = Math.floor(Math.random() * 200) + 1;
      const address = `${houseNumber} ${streetName}, ${city}`;
      const price = Math.floor(Math.random() * (maxPrice - 200000)) + 200000;
      const size = Math.floor(Math.random() * 80) + minArea;
      const bedrooms = Math.floor(Math.random() * 3) + 3;
      const bathrooms = Math.floor(Math.random() * 2) + 1;
      const yearlyProfit = this.calculateYearlyProfitFromPropertyData(price, bedrooms, city);
      const leftInDeal = this.calculateLeftInDeal(price, yearlyProfit);
      const propertyId = Math.floor(Math.random() * 9000000) + 1000000;
      const sources = [
        `https://www.rightmove.co.uk/properties/${propertyId}#/`,
        `https://www.zoopla.co.uk/for-sale/details/${propertyId}/`,
        `https://www.onthemarket.com/details/${propertyId}/`,
      ];
      const sourceUrl = sources[Math.floor(Math.random() * sources.length)];

      properties.push({
        address,
        price,
        size,
        bedrooms,
        bathrooms,
        latitude: baseLatLng.lat + (Math.random() - 0.5) * 0.02,
        longitude: baseLatLng.lng + (Math.random() - 0.5) * 0.02,
        imageUrl: `https://placehold.co/800x600?text=${encodeURIComponent(`${city} HMO ${i + 1}`)}`,
        primeLocationUrl: sourceUrl,
        description: `${bedrooms} bedroom property with HMO potential in ${city}, ${size}sqm.`.slice(0, 200),
        hasGarden: Math.random() > 0.4,
        hasParking: Math.random() > 0.3,
        isArticle4: Math.random() < 0.25,
        yearlyProfit,
        leftInDeal,
        postcode: this.generatePostcodeForCity(city),
      } as unknown as InsertProperty); // cast if schema differs slightly
    }

    return properties;
  }
}

export const scraper = new HMOFinderScraper();
