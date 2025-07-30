import { useState } from "react";
import Header from "@/components/header";
import SearchInterface from "@/components/search-interface";
import PropertyGrid from "@/components/property-grid";
import Footer from "@/components/footer";
import { type PropertyFilters } from "@shared/schema";

export default function Home() {
  const [filters, setFilters] = useState<PropertyFilters>({
    query: "Birmingham",
    radius: 10,
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
      <PropertyGrid filters={filters} />
      <Footer />
    </div>
  );
}
