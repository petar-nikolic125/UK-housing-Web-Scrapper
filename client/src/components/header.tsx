import { useQuery } from "@tanstack/react-query";
import { Home, Settings, Menu } from "lucide-react";

interface PropertyStats {
  totalProperties: number;
  nonArticle4Properties: number;
  averagePrice: number;
  averageSize: number;
}

export default function Header() {
  const { data: stats } = useQuery<PropertyStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-hmo-green rounded-lg flex items-center justify-center">
              <Home className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">HMO HUNTER</h1>
              <p className="text-sm text-secondary">Discover profitable HMO opportunities under £500k</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="text-center">
              <div className="text-lg font-semibold hmo-green">
                {stats?.totalProperties || 0}
              </div>
              <div className="text-xs text-secondary">HMO Properties</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold hmo-blue">
                {stats?.nonArticle4Properties || 0}+ Non-Article 4
              </div>
              <div className="text-xs text-secondary">Available Properties</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">Live Data from PrimeLocation</div>
              <div className="text-xs text-secondary">Updated hourly</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors">
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button className="p-2 text-secondary hover:text-primary transition-colors md:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
