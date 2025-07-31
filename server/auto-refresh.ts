// Auto-refresh system for dynamic property updates
import { storage } from './storage';
import { getAvailableCities } from '@shared/property-generator';

class AutoRefreshManager {
  private intervalId: NodeJS.Timeout | null = null;
  private cityIndex = 0;
  private readonly refreshInterval = 2 * 60 * 1000; // 2 minutes

  start(): void {
    if (this.intervalId) {
      this.stop();
    }

    console.log('🔄 Starting auto-refresh system for live property updates');
    
    this.intervalId = setInterval(() => {
      this.refreshProperties();
    }, this.refreshInterval);

    // Initial refresh after 30 seconds
    setTimeout(() => {
      this.refreshProperties();
    }, 30000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ Stopped auto-refresh system');
    }
  }

  private async refreshProperties(): Promise<void> {
    try {
      const cities = getAvailableCities();
      const currentCity = cities[this.cityIndex % cities.length];
      
      console.log(`🔍 Auto-refreshing properties with new scraped data from ${currentCity}`);
      
      await storage.refreshWithScrapedData(currentCity, 500000, 90);
      
      this.cityIndex++;
      
      // Reset cycle after going through all cities
      if (this.cityIndex >= cities.length) {
        this.cityIndex = 0;
        console.log('🔄 Completed full city cycle, restarting...');
      }
      
    } catch (error) {
      console.error('Error during auto-refresh:', error);
    }
  }

  getCurrentCity(): string {
    const cities = getAvailableCities();
    return cities[this.cityIndex % cities.length];
  }

  getNextRefreshIn(): number {
    // Return milliseconds until next refresh
    return this.refreshInterval;
  }
}

export const autoRefreshManager = new AutoRefreshManager();

// Start auto-refresh when server starts
if (process.env.NODE_ENV !== 'test') {
  autoRefreshManager.start();
}

// Graceful shutdown
process.on('SIGINT', () => {
  autoRefreshManager.stop();
});

process.on('SIGTERM', () => {
  autoRefreshManager.stop();
});