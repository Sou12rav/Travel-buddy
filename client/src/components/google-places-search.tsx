import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Clock, Phone, Globe, Navigation } from "lucide-react";

interface GooglePlace {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceLevel?: number;
  photos: string[];
  types: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  openNow?: boolean;
}

interface PlaceDetails extends GooglePlace {
  phone?: string;
  website?: string;
  openingHours: string[];
  reviews: Array<{
    author: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

export default function GooglePlacesSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<GooglePlace | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Search places using Google Places API
  const { data: searchResults, isLoading: searchLoading, refetch: searchPlaces } = useQuery({
    queryKey: ['/api/google/places/search', searchQuery, userLocation],
    queryFn: async () => {
      if (!searchQuery.trim()) return { places: [] };
      
      const params = new URLSearchParams({ query: searchQuery });
      if (userLocation) {
        params.append('lat', userLocation.lat.toString());
        params.append('lng', userLocation.lng.toString());
      }
      
      const response = await fetch(`/api/google/places/search?${params}`);
      if (!response.ok) throw new Error('Failed to search places');
      return response.json();
    },
    enabled: false
  });

  // Get detailed information for selected place
  const { data: placeDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['/api/google/places', selectedPlace?.id],
    queryFn: async () => {
      if (!selectedPlace?.id) return null;
      
      const response = await fetch(`/api/google/places/${selectedPlace.id}`);
      if (!response.ok) throw new Error('Failed to get place details');
      return response.json();
    },
    enabled: !!selectedPlace?.id
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchPlaces();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Google Places Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for restaurants, attractions, hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={searchLoading}>
              Search
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={getCurrentLocation}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Use My Location
            </Button>
            {userLocation && (
              <Badge variant="secondary">
                Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults?.places && searchResults.places.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {searchResults.places.map((place: GooglePlace) => (
                <div 
                  key={place.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedPlace(place)}
                >
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
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {place.types.slice(0, 3).map((type, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {type.replace(/_/g, ' ')}
                      </Badge>
                    ))}
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
                      className="w-full h-32 object-cover rounded mt-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Place Details */}
      {selectedPlace && (
        <Card>
          <CardHeader>
            <CardTitle>Place Details</CardTitle>
          </CardHeader>
          <CardContent>
            {detailsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ) : placeDetails?.place ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">{placeDetails.place.name}</h2>
                  <p className="text-gray-600">{placeDetails.place.address}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {placeDetails.place.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{placeDetails.place.phone}</span>
                    </div>
                  )}
                  {placeDetails.place.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={placeDetails.place.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {placeDetails.place.openingHours.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Opening Hours</h4>
                    <div className="text-sm space-y-1">
                      {placeDetails.place.openingHours.map((hours, index) => (
                        <div key={index}>{hours}</div>
                      ))}
                    </div>
                  </div>
                )}

                {placeDetails.place.photos.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {placeDetails.place.photos.slice(0, 6).map((photo, index) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`${placeDetails.place.name} photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {placeDetails.place.reviews.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Recent Reviews</h4>
                    <div className="space-y-3">
                      {placeDetails.place.reviews.slice(0, 3).map((review, index) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{review.author}</span>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading place details...</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}