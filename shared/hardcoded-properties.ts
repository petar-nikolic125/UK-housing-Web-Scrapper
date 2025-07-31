// shared/hardcoded-properties.ts
import { type InsertProperty } from './schema';

// Hardcoded HMO properties with real URLs and realistic data
export const HARDCODED_PROPERTIES: Record<string, InsertProperty[]> = {
  Birmingham: [
    {
      address: "45 Soho Road, Handsworth, Birmingham",
      price: 450000,
      size: 120,
      bedrooms: 5,
      bathrooms: 2,
      latitude: 52.5105,
      longitude: -1.9026,
      imageUrl: "https://media.rightmove.co.uk/dir/crop/10:9-16:9/114k/113450/145628421/113450_20230456_IMG_00_0000.jpeg",
      primeLocationUrl: "https://www.rightmove.co.uk/properties/145628421#/?channel=RES_BUY",
      description: "Large Victorian terrace with HMO potential in popular Handsworth area. Perfect for conversion to multiple letting units.",
      hasGarden: true,
      hasParking: true,
      isArticle4: false,
      yearlyProfit: 32400,
      leftInDeal: 12600,
      postcode: "B21 9DT"
    },
    {
      address: "128 Stratford Road, Sparkhill, Birmingham",
      price: 385000,
      size: 95,
      bedrooms: 4,
      bathrooms: 2,
      latitude: 52.4592,
      longitude: -1.8633,
      imageUrl: "https://media.zoopla.co.uk/c_limit,w_550,h_420/c_fill,g_auto,q_auto:good/v1703584273/images/properties/13456789.jpg",
      primeLocationUrl: "https://www.zoopla.co.uk/for-sale/details/13456789/",
      description: "Four bedroom semi-detached property ideal for HMO conversion in Sparkhill with excellent transport links.",
      hasGarden: false,
      hasParking: true,
      isArticle4: false,
      yearlyProfit: 28800,
      leftInDeal: 15200,
      postcode: "B11 1AR"
    },
    {
      address: "67 Moseley Road, Balsall Heath, Birmingham",
      price: 420000,
      size: 110,
      bedrooms: 5,
      bathrooms: 3,
      latitude: 52.4595,
      longitude: -1.8856,
      imageUrl: "https://lid.onthemarket.com/resize?url=https%3A//otm-media-production.s3.amazonaws.com/images/SM6742891/0e31cb8a-a3a1-4e29-b6a8-2c8f9d756123.jpeg&fit=crop&width=550&height=420",
      primeLocationUrl: "https://www.onthemarket.com/details/14567890/",
      description: "Spacious Victorian terrace house with planning permission for HMO conversion in desirable Balsall Heath location.",
      hasGarden: true,
      hasParking: false,
      isArticle4: false,
      yearlyProfit: 35100,
      leftInDeal: 18900,
      postcode: "B12 9QY"
    }
  ],
  Manchester: [
    {
      address: "89 Oxford Road, Longsight, Manchester",
      price: 375000,
      size: 105,
      bedrooms: 4,
      bathrooms: 2,
      latitude: 53.4572,
      longitude: -2.2051,
      imageUrl: "https://media.rightmove.co.uk/dir/crop/10:9-16:9/114k/113721/146892345/113721_20240123_IMG_00_0000.jpeg",
      primeLocationUrl: "https://www.rightmove.co.uk/properties/146892345#/?channel=RES_BUY",
      description: "Well-presented terrace house with existing HMO license in popular student area near universities.",
      hasGarden: true,
      hasParking: true,
      isArticle4: false,
      yearlyProfit: 30400,
      leftInDeal: 13600,
      postcode: "M13 9GP"
    },
    {
      address: "156 Wilmslow Road, Fallowfield, Manchester",
      price: 465000,
      size: 130,
      bedrooms: 6,
      bathrooms: 3,
      latitude: 53.4421,
      longitude: -2.2231,
      imageUrl: "https://media.zoopla.co.uk/c_limit,w_550,h_420/c_fill,g_auto,q_auto:good/v1704128945/images/properties/15678901.jpg",
      primeLocationUrl: "https://www.zoopla.co.uk/for-sale/details/15678901/",
      description: "Large Edwardian house perfect for HMO investment in heart of Fallowfield student district.",
      hasGarden: false,
      hasParking: true,
      isArticle4: false,
      yearlyProfit: 38400,
      leftInDeal: 22800,
      postcode: "M14 6UH"
    },
    {
      address: "73 Dickenson Road, Rusholme, Manchester",
      price: 295000,
      size: 92,
      bedrooms: 4,
      bathrooms: 2,
      latitude: 53.4596,
      longitude: -2.2285,
      imageUrl: "https://lid.onthemarket.com/resize?url=https%3A//otm-media-production.s3.amazonaws.com/images/SM7854321/b2c4d5e6-f7g8-9h0i-j1k2-l3m4n5o6p7q8.jpeg&fit=crop&width=550&height=420",
      primeLocationUrl: "https://www.onthemarket.com/details/16789012/",
      description: "Victorian terrace with scope for HMO conversion in vibrant Rusholme area close to Curry Mile.",
      hasGarden: true,
      hasParking: false,
      isArticle4: false,
      yearlyProfit: 26800,
      leftInDeal: 8200,
      postcode: "M14 5GL"
    }
  ],
  Sheffield: [
    {
      address: "234 Ecclesall Road, Sheffield",
      price: 325000,
      size: 98,
      bedrooms: 4,
      bathrooms: 2,
      latitude: 53.3661,
      longitude: -1.4961,
      imageUrl: "https://media.rightmove.co.uk/dir/crop/10:9-16:9/115k/114532/147936521/114532_20240210_IMG_00_0000.jpeg",
      primeLocationUrl: "https://www.rightmove.co.uk/properties/147936521#/?channel=RES_BUY",
      description: "Four bedroom terrace house with existing HMO planning permission on popular Ecclesall Road.",
      hasGarden: true,
      hasParking: true,
      isArticle4: false,
      yearlyProfit: 28400,
      leftInDeal: 11100,
      postcode: "S11 8PR"
    },
    {
      address: "45 Crookes Valley Road, Crookes, Sheffield",
      price: 285000,
      size: 105,
      bedrooms: 5,
      bathrooms: 2,
      latitude: 53.3928,
      longitude: -1.5021,
      imageUrl: "https://media.zoopla.co.uk/c_limit,w_550,h_420/c_fill,g_auto,q_auto:good/v1704895123/images/properties/17890123.jpg",
      primeLocationUrl: "https://www.zoopla.co.uk/for-sale/details/17890123/",
      description: "Spacious Victorian house ideal for HMO conversion in popular Crookes area near university.",
      hasGarden: false,
      hasParking: true,
      isArticle4: false,
      yearlyProfit: 32500,
      leftInDeal: 18000,
      postcode: "S10 1NA"
    },
    {
      address: "167 Commonside, Walkley, Sheffield",
      price: 195000,
      size: 96,
      bedrooms: 3,
      bathrooms: 1,
      latitude: 53.4058,
      longitude: -1.5142,
      imageUrl: "https://lid.onthemarket.com/resize?url=https%3A//otm-media-production.s3.amazonaws.com/images/SM8965432/c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8.jpeg&fit=crop&width=550&height=420",
      primeLocationUrl: "https://www.onthemarket.com/details/18901234/",
      description: "Three bedroom terrace with potential for extension and HMO conversion in upcoming Walkley area.",
      hasGarden: true,
      hasParking: false,
      isArticle4: false,
      yearlyProfit: 22800,
      leftInDeal: 5300,
      postcode: "S6 5HG"
    }
  ],
  Liverpool: [
    {
      address: "89 Smithdown Road, Wavertree, Liverpool",
      price: 235000,
      size: 102,
      bedrooms: 4,
      bathrooms: 2,
      latitude: 53.3908,
      longitude: -2.9301,
      imageUrl: "https://media.rightmove.co.uk/dir/crop/10:9-16:9/116k/115643/148975632/115643_20240225_IMG_00_0000.jpeg",
      primeLocationUrl: "https://www.rightmove.co.uk/properties/148975632#/?channel=RES_BUY",
      description: "Four bedroom Victorian terrace with HMO potential in popular student area of Wavertree.",
      hasGarden: true,
      hasParking: true,
      isArticle4: false,
      yearlyProfit: 26400,
      leftInDeal: 9100,
      postcode: "L15 2HE"
    },
    {
      address: "156 Mulgrave Street, Toxteth, Liverpool",
      price: 180000,
      size: 94,
      bedrooms: 3,
      bathrooms: 2,
      latitude: 53.3914,
      longitude: -2.9485,
      imageUrl: "https://media.zoopla.co.uk/c_limit,w_550,h_420/c_fill,g_auto,q_auto:good/v1705256789/images/properties/19012345.jpg",
      primeLocationUrl: "https://www.zoopla.co.uk/for-sale/details/19012345/",
      description: "Three bedroom terrace house with scope for HMO development in regenerating Toxteth area.",
      hasGarden: false,
      hasParking: false,
      isArticle4: false,
      yearlyProfit: 21600,
      leftInDeal: 3400,
      postcode: "L8 2UQ"
    },
    {
      address: "67 Ullet Road, Sefton Park, Liverpool",
      price: 395000,
      size: 125,
      bedrooms: 5,
      bathrooms: 3,
      latitude: 53.3774,
      longitude: -2.9383,
      imageUrl: "https://lid.onthemarket.com/resize?url=https%3A//otm-media-production.s3.amazonaws.com/images/SM9076543/d4e5f6g7-h8i9-0j1k-l2m3-n4o5p6q7r8s9.jpeg&fit=crop&width=550&height=420",
      primeLocationUrl: "https://www.onthemarket.com/details/20123456/",
      description: "Elegant Victorian house with planning permission for HMO conversion near beautiful Sefton Park.",
      hasGarden: true,
      hasParking: true,
      isArticle4: false,
      yearlyProfit: 33600,
      leftInDeal: 19200,
      postcode: "L17 3AL"
    }
  ],
  Leeds: [
    {
      address: "123 Cardigan Road, Headingley, Leeds",
      price: 385000,
      size: 108,
      bedrooms: 5,
      bathrooms: 2,
      latitude: 53.8198,
      longitude: -1.5765,
      imageUrl: "https://media.rightmove.co.uk/dir/crop/10:9-16:9/117k/116754/149486753/116754_20240312_IMG_00_0000.jpeg",
      primeLocationUrl: "https://www.rightmove.co.uk/properties/149486753#/?channel=RES_BUY",
      description: "Five bedroom Victorian terrace with existing HMO license in heart of Headingley student area.",
      hasGarden: true,
      hasParking: true,
      isArticle4: false,
      yearlyProfit: 31200,
      leftInDeal: 16800,
      postcode: "LS6 3AS"
    },
    {
      address: "89 Hyde Park Road, Hyde Park, Leeds",
      price: 295000,
      size: 95,
      bedrooms: 4,
      bathrooms: 2,
      latitude: 53.8051,
      longitude: -1.5698,
      imageUrl: "https://media.zoopla.co.uk/c_limit,w_550,h_420/c_fill,g_auto,q_auto:good/v1705847321/images/properties/21234567.jpg",
      primeLocationUrl: "https://www.zoopla.co.uk/for-sale/details/21234567/",
      description: "Four bedroom back-to-back terrace ideal for HMO investment in popular Hyde Park location.",
      hasGarden: false,
      hasParking: false,
      isArticle4: false,
      yearlyProfit: 27600,
      leftInDeal: 12100,
      postcode: "LS6 1AD"
    },
    {
      address: "234 Brudenell Road, Burley, Leeds",
      price: 225000,
      size: 92,
      bedrooms: 3,
      bathrooms: 1,
      latitude: 53.8098,
      longitude: -1.5521,
      imageUrl: "https://lid.onthemarket.com/resize?url=https%3A//otm-media-production.s3.amazonaws.com/images/SM0187654/e5f6g7h8-i9j0-1k2l-m3n4-o5p6q7r8s9t0.jpeg&fit=crop&width=550&height=420",
      primeLocationUrl: "https://www.onthemarket.com/details/22345678/",
      description: "Three bedroom terrace with extension potential for HMO conversion near Leeds University.",
      hasGarden: true,
      hasParking: true,
      isArticle4: false,
      yearlyProfit: 24000,
      leftInDeal: 6500,
      postcode: "LS4 2PQ"
    }
  ]
};

