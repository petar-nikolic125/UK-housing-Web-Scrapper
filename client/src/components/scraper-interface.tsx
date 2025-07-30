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
  const [postcode, setPostcode] = useState("");
  const [radius, setRadius] = useState("10");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scrapeMutation = useMutation({
    mutationFn: async ({ postcode, radiusKm }: { postcode: string; radiusKm: number }) => {
      const response = await fetch('/api/properties/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode, radiusKm })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to scrape properties');
      }
      
      return response.json() as Promise<ScrapeResponse>;
    },
    onSuccess: (data) => {
      toast({
        title: "Properties Scraped Successfully",
        description: `Found ${data.count} new HMO properties from PrimeLocation`,
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
    if (!postcode.trim()) {
      toast({
        title: "Postcode Required",
        description: "Please enter a UK postcode to search for properties",
        variant: "destructive",
      });
      return;
    }

    scrapeMutation.mutate({ 
      postcode: postcode.trim().toUpperCase(), 
      radiusKm: parseInt(radius) 
    });
  };

  return (
    <div className="bg-gradient-to-r from-hmo-green to-hmo-blue p-6 rounded-lg text-white mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Download className="text-white" size={24} />
        <div>
          <h3 className="text-lg font-semibold">Live Property Scraper</h3>
          <p className="text-green-100 text-sm">Get fresh listings from PrimeLocation</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Enter UK postcode (e.g., B1 1AA, M1 1AA)"
            className="bg-white text-gray-900 border-0"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScrape()}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-green-100">Radius:</label>
          <Select value={radius} onValueChange={setRadius}>
            <SelectTrigger className="w-32 bg-white text-gray-900 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 km</SelectItem>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="15">15 km</SelectItem>
              <SelectItem value="25">25 km</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleScrape}
          disabled={scrapeMutation.isPending}
          className="bg-white text-hmo-green hover:bg-gray-100 font-medium px-6"
        >
          {scrapeMutation.isPending ? (
            <>
              <Search className="animate-spin mr-2" size={16} />
              Scraping...
            </>
          ) : (
            <>
              <Search className="mr-2" size={16} />
              Scrape Properties
            </>
          )}
        </Button>
      </div>

      {scrapeMutation.isPending && (
        <Alert className="mt-4 bg-white/10 border-white/20 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Searching PrimeLocation for properties... This may take 10-30 seconds.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}