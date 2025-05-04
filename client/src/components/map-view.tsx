import { useState, useEffect, useRef } from "react";
import { useApp } from "../lib/api_context";
import { useQuery } from "@tanstack/react-query";
import { Plus, Minus, Navigation } from "lucide-react";

interface MapMarker {
  id: string;
  title: string;
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function MapView({ fullMap = false }: { fullMap?: boolean }) {
  const { currentCity, getDestinations } = useApp();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: destinations, isLoading } = useQuery({
    queryKey: [`/api/destinations/${currentCity}`]
  });

  useEffect(() => {
    if (destinations) {
      const newMarkers = destinations.map((dest: any) => ({
        id: dest.id,
        title: dest.name,
        type: dest.type,
        coordinates: dest.coordinates
      }));
      setMarkers(newMarkers);
    }
  }, [destinations]);

  // Function to get proper marker icon based on type
  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "attraction":
        return "attractions";
      case "restaurant":
        return "restaurant";
      case "hotel":
        return "hotel";
      default:
        return "place";
    }
  };

  // Calculate map height based on fullMap prop
  const mapHeight = fullMap ? "h-[calc(100vh-120px)]" : "h-52";

  return (
    <div className={`relative ${mapHeight} bg-gray-100 rounded-xl overflow-hidden shadow-sm`}>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
          <p>Loading map...</p>
        </div>
      ) : (
        <>
          {/* Map Image Placeholder */}
          <img 
            src={`https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a`} 
            alt={`Map of ${currentCity}`}
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* Map Markers */}
          {markers.map((marker) => (
            <div 
              key={marker.id}
              className="map-marker" 
              style={{ 
                top: `${Math.random() * 70 + 10}%`,
                left: `${Math.random() * 70 + 10}%`
              }}
              title={marker.title}
            >
              <span className="material-icons text-primary absolute -top-6 -left-2 text-xl">
                {getMarkerIcon(marker.type)}
              </span>
            </div>
          ))}
          
          {/* Map Controls */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <Plus size={20} />
            </button>
            <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <Minus size={20} />
            </button>
            <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <Navigation size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
