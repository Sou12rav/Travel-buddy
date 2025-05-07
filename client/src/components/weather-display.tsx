import { useQuery } from "@tanstack/react-query";
import { useApp } from "../lib/api_context";
import { Droplets, Wind, CloudRain } from "lucide-react";

export default function WeatherDisplay() {
  const { currentCity, getWeather } = useApp();
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/weather/${currentCity}`],
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
  });

  // Extract weather data from response
  const weatherData = data?.weather || null;

  if (isLoading) {
    return (
      <div className="animate-pulse bg-white p-4 rounded-lg shadow-md">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-16 bg-gray-200 rounded w-1/3"></div>
          <div className="h-16 bg-gray-200 rounded w-1/3"></div>
          <div className="h-16 bg-gray-200 rounded w-1/3 mx-2"></div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-red-500">
        <p>Unable to load weather information.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-poppins font-semibold text-lg">Today's Weather</h3>
        <span className="text-2xl">{weatherData.temperature}°C</span>
      </div>
      
      <div className="text-medium mb-4">{weatherData.condition}</div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <Droplets className="text-blue-500 mb-1" size={20} />
          <span className="text-xs text-medium">Humidity</span>
          <span className="text-sm font-medium">{weatherData.humidity}%</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <Wind className="text-gray-500 mb-1" size={20} />
          <span className="text-xs text-medium">Wind</span>
          <span className="text-sm font-medium">{weatherData.windSpeed} km/h</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <CloudRain className="text-accent mb-1" size={20} />
          <span className="text-xs text-medium">Rain</span>
          <span className="text-sm font-medium">{weatherData.rainChance}%</span>
        </div>
      </div>
    </div>
  );
}
