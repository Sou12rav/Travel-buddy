import { MapPin, Sun, ChevronDown, Search, ArrowLeft } from "lucide-react";
import { useApp } from "../lib/api_context";
import { useQuery } from "@tanstack/react-query";
import { WeatherResponse } from "../lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ThemeToggle, ThemeToggleLarge } from "./theme-toggle";

const POPULAR_CITIES = [
  "Kolkata", 
  "Mumbai", 
  "Delhi", 
  "Chennai", 
  "Bangalore", 
  "Hyderabad", 
  "Jaipur", 
  "Goa", 
  "Kochi", 
  "Varanasi"
];

export default function LocationHeader() {
  const { currentCity, setCurrentCity } = useApp();
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState(POPULAR_CITIES);

  const { data, isLoading } = useQuery<WeatherResponse>({
    queryKey: [`/api/weather/${currentCity}`],
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
  });

  // Extract weather data from response
  const weatherData = data?.weather || null;

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredCities(
        POPULAR_CITIES.filter(city => 
          city.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCities(POPULAR_CITIES);
    }
  }, [searchTerm]);

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
    setIsChangingLocation(false);
  };

  return (
    <header className="bg-card dark:bg-card shadow-sm">
      <div className="container mx-auto px-4 py-3">
        {isChangingLocation ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2 p-0 h-8 w-8" 
                  onClick={() => setIsChangingLocation(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-semibold">Change Location</h2>
              </div>
              <ThemeToggleLarge />
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search for a city..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {filteredCities.map((city) => (
                <Button
                  key={city}
                  variant={city === currentCity ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleCitySelect(city)}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {city}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button 
              className="flex items-center" 
              onClick={() => setIsChangingLocation(true)}
            >
              <MapPin className="text-primary mr-2" />
              <div>
                <div className="flex items-center">
                  <h1 className="font-poppins font-semibold text-foreground text-lg">{currentCity}, India</h1>
                  <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Tap to change location</p>
              </div>
            </button>
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <div className="animate-pulse flex items-center">
                  <div className="h-5 w-5 bg-muted rounded-full mr-1"></div>
                  <div className="h-5 w-12 bg-muted rounded"></div>
                </div>
              ) : weatherData ? (
                <div className="flex items-center mr-3">
                  <span className="material-icons text-accent mr-1">
                    {weatherData.icon}
                  </span>
                  <span className="font-medium">{weatherData.temperature}°C</span>
                </div>
              ) : (
                <div className="flex items-center mr-3">
                  <Sun className="text-accent mr-1" />
                  <span className="font-medium">--°C</span>
                </div>
              )}
              <ThemeToggleLarge className="hidden md:flex" />
              <ThemeToggle className="md:hidden" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
