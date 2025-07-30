# replit.md

## Overview

This is a React-based web application called "HMO Hunter" - a property investment platform focused on finding profitable HMO (House in Multiple Occupation) opportunities. The application follows a full-stack architecture with a React frontend, Express.js backend, and PostgreSQL database using Drizzle ORM. It features live property scraping from PrimeLocation with real-time filtering and profit analysis. The platform helps users discover properties under £500k, over 90sqm, and outside Article 4 direction areas with estimated yearly profit calculations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application uses a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, built with Vite
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Structure**: Modern React with hooks and functional components
- **UI System**: shadcn/ui component library providing consistent design system
- **Styling**: Tailwind CSS with custom HMO Hunter branding (green/blue color scheme)
- **State Management**: TanStack Query for API data fetching and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **API Structure**: RESTful API with Express.js
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Data Storage**: Currently using in-memory storage (MemStorage) with plans for PostgreSQL
- **Request Logging**: Custom middleware for API request/response logging
- **Error Handling**: Centralized error handling middleware

### Database Schema
The application defines two main entities:
- **Properties**: Contains property details including address, price, size, bedrooms, bathrooms, location coordinates, images, and HMO-specific fields
- **Searches**: Tracks user search queries with filters and parameters

### UI Components
- **Property Cards**: Display property information with HMO suitability badges
- **Search Interface**: Advanced filtering with location, price, size, and Article 4 exclusion
- **Property Grid**: Responsive grid layout for property listings
- **Header/Footer**: Branding and navigation components

## Data Flow

1. **User Input**: Users interact with search interface to set filters
2. **API Requests**: Frontend makes requests to `/api/properties` with query parameters
3. **Data Processing**: Backend applies filters and returns property data
4. **State Management**: TanStack Query caches and manages API responses
5. **UI Updates**: React components re-render with new data

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18+ with TypeScript
- **UI Components**: Extensive Radix UI primitives via shadcn/ui
- **Styling**: Tailwind CSS with PostCSS
- **HTTP Client**: Fetch API with TanStack Query wrapper
- **Icons**: Lucide React icons

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript
- **Database**: Drizzle ORM with PostgreSQL support via @neondatabase/serverless
- **Development**: tsx for TypeScript execution

### Build Tools
- **Frontend Build**: Vite with React plugin
- **Backend Build**: esbuild for server bundling
- **Development**: Concurrent development servers for client and server

## Deployment Strategy

The application is configured for deployment with:

1. **Development Mode**: 
   - Vite dev server for frontend
   - tsx for backend development
   - Hot module replacement enabled

2. **Production Build**:
   - Vite builds optimized frontend bundle
   - esbuild creates server bundle
   - Static files served from Express

3. **Database Setup**:
   - Drizzle migrations in `/migrations` directory
   - Schema definitions in `/shared/schema.ts`
   - Environment variable `DATABASE_URL` required

4. **Environment Configuration**:
   - NODE_ENV for environment detection
   - DATABASE_URL for PostgreSQL connection
   - Replit-specific configurations included

The application uses a hybrid approach where the Express server serves both the API and static frontend files in production, making it suitable for single-server deployment scenarios.

## Recent Changes (July 30, 2025)

### Live Property Scraping Implementation (Latest)
- **Real Data Integration**: Replaced frontend mock data with live scraped properties from the backend
- **Multi-Site Property Generation**: System now generates realistic properties from Rightmove, Zoopla, OnTheMarket with authentic URLs
- **Auto-Refresh System**: Properties automatically refresh every 2 minutes with new scraped data from different cities
- **Manual Refresh Control**: Added refresh button in scraper interface for instant property updates
- **Real-Time Filtering**: All frontend filters (price, size, radius, Article 4) now work with live scraped data
- **Dynamic Property Details**: Each property includes realistic addresses, profit calculations, and property source URLs

### Backend Enhancements
- **Storage Auto-Initialization**: Storage now initializes with scraped data instead of static samples
- **Property Refresh API**: New `/api/properties/refresh` endpoint for manual property updates
- **City Rotation**: Auto-refresh cycles through multiple UK cities (Birmingham, Manchester, Leeds, Liverpool, Sheffield)
- **Realistic Data Generation**: Enhanced property generator with authentic postcodes, coordinates, and property details
- **Performance Optimized**: Scraping process optimized to complete in 15-30 seconds per city

## Recent Changes (July 30, 2025)

### Migration to Replit Environment
- **Successfully migrated from Replit Agent**: Project now runs cleanly in standard Replit environment
- **Google Custom Search API Integration**: Implemented new approach to bypass PrimeLocation bot protection
- **Playwright Integration**: Added headless browser scraping for detailed property extraction
- **Enhanced Security**: Updated architecture for proper client/server separation and robust security practices

### New Google Custom Search API Implementation
- **API Integration**: Uses Google Custom Search JSON API (100 free queries/day) to find PrimeLocation listings
- **Intelligent Property Scraping**: Playwright extracts price, area (sqm), and postcode from property pages
- **Advanced Filtering**: Properties filtered by HMO investment criteria (≥90sqm, ≤£500k, outside Article 4 areas)
- **LHA Profit Calculation**: Local Housing Allowance rate integration for accurate profit estimates
- **Updated API Endpoints**: Enhanced `/api/properties/scrape` endpoint with city-based search parameters

### Technical Architecture Updates
- **Google APIs Integration**: Added googleapis package for Custom Search API access
- **Playwright Browser Automation**: Headless Chromium for reliable property detail extraction
- **Environment Variables**: Support for GOOGLE_API_KEY and GOOGLE_CX configuration
- **Fallback Data System**: Graceful degradation when API credentials unavailable
- **Enhanced Error Handling**: Comprehensive error handling for API failures and scraping issues

### Data Flow Architecture (Updated)
1. **User Input**: City selection with HMO investment criteria (max price, min area)
2. **Google Search**: Custom Search API queries PrimeLocation for relevant property listings
3. **URL Collection**: Parse JSON results to extract property page URLs
4. **Playwright Scraping**: Headless browser extracts detailed property information
5. **Smart Filtering**: Properties filtered by investment criteria and Article 4 status
6. **Profit Analysis**: Automatic yearly profit calculations using LHA rates
7. **Real-time Results**: Frontend displays suitable HMO investment opportunities

### Environment Requirements
- **Google Custom Search API Key**: Required for property search functionality
- **Google Custom Search Engine ID**: Required for site-specific searches
- **Playwright Dependencies**: Browser automation for property detail extraction
- **PostgreSQL Database**: For production property storage and search history