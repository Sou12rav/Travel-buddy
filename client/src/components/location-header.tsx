import { MapPin, Sun } from "lucide-react";
import { useApp } from "../lib/api_context";
import { useQuery } from "@tanstack/react-query";

export default function LocationHeader() {
  const { currentCity, getWeather } = useApp();
  
  const { data, isLoading } = useQuery({
    queryKey: [`/api/weather/${currentCity}`],
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
  });

  // Extract weather data from response
  const weatherData = data?.weather || null;

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="text-primary mr-2" />
            <div>
              <h1 className="font-poppins font-semibold text-dark text-lg">{currentCity}, India</h1>
              <p className="text-medium text-sm">Current Location</p>
            </div>
          </div>
          <div className="flex items-center">
            {isLoading ? (
              <div className="animate-pulse flex items-center">
                <div className="h-5 w-5 bg-gray-200 rounded-full mr-1"></div>
                <div className="h-5 w-12 bg-gray-200 rounded"></div>
              </div>
            ) : weatherData ? (
              <>
                <span className="material-icons text-accent mr-1">
                  {weatherData.icon}
                </span>
                <span className="font-medium">{weatherData.temperature}°C</span>
              </>
            ) : (
              <div className="flex items-center">
                <Sun className="text-accent mr-1" />
                <span className="font-medium">--°C</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
