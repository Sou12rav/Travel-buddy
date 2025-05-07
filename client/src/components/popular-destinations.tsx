import { useApp } from "../lib/api_context";
import { useQuery } from "@tanstack/react-query";
import { Star, Info, Map, Navigation, Clock, CalendarDays, Phone, Globe } from "lucide-react";
import { DestinationsResponse } from "../lib/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Destination detail type extended with more info
interface DestinationDetail {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  address: string;
  description: string;
  openingHours: string[];
  contactNumber?: string;
  website?: string;
  ticketPrice?: string;
  bestTimeToVisit?: string;
  nearbyAttractions?: string[];
}

export default function PopularDestinations() {
  const { currentCity, getDestinations } = useApp();
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data, isLoading, error } = useQuery<DestinationsResponse>({
    queryKey: [`/api/destinations/${currentCity}`]
  });

  // Extract destinations array from response
  const destinationsData = data?.destinations || [];

  // Get detailed info for the selected destination
  const getDestinationDetails = (id: string): DestinationDetail => {
    const destination = destinationsData.find(d => d.id === id) || {
      id: '',
      name: '',
      image: '',
      rating: 0,
      reviews: 0
    };
    
    // Extend with more information - in a real app, this would come from an API call
    // For now, we'll generate some placeholder info based on the destination
    return {
      ...destination,
      address: `${destination.name}, ${currentCity}, India`,
      description: `${destination.name} is one of the most popular attractions in ${currentCity}. Known for its cultural significance and beautiful architecture, it attracts thousands of visitors every year.`,
      openingHours: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Weekends: 10:00 AM - 8:00 PM'],
      contactNumber: '+91 9876543210',
      website: 'www.example.com',
      ticketPrice: '₹200 for Indians, ₹500 for foreigners',
      bestTimeToVisit: 'October to March',
      nearbyAttractions: ['Local Market', 'City Park', 'Historical Museum']
    };
  };

  const handleOpenDetails = (id: string) => {
    setSelectedDestination(id);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <section className="px-4 py-3">
        <h2 className="font-poppins font-semibold text-dark mb-3">Popular in {currentCity}</h2>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex-shrink-0 w-36 bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div className="w-full h-24 bg-gray-300"></div>
              <div className="p-2">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || destinationsData.length === 0) {
    return (
      <section className="px-4 py-3">
        <h2 className="font-poppins font-semibold text-dark mb-3">Popular in {currentCity}</h2>
        <p className="text-medium">No destination data available at the moment.</p>
      </section>
    );
  }

  const selectedDestinationDetails = selectedDestination ? 
    getDestinationDetails(selectedDestination) : null;

  return (
    <>
      <section className="px-4 py-3">
        <h2 className="font-poppins font-semibold text-dark mb-3">Popular in {currentCity}</h2>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {destinationsData.map((destination) => (
            <div 
              key={destination.id} 
              className="flex-shrink-0 w-36 bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleOpenDetails(destination.id)}
            >
              <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-500">{destination.name}</span>
              </div>
              <div className="p-2">
                <h3 className="font-medium text-sm">{destination.name}</h3>
                <div className="flex items-center mt-1">
                  <Star className="text-accent text-xs" size={12} />
                  <span className="text-xs ml-1">
                    {destination.rating} ({Math.floor(destination.reviews / 100) / 10}k)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destination Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          {selectedDestinationDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedDestinationDetails.name}</DialogTitle>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Star className="text-accent mr-1" size={16} />
                  <span>{selectedDestinationDetails.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{Math.floor(selectedDestinationDetails.reviews / 100) / 10}k reviews</span>
                </div>
              </DialogHeader>
              
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <p className="text-sm">{selectedDestinationDetails.description}</p>
                    
                    <div className="flex items-start">
                      <Map className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Address</h4>
                        <p className="text-sm text-gray-600">{selectedDestinationDetails.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Opening Hours</h4>
                        {selectedDestinationDetails.openingHours.map((hours, index) => (
                          <p key={index} className="text-sm text-gray-600">{hours}</p>
                        ))}
                      </div>
                    </div>
                    
                    {selectedDestinationDetails.ticketPrice && (
                      <div className="flex items-start">
                        <Info className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">Ticket Price</h4>
                          <p className="text-sm text-gray-600">{selectedDestinationDetails.ticketPrice}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedDestinationDetails.bestTimeToVisit && (
                      <div className="flex items-start">
                        <CalendarDays className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">Best Time to Visit</h4>
                          <p className="text-sm text-gray-600">{selectedDestinationDetails.bestTimeToVisit}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedDestinationDetails.contactNumber && (
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">Contact</h4>
                          <p className="text-sm text-gray-600">{selectedDestinationDetails.contactNumber}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedDestinationDetails.website && (
                      <div className="flex items-start">
                        <Globe className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">Website</h4>
                          <p className="text-sm text-gray-600">{selectedDestinationDetails.website}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedDestinationDetails.nearbyAttractions && (
                      <div className="flex items-start">
                        <Navigation className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">Nearby Attractions</h4>
                          <ul className="text-sm text-gray-600 list-disc pl-5">
                            {selectedDestinationDetails.nearbyAttractions.map((attraction, index) => (
                              <li key={index}>{attraction}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="photos" className="mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((photoId) => (
                      <div key={photoId} className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">Photo {photoId}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-center mt-2 text-gray-500">
                    Photos will be loaded from Google Places API
                  </p>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-4">
                  <div className="space-y-3">
                    <p className="text-xs text-center text-gray-500">
                      Reviews will be loaded from Google Places API
                    </p>
                    {[1, 2, 3].map((reviewId) => (
                      <div key={reviewId} className="border-b pb-3">
                        <div className="flex items-center mb-1">
                          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                          <div>
                            <h5 className="font-medium text-sm">User {reviewId}</h5>
                            <div className="flex">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < 4 ? 'text-accent' : 'text-gray-300'}`} 
                                  fill={i < 4 ? 'currentColor' : 'none'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          A great place to visit in {currentCity}. Highly recommend if you're in the area.
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="flex flex-row gap-2 mt-4">
                <Button variant="outline" className="flex-1">
                  <Map className="mr-2 h-4 w-4" />
                  View on Map
                </Button>
                <Button className="flex-1">
                  <Navigation className="mr-2 h-4 w-4" />
                  Directions
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
