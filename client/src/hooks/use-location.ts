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
            setLocation(prev => ({
              ...prev,
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              loading: false,
              error: null
            }));
            
            setCurrentCity("Kolkata");
          },
          (error) => {
            console.warn("Geolocation error:", error.message);
            // Use default location instead of showing error
            setLocation(prev => ({
              ...prev,
              loading: false,
              error: null
            }));
            setCurrentCity("Kolkata");
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000
          }
        );
      } else {
        // Browser doesn't support geolocation, use default
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: null
        }));
        setCurrentCity("Kolkata");
      }
    };

    getLocation();
  }, [setCurrentCity]);

  return location;
}
