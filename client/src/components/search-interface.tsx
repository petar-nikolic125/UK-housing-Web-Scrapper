import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { type PropertyFilters } from "@shared/schema";

interface SearchInterfaceProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
}

export default function SearchInterface({ filters, onFiltersChange }: SearchInterfaceProps) {
  const [activeFiltersCount, setActiveFiltersCount] = useState(3);

  const handleQueryChange = (query: string) => {
    onFiltersChange({ ...filters, query });
  };

  const handleRadiusChange = (radius: string) => {
    onFiltersChange({ ...filters, radius: parseInt(radius) });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy: sortBy as PropertyFilters['sortBy'] });
  };

  const handleMaxPriceChange = (maxPrice: string) => {
    onFiltersChange({ ...filters, maxPrice: parseInt(maxPrice) });
  };

  const handleMinSizeChange = (minSize: string) => {
    onFiltersChange({ ...filters, minSize: parseInt(minSize) });
  };

  const toggleArticle4Filter = () => {
    onFiltersChange({ ...filters, excludeArticle4: !filters.excludeArticle4 });
  };

  const removeFilter = (filterType: string) => {
    const newFilters = { ...filters };
    switch (filterType) {
      case 'price':
        delete newFilters.maxPrice;
        break;
      case 'size':
        delete newFilters.minSize;
        break;
      case 'article4':
        newFilters.excludeArticle4 = false;
        break;
    }
    onFiltersChange(newFilters);
    setActiveFiltersCount(prev => prev - 1);
  };

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search Input */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
              <Input
                type="text"
                placeholder="Enter postcode (e.g., B1 1AA, Manchester, London)"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hmo-green focus:border-transparent"
                value={filters.query}
                onChange={(e) => handleQueryChange(e.target.value)}
              />
            </div>
          </div>

          {/* Radius Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-secondary">Radius:</label>
            <Select value={filters.radius?.toString()} onValueChange={handleRadiusChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 miles</SelectItem>
                <SelectItem value="10">10 miles</SelectItem>
                <SelectItem value="15">15 miles</SelectItem>
                <SelectItem value="25">25 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-secondary">Max Price:</label>
            <Select value={filters.maxPrice?.toString() || ""} onValueChange={handleMaxPriceChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300000">£300k</SelectItem>
                <SelectItem value="400000">£400k</SelectItem>
                <SelectItem value="500000">£500k</SelectItem>
                <SelectItem value="600000">£600k</SelectItem>
                <SelectItem value="750000">£750k</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Size Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-secondary">Min Size:</label>
            <Select value={filters.minSize?.toString() || ""} onValueChange={handleMinSizeChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="80">80 sqm</SelectItem>
                <SelectItem value="90">90 sqm</SelectItem>
                <SelectItem value="100">100 sqm</SelectItem>
                <SelectItem value="120">120 sqm</SelectItem>
                <SelectItem value="150">150 sqm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Article 4 Toggle */}
          <Button
            variant={filters.excludeArticle4 ? "default" : "outline"}
            onClick={toggleArticle4Filter}
            className="flex items-center space-x-2 px-4 py-3"
          >
            <Filter size={16} />
            <span className="font-medium">Exclude Article 4</span>
          </Button>
        </div>

        {/* Active Filters Display */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.maxPrice && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              Price ≤ £{filters.maxPrice.toLocaleString()}
              <button 
                className="ml-2 hover:text-green-900" 
                onClick={() => removeFilter('price')}
              >
                <X size={12} />
              </button>
            </Badge>
          )}
          {filters.minSize && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              Size ≥ {filters.minSize}sqm
              <button 
                className="ml-2 hover:text-blue-900" 
                onClick={() => removeFilter('size')}
              >
                <X size={12} />
              </button>
            </Badge>
          )}
          {filters.excludeArticle4 && (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
              Non-Article 4 Only
              <button 
                className="ml-2 hover:text-gray-900" 
                onClick={() => removeFilter('article4')}
              >
                <X size={12} />
              </button>
            </Badge>
          )}
        </div>
      </div>
    </section>
  );
}