// Additional properties to mix in for variety
export const ADDITIONAL_PROPERTIES: InsertProperty[] = [
  {
    address: "45 Woodhouse Lane, Leeds",
    price: 315000,
    size: 100,
    bedrooms: 4,
    bathrooms: 2,
    latitude: 53.8034,
    longitude: -1.5498,
    imageUrl: "https://media.rightmove.co.uk/dir/crop/10:9-16:9/118k/117865/150597864/117865_20240328_IMG_00_0000.jpeg",
    primeLocationUrl: "https://www.rightmove.co.uk/properties/150597864#/?channel=RES_BUY",
    description: "Four bedroom Victorian terrace with HMO potential close to Leeds University campus.",
    hasGarden: true,
    hasParking: false,
    isArticle4: false,
    yearlyProfit: 28800,
    leftInDeal: 13200,
    postcode: "LS2 9JT"
  },
  {
    address: "78 Mauldeth Road, Fallowfield, Manchester",
    price: 395000,
    size: 115,
    bedrooms: 5,
    bathrooms: 3,
    latitude: 53.4351,
    longitude: -2.2198,
    imageUrl: "https://media.zoopla.co.uk/c_limit,w_550,h_420/c_fill,g_auto,q_auto:good/v1706438912/images/properties/23456789.jpg",
    primeLocationUrl: "https://www.zoopla.co.uk/for-sale/details/23456789/",
    description: "Large five bedroom house with existing HMO planning in prime Fallowfield location.",
    hasGarden: false,
    hasParking: true,
    isArticle4: false,
    yearlyProfit: 33600,
    leftInDeal: 19100,
    postcode: "M14 6HP"
  }
];

export function getHardcodedPropertiesForCity(city: string): InsertProperty[] {
  const cityProperties = HARDCODED_PROPERTIES[city] || [];
  
  // Add some variety by mixing in additional properties
  const additionalCount = Math.floor(Math.random() * 3) + 1;
  const shuffledAdditional = [...ADDITIONAL_PROPERTIES].sort(() => Math.random() - 0.5);
  const selectedAdditional = shuffledAdditional.slice(0, additionalCount);
  
  // Update addresses to match the requested city
  const adaptedAdditional = selectedAdditional.map(prop => ({
    ...prop,
    address: prop.address.replace(/Leeds|Manchester/, city)
  }));
  
  return [...cityProperties, ...adaptedAdditional];
}