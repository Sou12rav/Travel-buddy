import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GooglePlacesSearch from "@/components/google-places-search";
import NearbyPlaces from "@/components/nearby-places";
import CitySelector from "@/components/city-selector";
import { MapPin, Search, Navigation, Globe } from "lucide-react";

export default function GoogleTravel() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center">Google-Powered Travel Companion</h1>
          <p className="text-center text-muted-foreground mt-2">
            Discover places, get directions, and explore India with real-time Google data
          </p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Places
            </TabsTrigger>
            <TabsTrigger value="nearby" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Nearby
            </TabsTrigger>
            <TabsTrigger value="cities" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              City Guide
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <GooglePlacesSearch />
          </TabsContent>

          <TabsContent value="nearby">
            <NearbyPlaces />
          </TabsContent>

          <TabsContent value="cities">
            <CitySelector />
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Google Travel Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time place search using Google Places API</li>
                    <li>• Nearby places discovery with location services</li>
                    <li>• Detailed place information including reviews and photos</li>
                    <li>• Directions integration with Google Maps</li>
                    <li>• Weather and cultural information for Indian cities</li>
                    <li>• Comprehensive travel social platform</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">APIs Integrated</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Google Places API - Real place data</li>
                    <li>• Google Geocoding API - Address to coordinates</li>
                    <li>• Google Directions API - Route planning</li>
                    <li>• OpenAI API - Intelligent travel assistant</li>
                    <li>• Browser Geolocation - User location services</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Indian Cities Covered</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    {[
                      "Kolkata", "Mumbai", "Delhi", "Chennai", "Bangalore",
                      "Hyderabad", "Jaipur", "Goa", "Kochi", "Varanasi"
                    ].map(city => (
                      <div key={city} className="text-center p-2 border rounded">
                        {city}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}