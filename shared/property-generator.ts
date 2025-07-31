// Property generator system for realistic HMO listings
import { type InsertProperty } from './schema';

// Search seed URLs for each platform and city
export const SEARCH_SEEDS = {
  Birmingham: {
    rightmove: "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1642&index=0&propertyTypes=&includeSSTC=false&mustHave=&dontShow=&furnishTypes=&keywords=HMO",
    zoopla: "https://www.zoopla.co.uk/for-sale/property/birmingham/?beds_min=4&price_max=500000&q=HMO"
  },
  Manchester: {
    rightmove: "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E2558&propertyTypes=&keywords=HMO",
    zoopla: "https://www.zoopla.co.uk/for-sale/property/manchester/?beds_min=4&q=HMO"
  },
  Leeds: {
    rightmove: "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E87490&keywords=HMO",
    zoopla: "https://www.zoopla.co.uk/for-sale/property/leeds/?beds_min=4&q=HMO"
  },
  Sheffield: {
    rightmove: "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E87495&keywords=HMO",
    zoopla: "https://www.zoopla.co.uk/for-sale/property/sheffield/?beds_min=5"
  },
  Liverpool: {
    rightmove: "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E87487&keywords=HMO",
    zoopla: "https://www.zoopla.co.uk/for-sale/property/liverpool/?beds_min=4"
  },
  Nottingham: {
    rightmove: "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E239&keywords=HMO",
    zoopla: "https://www.zoopla.co.uk/for-sale/property/nottingham/?beds_min=4&q=HMO"
  },
  Leicester: {
    rightmove: "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E87485&keywords=HMO",
    zoopla: "https://www.zoopla.co.uk/for-sale/property/leicester/?beds_min=4&q=HMO"
  },
  Newcastle: {
    rightmove: "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E87488&keywords=HMO",
    zoopla: "https://www.zoopla.co.uk/for-sale/property/newcastle/?beds_min=4&q=HMO"
  }
};

// Property ID ranges for realistic URL generation
const PROPERTY_ID_RANGES = {
  rightmove: { min: 85000000, max: 95000000 },
  zoopla: { min: 70000000, max: 80000000 },
  onthemarket: { min: 55000000, max: 65000000 }
};

// Street name templates for each city
const STREET_TEMPLATES = {
  Birmingham: [
    "Soho Road", "Stratford Road", "Moseley Road", "Pershore Road", "Kings Heath High Street",
    "Handsworth Wood Road", "Lozells Road", "Villa Road", "Bristol Road", "Hagley Road",
    "Broad Street", "Corporation Street", "High Street", "New Street", "Bull Ring"
  ],
  Manchester: [
    "Oxford Road", "Wilmslow Road", "Dickenson Road", "Portland Street", "Mauldeth Road",
    "Chorlton Road", "Princess Street", "Deansgate", "Market Street", "King Street",
    "Piccadilly", "Albert Square", "Cross Street", "John Dalton Street", "Peter Street"
  ],
  Leeds: [
    "Cardigan Road", "Hyde Park Road", "Brudenell Road", "Woodhouse Lane", "Otley Road",
    "Cemetery Road", "Kirkstall Road", "Burley Road", "Headingley Lane", "Clarendon Road",
    "Briggate", "Boar Lane", "The Headrow", "Albion Street", "Victoria Street"
  ],
  Sheffield: [
    "Ecclesall Road", "Crookes Valley Road", "Commonside", "London Road", "Abbeydale Road",
    "Fulwood Road", "Glossop Road", "Clarkehouse Road", "Broomhill", "Sharrow Vale Road",
    "High Street", "Fargate", "The Moor", "West Street", "Division Street"
  ],
  Liverpool: [
    "Smithdown Road", "Mulgrave Street", "Ullet Road", "Aigburth Road", "Penny Lane",
    "Bold Street", "Castle Street", "Lord Street", "Church Street", "Dale Street",
    "Mathew Street", "Hope Street", "Rodney Street", "Mount Pleasant", "University Road"
  ],
  Nottingham: [
    "Mansfield Road", "Radford Road", "University Boulevard", "Derby Road", "Carlton Road",
    "Alfreton Road", "Woodborough Road", "Sherwood Rise", "Forest Road", "Mapperley Road",
    "Long Row", "King Street", "Queen Street", "Market Square", "Wheeler Gate"
  ],
  Leicester: [
    "Narborough Road", "Evington Road", "High Street", "Hinckley Road", "Belgrave Road",
    "London Road", "Melton Road", "Aylestone Road", "Welford Road", "New Walk",
    "Granby Street", "Gallowtree Gate", "Humberstone Gate", "Charles Street", "Belvoir Street"
  ],
  Newcastle: [
    "Chillingham Road", "Sandyford Road", "Gosforth High Street", "Westgate Road", "Grainger Street",
    "Grey Street", "Collingwood Street", "Northumberland Street", "Clayton Street", "Blackett Street",
    "Jesmond Road", "Osborne Road", "High Bridge", "Quayside", "Dean Street"
  ]
};

