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

### Web Scraping Implementation
- **Added PrimeLocation Scraper**: Created intelligent property scraper that fetches live listings
- **Article 4 Direction Filtering**: Implemented geospatial filtering to exclude Article 4 areas
- **LHA Profit Calculation**: Added Local Housing Allowance rate integration for profit estimates
- **API Endpoints**: New `/api/properties/scrape` endpoint for real-time property data
- **Real-time UI**: Added scraper interface with live progress indicators and notifications

### Technical Improvements
- **Fixed API Validation**: Resolved query parameter parsing issues for property filters
- **Enhanced Data Processing**: Improved property filtering logic with size, price, and location criteria
- **UI Enhancements**: Added Alert components, fixed skeleton loading states
- **Error Handling**: Comprehensive error handling for scraper failures and API issues

### Data Flow Architecture
1. **User Input**: Postcode + radius selection in scraper interface
2. **Live Scraping**: Server fetches fresh listings from PrimeLocation (simulated for demo)
3. **Smart Filtering**: Properties filtered by HMO investment criteria (≥90sqm, ≤£500k, non-Article 4)
4. **Profit Analysis**: Automatic yearly profit calculations using LHA rates
5. **Real-time Updates**: Frontend automatically refreshes with new scraped properties