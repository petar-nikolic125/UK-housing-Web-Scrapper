import { useQuery } from "@tanstack/react-query";
import { Home, Settings, Menu } from "lucide-react";

interface PropertyStats {
  totalProperties: number;
  nonArticle4Properties: number;
  averagePrice: number;
  averageSize: number;
}

/**
 * Top navigation / stats bar.
 * Tailwind is used *a lot* – custom colours are replaced with darker greens / blacks for better contrast.
 */
export default function Header() {
  const { data: stats } = useQuery<PropertyStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return (
      <header className="bg-white dark:bg-gray-950/90 sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/70 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-6">
            {/* ─────────── Logo / brand ─────────── */}
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-green-800 text-white shadow-inner ring-2 ring-green-900/30 hover:ring-green-900/50 transition-all">
                <Home size={20} />
              </div>
              <div className="leading-tight">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 uppercase">
                  HMO Hunter
                </h1>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Discover profitable HMO opportunities under £500k
                </p>
              </div>
            </div>

            {/* ─────────── Live stats (desktop) ─────────── */}
            <div className="hidden md:flex items-center gap-10">
              <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-green-900 dark:text-green-300 drop-shadow-sm">
                {stats?.totalProperties ?? 0}
              </span>
                <span className="text-[11px] tracking-wide text-gray-600 dark:text-gray-400 uppercase">
                HMO Properties
              </span>
              </div>
              <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-900 dark:text-blue-300 drop-shadow-sm">
                {stats?.nonArticle4Properties ?? 0}+
              </span>
                <span className="text-[11px] tracking-wide text-gray-600 dark:text-gray-400 uppercase whitespace-nowrap">
                Non‑Article 4
              </span>
              </div>
              <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Live Data from PrimeLocation
              </span>
                <span className="text-[11px] tracking-wide text-gray-600 dark:text-gray-400 uppercase">
                Updated hourly
              </span>
              </div>
            </div>

            {/* ─────────── Actions ─────────── */}
            <div className="flex items-center gap-4">
              {/* Settings (desktop) */}
              <button
                  className="relative hidden md:inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/40 focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950 transition-shadow"
              >
                <Settings size={16} strokeWidth={1.75} />
                <span>Settings</span>
              </button>

              {/* Mobile menu */}
              <button
                  className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/40 focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950"
              >
                <Menu size={20} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </header>
  );
}
