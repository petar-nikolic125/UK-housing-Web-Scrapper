import { useState } from "react";
import { Search, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ScrapeResponse {
  message: string;
  properties: any[];
  count: number;
}

export default function ScraperInterface() {
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("500000");
  const [minArea, setMinArea] = useState("90");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scrapeMutation = useMutation({
    mutationFn: async ({ city, maxPrice, minArea }: { city: string; maxPrice: number; minArea: number }) => {
      const response = await fetch('/api/properties/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, maxPrice, minArea })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to scrape properties');
      }
      
      return response.json() as Promise<ScrapeResponse>;
    },
    onSuccess: (data) => {
      toast({
        title: "Properties Found Successfully",
        description: `Found ${data.count} suitable HMO properties`,
      });
      
      // Invalidate properties cache to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Scraping Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleScrape = () => {
    if (!city.trim()) {
      toast({
        title: "City Required",
        description: "Please enter a UK city to search for HMO properties",
        variant: "destructive",
      });
      return;
    }

    scrapeMutation.mutate({ 
      city: city.trim(),
      maxPrice: parseInt(maxPrice),
      minArea: parseInt(minArea)
    });
  };

  return (
    <div className="bg-gradient-to-r from-hmo-green to-hmo-blue p-6 rounded-lg text-white mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Download className="text-white" size={24} />
        <div>
          <h3 className="text-lg font-semibold">Live HMO Property Finder</h3>
          <p className="text-green-100 text-sm">Search multiple property sites for HMO investments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <Input
            type="text"
            placeholder="Enter UK city (e.g., Birmingham, Manchester, Leeds)"
            className="bg-white text-gray-900 border-0"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScrape()}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-green-100">Max Price (£)</label>
          <Select value={maxPrice} onValueChange={setMaxPrice}>
            <SelectTrigger className="bg-white text-gray-900 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300000">£300k</SelectItem>
              <SelectItem value="400000">£400k</SelectItem>
              <SelectItem value="500000">£500k</SelectItem>
              <SelectItem value="600000">£600k</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-green-100">Min Area (sqm)</label>
          <Select value={minArea} onValueChange={setMinArea}>
            <SelectTrigger className="bg-white text-gray-900 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="80">80 sqm</SelectItem>
              <SelectItem value="90">90 sqm</SelectItem>
              <SelectItem value="100">100 sqm</SelectItem>
              <SelectItem value="120">120 sqm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-xs text-green-100">
          Filters: Article 4 areas excluded • HMO suitable properties only
        </div>

        <Button
          onClick={handleScrape}
          disabled={scrapeMutation.isPending}
          className="bg-white text-hmo-green hover:bg-gray-100 font-medium px-6"
        >
          {scrapeMutation.isPending ? (
            <>
              <Search className="animate-spin mr-2" size={16} />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2" size={16} />
              Find Properties
            </>
          )}
        </Button>
      </div>

      {scrapeMutation.isPending && (
        <Alert className="mt-4 bg-white/10 border-white/20 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Searching Rightmove, Zoopla, and other property sites for HMO opportunities... This may take 10-30 seconds.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}