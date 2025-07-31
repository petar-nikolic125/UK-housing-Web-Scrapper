import { useState } from "react";
import { Search, Download, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ScrapeResponse {
  message: string;
  properties: any[];
  count: number;
}

/**
 * Gradient banner that triggers scraping / refreshing of properties.
 * Higher‑contrast colours + richer Tailwind detailing.
 */
export default function ScraperInterface() {
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("500000");
  const [minArea, setMinArea] = useState("90");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ─────────────────────────── mutations ───────────────────────────
  const refreshMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/properties/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: "Birmingham" }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to refresh properties");
      return (await res.json()) as ScrapeResponse;
    },
    onSuccess: (data) => {
      toast({
        title: "Properties Refreshed Successfully",
        description: `Updated with ${data.count} fresh properties from scraped sites`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (err: Error) =>
        toast({ title: "Refresh Failed", description: err.message, variant: "destructive" }),
  });

  const scrapeMutation = useMutation({
    mutationFn: async ({ city, maxPrice, minArea }: { city: string; maxPrice: number; minArea: number }) => {
      const res = await fetch("/api/properties/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, maxPrice, minArea }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to scrape properties");
      return (await res.json()) as ScrapeResponse;
    },
    onSuccess: (data) => {
      toast({
        title: "Properties Found Successfully",
        description: `Found ${data.count} suitable HMO properties`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (err: Error) =>
        toast({ title: "Scraping Failed", description: err.message, variant: "destructive" }),
  });

  const handleScrape = () => {
    if (!city.trim()) {
      toast({ title: "City Required", description: "Please enter a UK city to search", variant: "destructive" });
      return;
    }
    scrapeMutation.mutate({ city: city.trim(), maxPrice: +maxPrice, minArea: +minArea });
  };

  // ─────────────────────────── ui ───────────────────────────
  return (
      <section className="rounded-xl shadow-lg mb-8 bg-gradient-to-r from-green-800 via-green-900 to-blue-900 text-white px-8 py-8 ring-1 ring-black/5">
        {/* header */}
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-2 ring-inset ring-white/20 backdrop-blur-sm shadow-inner">
            <Download size={24} />
          </div>
          <div className="leading-tight">
            <h3 className="text-2xl font-extrabold tracking-tight drop-shadow-sm">Live HMO Property Finder</h3>
            <p className="text-sm text-green-200 max-w-sm">
              Search Rightmove, Zoopla & other sites for HMO investments
            </p>
          </div>
        </div>

        {/* form grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {/* City input */}
          <div className="sm:col-span-2">
            <Input
                type="text"
                placeholder="e.g. Birmingham, Manchester, Leeds"
                className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md focus:ring-2 focus:ring-green-600 focus:outline-none shadow-sm"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScrape()}
            />
          </div>

          {/* Price */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-medium text-green-200">Max Price (£)</label>
            <Select value={maxPrice} onValueChange={setMaxPrice}>
              <SelectTrigger className="bg-white text-gray-900 ring-1 ring-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl">
                {[300000, 400000, 500000, 600000].map((v) => (
                    <SelectItem key={v} value={String(v)}>
                      £{v / 1000}k
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-medium text-green-200">Min Area (sqm)</label>
            <Select value={minArea} onValueChange={setMinArea}>
              <SelectTrigger className="bg-white text-gray-900 ring-1 ring-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl">
                {[80, 90, 100, 120].map((v) => (
                    <SelectItem key={v} value={String(v)}>
                      {v} sqm
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* footer actions */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-green-200">
            Filters: Article 4 areas excluded · HMO‑suitable only
          </p>

          <div className="flex gap-4">
            {/* scrape */}
            <Button
                onClick={handleScrape}
                disabled={scrapeMutation.isPending}
                className="bg-white text-green-900 hover:bg-gray-100 flex items-center gap-2 font-semibold shadow-lg rounded-md px-6 py-2 transition-colors"
            >
              {scrapeMutation.isPending ? (
                  <>
                    <Search className="animate-spin" size={16} /> Searching…
                  </>
              ) : (
                  <>
                    <Search size={16} /> Find Properties
                  </>
              )}
            </Button>

            {/* refresh – now RED */}
            <Button
                onClick={() => refreshMutation.mutate()}
                disabled={refreshMutation.isPending}
                className="bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white flex items-center gap-2 font-semibold shadow-lg rounded-md px-5 py-2 ring-1 ring-inset ring-red-700/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 transition-transform active:scale-95"
            >
              {refreshMutation.isPending ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} /> Updating…
                  </>
              ) : (
                  <>
                    <RefreshCw size={16} /> Refresh
                  </>
              )}
            </Button>
          </div>
        </div>

        {/* live status */}
        {(scrapeMutation.isPending || refreshMutation.isPending) && (
            <Alert className="mt-6 bg-white/10 border-white/30 text-white/90 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {scrapeMutation.isPending
                    ? "Searching property sites… This may take 10–30 s."
                    : "Refreshing properties… This may take 15–30 s."}
              </AlertDescription>
            </Alert>
        )}

        <p className="mt-6 text-xs text-green-200/80">
          Properties auto‑refresh every 5 minutes • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </section>
  );
}
