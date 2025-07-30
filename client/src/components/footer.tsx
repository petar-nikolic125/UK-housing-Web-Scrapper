import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-hmo-green rounded-lg flex items-center justify-center">
                <Home className="text-white" size={16} />
              </div>
              <h3 className="text-lg font-bold text-primary">HMO Hunter</h3>
            </div>
            <p className="text-secondary text-sm mb-4">
              Discover profitable HMO investment opportunities across the UK. We filter properties under £500k, 
              over 90sqm, and outside Article 4 direction areas to help you find the best deals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary hover:text-hmo-green transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-secondary hover:text-hmo-green transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-secondary hover:text-hmo-green transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-secondary hover:text-hmo-green transition-colors">HMO Guide</a></li>
              <li><a href="#" className="text-secondary hover:text-hmo-green transition-colors">Article 4 Info</a></li>
              <li><a href="#" className="text-secondary hover:text-hmo-green transition-colors">Investment Calculator</a></li>
              <li><a href="#" className="text-secondary hover:text-hmo-green transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-secondary hover:text-hmo-green transition-colors">Help Center</a></li>
              <li><a href="#" className="text-secondary hover:text-hmo-green transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-secondary hover:text-hmo-green transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-secondary hover:text-hmo-green transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-secondary text-sm">
            © 2024 HMO Hunter. All rights reserved. Data sourced from PrimeLocation.
          </p>
          <p className="text-secondary text-sm mt-2 md:mt-0">
            Last updated: 2 minutes ago
          </p>
        </div>
      </div>
    </footer>
  );
}
