import { useQuery } from "@tanstack/react-query";
import { useApp } from "../lib/api_context";
import { Weather } from "@shared/schema";

export function useWeather() {
  const { currentCity, getWeather } = useApp();
  
  const { data, isLoading, error, refetch } = useQuery<Weather>({
    queryKey: [`/api/weather/${currentCity}`],
    queryFn: () => getWeather(currentCity),
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
    enabled: !!currentCity,
  });

  return {
    weather: data,
    isLoading,
    error,
    refetch
  };
}
