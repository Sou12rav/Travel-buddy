import { useQuery } from "@tanstack/react-query";
import { useApp } from "../lib/api_context";
import { Weather } from "@shared/schema";

export function useWeather() {
  const { currentCity, getWeather } = useApp();
  
  const { data, isLoading, error, refetch } = useQuery<Weather>({
    queryKey: [`/api/weather/${currentCity}`],
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
  });

  return {
    weather: data,
    isLoading,
    error,
    refetch
  };
}
