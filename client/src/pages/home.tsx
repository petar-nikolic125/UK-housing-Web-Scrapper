import { useState } from "react";
import Header from "@/components/header";
import SearchInterface from "@/components/search-interface";
import ScraperInterface from "@/components/scraper-interface";
import PropertyGrid from "@/components/property-grid";
import Footer from "@/components/footer";
import { type PropertyFilters } from "@shared/schema";

export default function Home() {
  const [filters, setFilters] = useState<PropertyFilters>({
    query: "Birmingham",
    radius: 25,
    maxPrice: 500000,
    minSize: 90,
    excludeArticle4: true,
  });

  return (
    <div className="min-h-screen bg-main">
      <Header />
      <SearchInterface 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ScraperInterface />
      </div>
      <PropertyGrid filters={filters} onFiltersChange={setFilters} />
      <Footer />
    </div>
  );
}
