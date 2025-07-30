import { type Property } from "@shared/schema";

// This file contains mock data for development purposes
// In production, all data would come from real property APIs

export const mockProperties: Property[] = [
  {
    id: "1",
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
    postcode: "B1 1AA",
    createdAt: new Date("2024-01-15T10:00:00Z")
  },
  {
    id: "2",
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
    postcode: "B2 4QA",
    createdAt: new Date("2024-01-14T14:30:00Z")
  }
];

export const mockArticle4Areas = [
  {
    name: "Birmingham City Centre",
    coordinates: [
      [52.4751, -1.9026],
      [52.4851, -1.9026],
      [52.4851, -1.8826],
      [52.4751, -1.8826]
    ]
  }
];

export const mockLHARates = {
  B1: { oneRoom: 350, twoRoom: 450, threeRoom: 550, fourRoom: 650 },
  B2: { oneRoom: 330, twoRoom: 430, threeRoom: 530, fourRoom: 630 },
  B3: { oneRoom: 320, twoRoom: 420, threeRoom: 520, fourRoom: 620 },
  B4: { oneRoom: 340, twoRoom: 440, threeRoom: 540, fourRoom: 640 },
  B5: { oneRoom: 310, twoRoom: 410, threeRoom: 510, fourRoom: 610 },
  B6: { oneRoom: 360, twoRoom: 460, threeRoom: 560, fourRoom: 660 },
};
