import { Hotel, Utensils, Car, Camera, Star, MapPin, X, Clock, Navigation, Phone, Calendar, Bed, Bath, Coffee } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useApp } from "../lib/api_context";

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
}

// Hotel type for the demo
interface Hotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  price: number;
  currency: string;
  amenities: string[];
  images: string[];
  distance: string;
}

// Restaurant type for the demo
interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  price: string; // $ to $$$$
  address: string;
  openNow: boolean;
  deliveryTime: string;
  distance: string;
  image?: string;
}

// Cab option type for the demo
interface CabOption {
  id: string;
  company: string;
  type: string;
  capacity: string;
  price: number;
  currency: string;
  eta: string;
  image?: string;
}

// Attraction type for the demo
interface Attraction {
  id: string;
  name: string;
  type: string;
  rating: number;
  price: number | null;
  currency: string;
  address: string;
  openingHours: string;
  distance: string;
  image?: string;
}

export default function QuickActions() {
  const { currentCity } = useApp();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Demo data for hotels
  const hotels: Hotel[] = [
    {
      id: "hotel1",
      name: "Taj Bengal",
      address: "34-B, Belvedere Road, Alipore, Kolkata",
      rating: 4.8,
      price: 8500,
      currency: "₹",
      amenities: ["Free WiFi", "Swimming Pool", "Spa", "Restaurant", "Gym", "Bar"],
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"],
      distance: "2.5 km"
    },
    {
      id: "hotel2",
      name: "The Oberoi Grand",
      address: "15, Jawaharlal Nehru Road, Kolkata",
      rating: 4.7,
      price: 9800,
      currency: "₹",
      amenities: ["Free WiFi", "Swimming Pool", "Spa", "Restaurant", "Gym", "Bar"],
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"],
      distance: "1.2 km"
    },
    {
      id: "hotel3",
      name: "ITC Royal Bengal",
      address: "1, JBS Haldane Avenue, Kolkata",
      rating: 4.6,
      price: 7900,
      currency: "₹",
      amenities: ["Free WiFi", "Swimming Pool", "Spa", "Restaurant", "Gym", "Bar"],
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"],
      distance: "3.8 km"
    }
  ];
  
  // Demo data for restaurants
  const restaurants: Restaurant[] = [
    {
      id: "rest1",
      name: "Arsalan",
      cuisine: "Biryani, Mughlai",
      rating: 4.5,
      price: "₹₹",
      address: "28, Park Street, Kolkata",
      openNow: true,
      deliveryTime: "25-35 min",
      distance: "1.2 km"
    },
    {
      id: "rest2",
      name: "6 Ballygunge Place",
      cuisine: "Bengali",
      rating: 4.4,
      price: "₹₹₹",
      address: "6, Ballygunge Place, Kolkata",
      openNow: true,
      deliveryTime: "30-40 min",
      distance: "3.5 km"
    },
    {
      id: "rest3",
      name: "Peter Cat",
      cuisine: "Continental, Indian",
      rating: 4.6,
      price: "₹₹₹",
      address: "18A, Park Street, Kolkata",
      openNow: false,
      deliveryTime: "40-50 min",
      distance: "1.8 km"
    }
  ];
  
  // Demo data for cab options
  const cabOptions: CabOption[] = [
    {
      id: "cab1",
      company: "Ola",
      type: "Mini",
      capacity: "3 persons",
      price: 150,
      currency: "₹",
      eta: "3 min"
    },
    {
      id: "cab2",
      company: "Uber",
      type: "Go",
      capacity: "4 persons",
      price: 180,
      currency: "₹",
      eta: "5 min"
    },
    {
      id: "cab3",
      company: "Ola",
      type: "Prime",
      capacity: "4 persons",
      price: 220,
      currency: "₹",
      eta: "7 min"
    },
    {
      id: "cab4",
      company: "Uber",
      type: "Premier",
      capacity: "4 persons",
      price: 250,
      currency: "₹",
      eta: "4 min"
    }
  ];
  
  // Demo data for attractions
  const attractions: Attraction[] = [
    {
      id: "attr1",
      name: "Victoria Memorial",
      type: "Monument",
      rating: 4.7,
      price: 50,
      currency: "₹",
      address: "Victoria Memorial Hall, 1, Queens Way, Kolkata",
      openingHours: "10:00 AM - 5:00 PM",
      distance: "2.3 km"
    },
    {
      id: "attr2",
      name: "Howrah Bridge",
      type: "Bridge, Landmark",
      rating: 4.5,
      price: null, // Free
      currency: "₹",
      address: "Howrah Bridge, Kolkata",
      openingHours: "Open 24 hours",
      distance: "4.1 km"
    },
    {
      id: "attr3",
      name: "Indian Museum",
      type: "Museum",
      rating: 4.3,
      price: 20,
      currency: "₹",
      address: "27, Jawaharlal Nehru Road, Kolkata",
      openingHours: "10:00 AM - 6:30 PM (Closed on Mondays)",
      distance: "1.7 km"
    }
  ];
  
  const handleActionClick = (actionId: string) => {
    setSelectedAction(actionId);
    setIsDialogOpen(true);
  };
  
  const actions: QuickAction[] = [
    {
      id: "hotels",
      title: "Hotels",
      icon: <Hotel size={20} />,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      onClick: () => handleActionClick("hotels")
    },
    {
      id: "food",
      title: "Food",
      icon: <Utensils size={20} />,
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
      onClick: () => handleActionClick("food")
    },
    {
      id: "cabs",
      title: "Cabs",
      icon: <Car size={20} />,
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
      onClick: () => handleActionClick("cabs")
    },
    {
      id: "attractions",
      title: "Attractions",
      icon: <Camera size={20} />,
      bgColor: "bg-light",
      iconColor: "text-medium",
      onClick: () => handleActionClick("attractions")
    }
  ];

  const renderHotelsContent = () => (
    <>
      <DialogHeader>
        <DialogTitle>Hotels in {currentCity}</DialogTitle>
      </DialogHeader>
      
      <div className="my-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Input type="text" placeholder="Search hotels..." className="flex-1" />
          <Button size="sm" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Dates
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Price Range</Label>
            <span className="text-sm">₹1,000 - ₹10,000+</span>
          </div>
          <Slider defaultValue={[5000]} max={15000} step={500} />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Switch id="wifi" />
            <Label htmlFor="wifi">WiFi</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="pool" />
            <Label htmlFor="pool">Pool</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="breakfast" />
            <Label htmlFor="breakfast">Free Breakfast</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="ac" />
            <Label htmlFor="ac">AC</Label>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mt-4">
        <h3 className="text-sm font-medium">Top rated hotels</h3>
        
        {hotels.map(hotel => (
          <div key={hotel.id} className="border rounded-lg overflow-hidden">
            <div className="h-32 bg-gray-200 relative">
              <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
                {hotel.currency}{hotel.price} / night
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex justify-between">
                <h4 className="font-medium">{hotel.name}</h4>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                  <span className="text-xs">{hotel.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{hotel.address}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {amenity}
                  </span>
                ))}
                {hotel.amenities.length > 3 && (
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    +{hotel.amenities.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex mt-3 gap-2">
                <Button size="sm" className="flex-1">View Details</Button>
                <Button size="sm" variant="outline" className="flex-1">Book Now</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
  
  const renderFoodContent = () => (
    <>
      <DialogHeader>
        <DialogTitle>Food Options in {currentCity}</DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="delivery" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="dineout">Dine Out</TabsTrigger>
        </TabsList>
        
        <TabsContent value="delivery" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Input type="text" placeholder="Search for cuisine, restaurant..." className="flex-1" />
          </div>
          
          <div className="flex overflow-x-auto py-2 gap-2">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Clock className="h-3 w-3 mr-1" />
              Delivery Time
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Star className="h-3 w-3 mr-1" fill="currentColor" />
              Rating 4.0+
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Price
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Pure Veg
            </Button>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Popular restaurants</h3>
            
            {restaurants.map(restaurant => (
              <div key={restaurant.id} className="flex border rounded-lg overflow-hidden">
                <div className="w-24 h-24 bg-gray-200"></div>
                <div className="p-2 flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm">{restaurant.name}</h4>
                    <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded">
                      <Star className="h-3 w-3 text-green-700 mr-0.5" fill="currentColor" />
                      <span className="text-xs text-green-700">{restaurant.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                  
                  <div className="flex items-center mt-1 text-xs text-gray-600">
                    <span>{restaurant.price}</span>
                    <span className="mx-1">•</span>
                    <span>{restaurant.distance}</span>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${restaurant.openNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {restaurant.openNow ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="mx-1 text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{restaurant.deliveryTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="dineout" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Input type="text" placeholder="Search for restaurants..." className="flex-1" />
          </div>
          
          <div className="flex overflow-x-auto py-2 gap-2">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Star className="h-3 w-3 mr-1" fill="currentColor" />
              Rating 4.0+
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Outdoor Seating
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Buffet
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Price
            </Button>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Recommended restaurants</h3>
            
            {restaurants.map(restaurant => (
              <div key={restaurant.id} className="border rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-200 relative">
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
                    {restaurant.price}
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{restaurant.name}</h4>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="text-xs">{restaurant.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                  
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{restaurant.address}</span>
                  </div>
                  
                  <div className="flex mt-3 gap-2">
                    <Button size="sm" className="flex-1">Reserve Table</Button>
                    <Button size="sm" variant="outline" className="flex-1">View Menu</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
  
  const renderCabsContent = () => (
    <>
      <DialogHeader>
        <DialogTitle>Book a Cab in {currentCity}</DialogTitle>
      </DialogHeader>
      
      <div className="my-4 space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center border rounded-md p-2">
            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <MapPin className="h-3 w-3 text-green-700" />
            </div>
            <Input type="text" placeholder="Your current location" className="border-0 flex-1 h-auto p-0 focus-visible:ring-0" />
          </div>
          
          <div className="flex items-center border rounded-md p-2">
            <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
              <MapPin className="h-3 w-3 text-red-700" />
            </div>
            <Input type="text" placeholder="Where to?" className="border-0 flex-1 h-auto p-0 focus-visible:ring-0" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Clock className="h-4 w-4 mr-1" />
            Now
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Calendar className="h-4 w-4 mr-1" />
            Schedule
          </Button>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        <h3 className="text-sm font-medium">Available options</h3>
        
        {cabOptions.map(cab => (
          <div key={cab.id} className="flex items-center border rounded-lg p-3">
            <div className="h-12 w-12 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
              <span className="text-xs font-medium">{cab.company}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">{cab.company} {cab.type}</h4>
                <span className="font-medium">{cab.currency}{cab.price}</span>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{cab.capacity}</span>
                <span>ETA: {cab.eta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <DialogFooter className="mt-4">
        <Button className="w-full">Book Ride</Button>
      </DialogFooter>
    </>
  );
  
  const renderAttractionsContent = () => (
    <>
      <DialogHeader>
        <DialogTitle>Attractions in {currentCity}</DialogTitle>
      </DialogHeader>
      
      <div className="my-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Input type="text" placeholder="Search attractions..." className="flex-1" />
        </div>
        
        <div className="flex overflow-x-auto py-2 gap-2">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Star className="h-3 w-3 mr-1" fill="currentColor" />
            Top Rated
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Historical
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Museums
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Parks
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Religious
          </Button>
        </div>
      </div>
      
      <div className="space-y-4 mt-4">
        <h3 className="text-sm font-medium">Must-visit places</h3>
        
        {attractions.map(attraction => (
          <div key={attraction.id} className="border rounded-lg overflow-hidden">
            <div className="h-32 bg-gray-200 relative">
              {attraction.price !== null && (
                <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
                  {attraction.price > 0 ? `${attraction.currency}${attraction.price}` : 'Free Entry'}
                </div>
              )}
            </div>
            
            <div className="p-3">
              <div className="flex justify-between">
                <h4 className="font-medium">{attraction.name}</h4>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                  <span className="text-xs">{attraction.rating}</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">{attraction.type}</p>
              
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{attraction.address}</span>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>{attraction.openingHours}</span>
              </div>
              
              <div className="flex mt-3 gap-2">
                <Button size="sm" className="flex-1">View Details</Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Navigation className="h-3 w-3 mr-1" />
                  Directions
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
  
  const renderDialogContent = () => {
    switch (selectedAction) {
      case "hotels":
        return renderHotelsContent();
      case "food":
        return renderFoodContent();
      case "cabs":
        return renderCabsContent();
      case "attractions":
        return renderAttractionsContent();
      default:
        return null;
    }
  };

  return (
    <>
      <section className="px-4 py-2">
        <h2 className="font-poppins font-semibold text-dark mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          {actions.map(action => (
            <div 
              key={action.id} 
              className="flex flex-col items-center cursor-pointer"
              onClick={action.onClick}
            >
              <div className={`w-12 h-12 rounded-full ${action.bgColor} border border-gray-200 flex items-center justify-center mb-1`}>
                <span className={action.iconColor}>{action.icon}</span>
              </div>
              <span className="text-xs text-medium text-center">{action.title}</span>
            </div>
          ))}
        </div>
      </section>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
