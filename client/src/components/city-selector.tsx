import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Thermometer, Wind, Droplets, Eye, MapPin, Users, Calendar, Utensils } from "lucide-react";

const INDIAN_CITIES = [
  "Kolkata", "Mumbai", "Delhi", "Chennai", "Bangalore", 
  "Hyderabad", "Jaipur", "Goa", "Kochi", "Varanasi"
];

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  icon: string;
}

interface SocialCustoms {
  greetings: string[];
  languages: string[];
  festivals: string[];
  cuisine: string[];
  etiquette: string[];
  dressCode: string;
  tipping: string;
  businessHours: string;
}

export default function CitySelector() {
  const [selectedCity, setSelectedCity] = useState("Kolkata");

  const { data: weatherData, isLoading: weatherLoading } = useQuery({
    queryKey: ['/api/weather', selectedCity],
    queryFn: async () => {
      const response = await fetch(`/api/weather/${selectedCity}`);
      if (!response.ok) throw new Error('Weather data not found');
      const data = await response.json();
      return data.weather as WeatherData;
    }
  });

  const { data: customsData, isLoading: customsLoading } = useQuery({
    queryKey: ['/api/customs', selectedCity],
    queryFn: async () => {
      const response = await fetch(`/api/customs/${selectedCity}`);
      if (!response.ok) throw new Error('Cultural data not found');
      const data = await response.json();
      return data.customs as SocialCustoms;
    }
  });

  const { data: destinationsData } = useQuery({
    queryKey: ['/api/destinations', selectedCity],
    queryFn: async () => {
      const response = await fetch(`/api/destinations/${selectedCity}`);
      if (!response.ok) throw new Error('Destinations not found');
      const data = await response.json();
      return data.destinations;
    }
  });

  const { data: alertsData } = useQuery({
    queryKey: ['/api/alerts', selectedCity],
    queryFn: async () => {
      const response = await fetch(`/api/alerts/${selectedCity}`);
      if (!response.ok) throw new Error('Alerts not found');
      const data = await response.json();
      return data.alerts;
    }
  });

  return (
    <div className="space-y-6 p-4">
      {/* City Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select City
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {INDIAN_CITIES.map((city) => (
              <Button
                key={city}
                variant={selectedCity === city ? "default" : "outline"}
                onClick={() => setSelectedCity(city)}
                className="text-sm"
              >
                {city}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Current Weather in {selectedCity}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weatherLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : weatherData ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="text-2xl font-bold">{weatherData.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <span>{weatherData.condition}</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-600" />
                <span>{weatherData.humidity}% Humidity</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <span>{weatherData.windSpeed} km/h</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Weather data not available</p>
          )}
        </CardContent>
      </Card>

      {/* Social Customs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Social Customs & Culture in {selectedCity}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customsLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : customsData ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Common Greetings</h4>
                <div className="flex flex-wrap gap-2">
                  {customsData.greetings.map((greeting, index) => (
                    <Badge key={index} variant="secondary">{greeting}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Languages Spoken</h4>
                <div className="flex flex-wrap gap-2">
                  {customsData.languages.map((language, index) => (
                    <Badge key={index} variant="outline">{language}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Major Festivals
                </h4>
                <div className="flex flex-wrap gap-2">
                  {customsData.festivals.map((festival, index) => (
                    <Badge key={index} variant="secondary">{festival}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Local Cuisine
                </h4>
                <div className="flex flex-wrap gap-2">
                  {customsData.cuisine.map((dish, index) => (
                    <Badge key={index} variant="outline">{dish}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Dress Code</h4>
                  <p className="text-sm text-gray-600">{customsData.dressCode}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tipping Guidelines</h4>
                  <p className="text-sm text-gray-600">{customsData.tipping}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Business Hours</h4>
                <p className="text-sm text-gray-600">{customsData.businessHours}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Cultural Etiquette</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {customsData.etiquette.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Cultural information not available</p>
          )}
        </CardContent>
      </Card>

      {/* Popular Destinations */}
      {destinationsData && destinationsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Destinations in {selectedCity}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {destinationsData.slice(0, 4).map((destination: any) => (
                <div key={destination.id} className="border rounded-lg p-3">
                  <h4 className="font-semibold">{destination.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{destination.address}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{destination.type}</Badge>
                    <span className="text-sm">⭐ {destination.rating} ({destination.reviews})</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Travel Alerts */}
      {alertsData && alertsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Travel Alerts for {selectedCity}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertsData.map((alert: any) => (
                <div key={alert.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-sm">{alert.title}</h4>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {alert.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}