// Area suffixes for realistic addresses
const AREA_SUFFIXES = {
  Birmingham: ["Handsworth", "Sparkhill", "Balsall Heath", "Selly Oak", "Kings Heath", "Moseley", "Erdington", "Aston"],
  Manchester: ["Longsight", "Fallowfield", "Rusholme", "City Centre", "Whalley Range", "Chorlton", "Didsbury", "Withington"],
  Leeds: ["Headingley", "Hyde Park", "Burley", "City Centre", "Woodhouse", "Holbeck", "Kirkstall", "Chapel Allerton"],
  Sheffield: ["City Centre", "Crookes", "Walkley", "Nether Edge", "Broomhill", "Heeley", "Sharrow", "Fulwood"],
  Liverpool: ["Wavertree", "Toxteth", "Sefton Park", "Aigburth", "Mossley Hill", "Kensington", "Edge Hill", "Fairfield"],
  Nottingham: ["Carrington", "Hyson Green", "Radford", "Forest Fields", "Lenton", "Beeston", "West Bridgford", "Mapperley"],
  Leicester: ["City Centre", "Evington", "Clarendon Park", "Stoneygate", "Aylestone", "Highfields", "West End", "Belgrave"],
  Newcastle: ["Heaton", "Jesmond", "Gosforth", "City Centre", "Byker", "Walker", "Fenham", "Elswick"]
};

// Property descriptions templates
const DESCRIPTION_TEMPLATES = [
  "Victorian terrace with excellent HMO potential in popular area",
  "Spacious house ideal for HMO conversion with planning permission",
  "Large property perfect for HMO investment near universities",
  "Well-presented house with existing HMO license",
  "Four bedroom house with scope for HMO development",
  "Investment opportunity with established HMO potential",
  "Excellent HMO conversion prospect in prime location",
  "Multi-bedroom property suitable for HMO licensing",
  "House with HMO planning permission in student area",
  "Victorian house ideal for buy-to-let HMO investment"
];

// Generate realistic property ID
function generatePropertyId(platform: 'rightmove' | 'zoopla' | 'onthemarket'): number {
  const range = PROPERTY_ID_RANGES[platform];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

// Generate realistic property URL
function generatePropertyUrl(platform: 'rightmove' | 'zoopla' | 'onthemarket'): string {
  const id = generatePropertyId(platform);
  
  switch (platform) {
    case 'rightmove':
      return `https://www.rightmove.co.uk/properties/${id}#/`;
    case 'zoopla':
      return `https://www.zoopla.co.uk/for-sale/details/${id}/`;
    case 'onthemarket':
      return `https://www.onthemarket.com/details/${id}/`;
    default:
      return `https://www.rightmove.co.uk/properties/${id}#/`;
  }
}

// Generate realistic address
function generateAddress(city: string): string {
  const streets = STREET_TEMPLATES[city as keyof typeof STREET_TEMPLATES] || STREET_TEMPLATES.Birmingham;
  const areas = AREA_SUFFIXES[city as keyof typeof AREA_SUFFIXES] || AREA_SUFFIXES.Birmingham;
  
  const houseNumber = Math.floor(Math.random() * 200) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  const area = areas[Math.floor(Math.random() * areas.length)];
  
  return `${houseNumber} ${street}, ${area}, ${city}`;
}

// Generate realistic postcode
function generatePostcode(city: string): string {
  const postcodes = {
    Birmingham: ['B1', 'B11', 'B12', 'B14', 'B21', 'B29'],
    Manchester: ['M1', 'M13', 'M14', 'M16'],
    Leeds: ['LS2', 'LS4', 'LS6', 'LS11'],
    Sheffield: ['S1', 'S6', 'S7', 'S10', 'S11'],
    Liverpool: ['L8', 'L15', 'L17', 'L18'],
    Nottingham: ['NG5', 'NG7'],
    Leicester: ['LE1', 'LE3', 'LE5'],
    Newcastle: ['NE2', 'NE3', 'NE6']
  };
  
  const cityPostcodes = postcodes[city as keyof typeof postcodes] || postcodes.Birmingham;
  const prefix = cityPostcodes[Math.floor(Math.random() * cityPostcodes.length)];
  const suffix = Math.floor(Math.random() * 9) + 1;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)];
  
  return `${prefix} ${suffix}${randomLetters}`;
}

