import { useState } from "react";
import { ExternalLink, Heart, Bed, Bath, Car, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const formatPrice = (price: number) => {
    return `£${price.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 flex-shrink-0">
        <img 
          src={property.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
          alt={`${property.address} property exterior`}
          className="w-full h-full object-cover"
        />
        
        {/* HMO Suitable Badge */}
        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
          HMO Suitable
        </div>
        
        {/* Favorite Button */}
        <button 
          onClick={toggleFavorite}
          className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
        >
          <Heart 
            size={16} 
            className={isFavorited ? "text-red-500 fill-current" : "text-gray-500"} 
          />
        </button>
        
        {/* View Property Button */}
        <div className="absolute bottom-3 left-3 right-3">
          <Button 
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            size="sm"
          >
            <a 
              href={property.primeLocationUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2"
            >
              <ExternalLink size={16} />
              <span>View Property</span>
            </a>
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Address */}
        <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 min-h-[3.5rem]">
          {property.address}
        </h3>
        
        {/* Price and Size */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(property.price)}
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {property.size}sqm
            </Badge>
            <Badge 
              variant="secondary" 
              className={property.isArticle4 
                ? "bg-red-50 text-red-700 border-red-200 text-xs" 
                : "bg-green-50 text-green-700 border-green-200 text-xs"
              }
            >
              {property.isArticle4 ? "Article 4" : "Non-Article 4"}
            </Badge>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
          <div className="flex items-center space-x-1">
            <Bed size={16} />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath size={16} />
            <span>{property.bathrooms} bath</span>
          </div>
          {property.hasGarden && (
            <div className="flex items-center space-x-1">
              <Leaf size={16} />
              <span>Garden</span>
            </div>
          )}
          {property.hasParking && (
            <div className="flex items-center space-x-1">
              <Car size={16} />
              <span>Parking</span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {property.description}
        </p>
        
        {/* Financial Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="text-center flex-1">
            <div className="text-xs text-gray-500 mb-1">Left in Deal</div>
            <div className="font-semibold text-orange-600 text-sm">
              {property.leftInDeal ? formatPrice(property.leftInDeal) : "TBC"}
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 mx-3"></div>
          <div className="text-center flex-1">
            <div className="text-xs text-gray-500 mb-1">Yearly Profit</div>
            <div className="font-semibold text-green-600 text-sm">
              {property.yearlyProfit ? formatPrice(property.yearlyProfit) : "TBC"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
