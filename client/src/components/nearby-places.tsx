import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Star, Clock, Utensils, Camera, ShoppingBag, Building } from "lucide-react";

const PLACE_TYPES = [
  { id: 'restaurant', label: 'Restaurants', icon: Utensils },
  { id: 'tourist_attraction', label: 'Attractions', icon: Camera },
  { id: 'shopping_mall', label: 'Shopping', icon: ShoppingBag },
  { id: 'lodging', label: 'Hotels', icon: Building },
  { id: 'hospital', label: 'Hospitals', icon: Building },
  { id: 'gas_station', label: 'Gas Stations', icon: Building }
];

interface NearbyPlace {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceLevel?: number;
  types: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  openNow?: boolean;
  photos: string[];
}

export default function NearbyPlaces() {
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [selectedType, setSelectedType] = useState('restaurant');
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const { data: nearbyPlaces, isLoading, refetch } = useQuery({
    queryKey: ['/api/google/nearby', userLocation, selectedType],
    queryFn: async () => {
      if (!userLocation) return { places: [] };
      
      const params = new URLSearchParams({
        lat: userLocation.lat.toString(),
        lng: userLocation.lng.toString(),
        type: selectedType,
        radius: '5000'
      });
      
      const response = await fetch(`/api/google/nearby?${params}`);
      if (!response.ok) throw new Error('Failed to get nearby places');
      return response.json();
    },
    enabled: !!userLocation
  });

  const getDirections = (place: NearbyPlace) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${place.coordinates.lat},${place.coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  const getPriceLevelText = (level?: number) => {
    switch (level) {
      case 1: return "Budget";
      case 2: return "Moderate";
      case 3: return "Expensive";
      case 4: return "Very Expensive";
      default: return "";
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Places
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {locationError ? (
            <div className="text-center space-y-2">
              <p className="text-red-600">{locationError}</p>
              <Button onClick={getCurrentLocation} variant="outline">
                <Navigation className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : userLocation ? (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Navigation className="h-3 w-3 mr-1" />
                Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </Badge>
              <Button onClick={getCurrentLocation} variant="outline" size="sm">
                Update Location
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p>Getting your location...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Place Type Selection */}
      {userLocation && (
        <Card>
          <CardHeader>
            <CardTitle>What are you looking for?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PLACE_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    onClick={() => setSelectedType(type.id)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {userLocation && (
        <Card>
          <CardHeader>
            <CardTitle>
              {PLACE_TYPES.find(t => t.id === selectedType)?.label} Near You
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse border rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : nearbyPlaces?.places && nearbyPlaces.places.length > 0 ? (
              <div className="space-y-4">
                {nearbyPlaces.places.map((place: NearbyPlace) => (
                  <div key={place.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{place.name}</h3>
                      <div className="flex items-center gap-1">
                        {place.rating > 0 && (
                          <>
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{place.rating}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{place.address}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {place.priceLevel && (
                        <Badge variant="secondary" className="text-xs">
                          {getPriceLevelText(place.priceLevel)}
                        </Badge>
                      )}
                      {place.openNow !== undefined && (
                        <Badge 
                          variant={place.openNow ? "default" : "destructive"} 
                          className="text-xs"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {place.openNow ? "Open" : "Closed"}
                        </Badge>
                      )}
                    </div>
                    
                    {place.photos.length > 0 && (
                      <img 
                        src={place.photos[0]} 
                        alt={place.name}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )}
                    
                    <Button 
                      onClick={() => getDirections(place)}
                      className="w-full"
                      variant="outline"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No places found nearby.</p>
                <Button onClick={() => refetch()} variant="outline" className="mt-2">
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}