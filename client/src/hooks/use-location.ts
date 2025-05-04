import { useState, useEffect } from "react";
import { useApp } from "../lib/api_context";

interface Location {
  city: string;
  state: string;
  country: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const { setCurrentCity } = useApp();
  const [location, setLocation] = useState<Location>({
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    coords: {
      latitude: 22.5726,
      longitude: 88.3639
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // In a real app, we would use reverse geocoding here using the coordinates
            // For this demo, we'll just update the coordinates
            setLocation(prev => ({
              ...prev,
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              loading: false
            }));
            
            // For demo purposes, we'll just use Kolkata as the default city
            setCurrentCity("Kolkata");
          },
          (error) => {
            setLocation(prev => ({
              ...prev,
              loading: false,
              error: `Unable to retrieve your location: ${error.message}`
            }));
          }
        );
      } else {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: "Geolocation is not supported by your browser"
        }));
      }
    };

    getLocation();
  }, [setCurrentCity]);

  return location;
}