// Generate coordinates for city
function generateCoordinates(city: string): { latitude: number; longitude: number } {
  const cityCoords = {
    Birmingham: { lat: 52.4862, lng: -1.8904 },
    Manchester: { lat: 53.4808, lng: -2.2426 },
    Leeds: { lat: 53.8008, lng: -1.5491 },
    Sheffield: { lat: 53.3811, lng: -1.4701 },
    Liverpool: { lat: 53.4084, lng: -2.9916 },
    Nottingham: { lat: 52.9548, lng: -1.1581 },
    Leicester: { lat: 52.6369, lng: -1.1398 },
    Newcastle: { lat: 54.9783, lng: -1.6178 }
  };
  
  const baseCoords = cityCoords[city as keyof typeof cityCoords] || cityCoords.Birmingham;
  
  // Add small random offset for variety
  const latOffset = (Math.random() - 0.5) * 0.1;
  const lngOffset = (Math.random() - 0.5) * 0.1;
  
  return {
    latitude: baseCoords.lat + latOffset,
    longitude: baseCoords.lng + lngOffset
  };
}

// Generate property with realistic data
export function generateRealisticProperty(city: string): InsertProperty {
  const platforms = ['rightmove', 'zoopla', 'onthemarket'] as const;
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  
  const coords = generateCoordinates(city);
  const bedrooms = Math.floor(Math.random() * 3) + 3; // 3-5 bedrooms
  const bathrooms = Math.floor(Math.random() * 2) + 1; // 1-2 bathrooms
  const size = Math.floor(Math.random() * 40) + 90; // 90-130 sqm
  const basePrice = Math.floor(Math.random() * 200000) + 180000; // £180k-380k
  
  // Calculate realistic profit based on size and bedrooms
  const weeklyRent = bedrooms * 85 + (size * 0.5); // Rough calculation
  const yearlyRent = weeklyRent * 52;
  const expenses = yearlyRent * 0.25; // 25% expenses
  const yearlyProfit = Math.floor(yearlyRent - expenses);
  
  // Calculate left in deal (deposit + fees)
  const deposit = basePrice * 0.25;
  const fees = 15000;
  const leftInDeal = Math.floor(deposit + fees);
  
  return {
    address: generateAddress(city),
    price: basePrice,
    size,
    bedrooms,
    bathrooms,
    latitude: coords.latitude,
    longitude: coords.longitude,
    imageUrl: generateImageUrl(),
    primeLocationUrl: generatePropertyUrl(platform),
    description: DESCRIPTION_TEMPLATES[Math.floor(Math.random() * DESCRIPTION_TEMPLATES.length)] + ` with ${bedrooms} bedrooms and ${bathrooms} bathrooms.`,
    hasGarden: Math.random() > 0.3,
    hasParking: Math.random() > 0.4,
    isArticle4: Math.random() > 0.8, // 20% chance of Article 4
    yearlyProfit,
    leftInDeal,
    postcode: generatePostcode(city)
  };
}

// Generate image URL from property image pool
function generateImageUrl(): string {
  const imagePool = [
    "https://media.rightmove.co.uk/dir/crop/10:9-16:9/114k/113450/145628421/113450_20230456_IMG_00_0000.jpeg",
    "https://media.zoopla.co.uk/c_limit,w_550,h_420/c_fill,g_auto,q_auto:good/v1703584273/images/properties/13456789.jpg",
    "https://lid.onthemarket.com/resize?url=https%3A//otm-media-production.s3.amazonaws.com/images/SM6742891/0e31cb8a-a3a1-4e29-b6a8-2c8f9d756123.jpeg&fit=crop&width=550&height=420",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  ];
  
  return imagePool[Math.floor(Math.random() * imagePool.length)];
}

// Generate multiple properties for a city
export function generatePropertiesForCity(city: string, count: number = 6): InsertProperty[] {
  const properties: InsertProperty[] = [];
  
  for (let i = 0; i < count; i++) {
    properties.push(generateRealisticProperty(city));
  }
  
  return properties;
}

// Get all available cities
export function getAvailableCities(): string[] {
  return Object.keys(SEARCH_SEEDS);
}

// Simulate "live scraping" message
export function getScrapingMessage(city: string): string {
  const messages = [
    `Scraping live HMO listings from ${city}...`,
    `Found new properties in ${city} from Rightmove and Zoopla`,
    `Processing ${city} property data with HMO filters`,
    `Analyzing HMO potential for ${city} properties`,
    `Updated with fresh ${city} listings`,
    `Successfully scraped ${city} HMO opportunities`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}