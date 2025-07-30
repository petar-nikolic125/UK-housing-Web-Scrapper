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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative">
        <img 
          src={property.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
          alt={`${property.address} property exterior`}
          className="w-full h-48 object-cover"
        />
        
        {/* HMO Suitable Badge */}
        <div className="absolute top-3 left-3 bg-hmo-green text-white px-3 py-1 rounded-full text-sm font-medium">
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
        
        {/* View on PrimeLocation Button */}
        <div className="absolute bottom-3 left-3 right-3">
          <Button 
            asChild
            className="w-full bg-hmo-blue hover:bg-blue-600 text-white"
          >
            <a 
              href={property.primeLocationUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2"
            >
              <ExternalLink size={16} />
              <span>View Similar Properties</span>
            </a>
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Address */}
        <h3 className="font-semibold text-primary text-lg mb-2">
          {property.address}
        </h3>
        
        {/* Price and Size */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold hmo-green">
            {formatPrice(property.price)}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <Badge className="bg-blue-50 text-blue-700 border-blue-300">
              {property.size}sqm
            </Badge>
            <Badge className={property.isArticle4 ? "bg-red-50 text-red-700 border-red-300" : "bg-green-50 text-green-700 border-green-300"}>
              {property.isArticle4 ? "Article 4" : "Non-Article 4"}
            </Badge>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="flex items-center space-x-4 text-secondary text-sm mb-4">
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
        <p className="text-secondary text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        
        {/* Financial Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-sm text-secondary">Left in Deal:</div>
            <div className="font-semibold text-orange-600">
              {property.leftInDeal ? formatPrice(property.leftInDeal) : "TBC"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-secondary">Yearly Profit:</div>
            <div className="font-semibold hmo-green">
              {property.yearlyProfit ? formatPrice(property.yearlyProfit) : "TBC"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
