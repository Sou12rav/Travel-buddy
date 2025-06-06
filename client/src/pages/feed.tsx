import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  MapPin, 
  Bookmark,
  Star,
  Navigation,
  Clock,
  Camera,
  Utensils,
  ShoppingBag,
  Building,
  Fuel,
  Hospital,
  Compass
} from 'lucide-react';

// Interface for nearby places
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
  reviews?: PlaceReview[];
  businessHours?: string;
  phoneNumber?: string;
}

interface PlaceReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  profileImage?: string;
}

const PLACE_TYPES = [
  { id: 'restaurant', label: 'Restaurants', icon: Utensils, color: 'bg-orange-500' },
  { id: 'tourist_attraction', label: 'Attractions', icon: Camera, color: 'bg-blue-500' },
  { id: 'shopping_mall', label: 'Shopping', icon: ShoppingBag, color: 'bg-purple-500' },
  { id: 'lodging', label: 'Hotels', icon: Building, color: 'bg-green-500' },
  { id: 'hospital', label: 'Medical', icon: Hospital, color: 'bg-red-500' },
  { id: 'gas_station', label: 'Fuel', icon: Fuel, color: 'bg-yellow-500' }
];

export default function Feed() {
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('restaurant');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
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
          // Use Kolkata as fallback
          setUserLocation({
            lat: 22.5726,
            lng: 88.3639
          });
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      // Use Kolkata as fallback
      setUserLocation({
        lat: 22.5726,
        lng: 88.3639
      });
    }
  };

  const { data: nearbyPlaces, isLoading } = useQuery({
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

  const handleViewPlace = (place: NearbyPlace) => {
    setSelectedPlace(place);
    setIsPlaceDialogOpen(true);
  };

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

  if (isLoading && userLocation) {
    return (
      <div className="flex-1 overflow-y-auto pb-16 px-4">
        <header className="sticky top-0 bg-background dark:bg-background pt-4 pb-2 z-10">
          <h1 className="font-semibold text-xl text-foreground flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Explore Nearby
          </h1>
        </header>
        
        <div className="space-y-4 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const places = nearbyPlaces?.places || [];

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b pt-4 pb-3 px-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-semibold text-xl text-foreground flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Explore Nearby
          </h1>
          {userLocation && (
            <Button onClick={getCurrentLocation} variant="outline" size="sm">
              <Navigation className="h-4 w-4 mr-2" />
              Update Location
            </Button>
          )}
        </div>
        
        {/* Location Status */}
        {locationError ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{locationError}</p>
          </div>
        ) : userLocation && (
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </Badge>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PLACE_TYPES.map((type) => {
            const IconComponent = type.icon;
            return (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <IconComponent className="h-4 w-4" />
                {type.label}
              </Button>
            );
          })}
        </div>
      </header>

      <div className="px-4 pt-4">
        {places.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {places.map((place: NearbyPlace) => (
              <Card 
                key={place.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewPlace(place)}
              >
                {/* Place Image */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                  {place.photos && place.photos.length > 0 ? (
                    <img 
                      src={place.photos[0]} 
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className={`${PLACE_TYPES.find(t => t.id === selectedType)?.color || 'bg-gray-500'} text-white border-0`}>
                      {PLACE_TYPES.find(t => t.id === selectedType)?.label}
                    </Badge>
                  </div>
                  
                  {/* Rating Badge */}
                  {place.rating > 0 && (
                    <div className="absolute top-2 right-2 bg-black/70 rounded-lg px-2 py-1">
                      <div className="flex items-center gap-1 text-white text-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{place.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  {/* Place Name */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{place.name}</h3>
                  
                  {/* Address */}
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">{place.address}</span>
                  </div>
                  
                  {/* Place Details */}
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
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        getDirections(place);
                      }}
                      className="flex-1"
                      variant="outline"
                      size="sm"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPlace(place);
                      }}
                      className="flex-1"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userLocation ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">No {PLACE_TYPES.find(t => t.id === selectedType)?.label.toLowerCase()} found nearby</p>
            <p className="text-sm text-gray-500">Try selecting a different category or updating your location</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Getting your location...</p>
            <Button onClick={getCurrentLocation} variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Enable Location
            </Button>
          </div>
        )}
      </div>

      {/* Place Detail Dialog */}
      <Dialog open={isPlaceDialogOpen} onOpenChange={setIsPlaceDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh]">
          {selectedPlace && (
            <div className="flex flex-col">
              {/* Place Header */}
              <div className="flex items-center p-4 border-b">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{selectedPlace.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <MapPin size={12} className="mr-1" />
                    {selectedPlace.address}
                  </div>
                </div>
                {selectedPlace.rating > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{selectedPlace.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              {/* Place Image */}
              <div className="bg-muted overflow-hidden" style={{ maxHeight: '50vh' }}>
                {selectedPlace.photos && selectedPlace.photos.length > 0 ? (
                  <img 
                    src={selectedPlace.photos[0]} 
                    alt={selectedPlace.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <Camera className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Place Details */}
              <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
                {/* Status and Price */}
                <div className="flex flex-wrap gap-2">
                  {selectedPlace.priceLevel && (
                    <Badge variant="secondary">
                      {getPriceLevelText(selectedPlace.priceLevel)}
                    </Badge>
                  )}
                  {selectedPlace.openNow !== undefined && (
                    <Badge variant={selectedPlace.openNow ? "default" : "destructive"}>
                      <Clock className="h-3 w-3 mr-1" />
                      {selectedPlace.openNow ? "Open Now" : "Closed"}
                    </Badge>
                  )}
                  <Badge className={`${PLACE_TYPES.find(t => t.id === selectedType)?.color || 'bg-gray-500'} text-white border-0`}>
                    {PLACE_TYPES.find(t => t.id === selectedType)?.label}
                  </Badge>
                </div>

                {/* Mock Reviews Section */}
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Reviews</h4>
                  {[
                    { author: "Priya S.", rating: 5, text: "Amazing place! Great atmosphere and excellent service. Highly recommended for anyone visiting the area.", date: "2 days ago" },
                    { author: "Amit K.", rating: 4, text: "Good experience overall. The location is convenient and the staff is friendly.", date: "1 week ago" },
                    { author: "Sarah M.", rating: 5, text: "Perfect spot! Exactly what I was looking for. Will definitely come back again.", date: "2 weeks ago" }
                  ].map((review, index) => (
                    <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium">{review.author}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-900/50">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => getDirections(selectedPlace)}
                    className="flex-1"
                    variant="outline"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button 
                    onClick={() => {
                      // Mock save functionality
                      console.log('Saving place:', selectedPlace.name);
                    }}
                    className="flex-1"
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save Place
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}