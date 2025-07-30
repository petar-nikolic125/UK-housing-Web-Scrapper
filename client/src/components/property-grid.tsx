import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "./property-card";
import { type Property, type PropertyFilters } from "@shared/schema";

interface PropertyGridProps {
  filters: PropertyFilters;
}

export default function PropertyGrid({ filters }: PropertyGridProps) {
  const { data: properties = [], isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties", filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (filters.query) searchParams.set('query', filters.query);
      if (filters.radius) searchParams.set('radius', filters.radius.toString());
      if (filters.maxPrice) searchParams.set('maxPrice', filters.maxPrice.toString());
      if (filters.minSize) searchParams.set('minSize', filters.minSize.toString());
      if (filters.excludeArticle4) searchParams.set('excludeArticle4', 'true');
      if (filters.sortBy) searchParams.set('sortBy', filters.sortBy);

      const response = await fetch(`/api/properties?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json();
    }
  });

  const handleSortChange = (sortBy: string) => {
    // This would be handled by the parent component
    console.log('Sort changed to:', sortBy);
  };

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading properties. Please try again.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            HMO Properties in {filters.query || 'UK'}
          </h2>
          {isLoading ? (
            <Skeleton className="h-4 w-64 mt-1" />
          ) : (
            <p className="text-secondary mt-1">
              Found {properties.length} profitable HMO opportunities • Updated 2 minutes ago
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-secondary">Sort by:</span>
          <Select defaultValue="profit" onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profit">Highest Profit</SelectItem>
              <SelectItem value="price">Lowest Price</SelectItem>
              <SelectItem value="size">Largest Size</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Property Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-5 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="flex justify-between pt-4">
                  <Skeleton className="h-12 w-20" />
                  <Skeleton className="h-12 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary text-lg">No properties found matching your criteria.</p>
          <p className="text-secondary text-sm mt-2">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Load More / Pagination */}
      {!isLoading && properties.length > 0 && (
        <div className="mt-12 text-center">
          <Button 
            variant="outline"
            className="px-8 py-3 font-medium"
          >
            Load More Properties
          </Button>
          <p className="text-secondary text-sm mt-2">
            Showing {properties.length} properties
          </p>
        </div>
      )}
    </main>
  );
}
