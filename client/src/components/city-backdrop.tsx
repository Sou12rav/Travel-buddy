import { useApp } from "../lib/api_context";

// City backdrop images with attribution
const CITY_BACKDROPS: { [key: string]: string } = {
  "Kolkata": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1555952238-7d535a0269cc?q=80&w=1000&auto=format&fit=crop')",
  "Mumbai": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=1000&auto=format&fit=crop')",
  "Delhi": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1000&auto=format&fit=crop')",
  "Chennai": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000&auto=format&fit=crop')",
  "Bangalore": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop')",
  "Hyderabad": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1572439639782-11d654a49566?q=80&w=1000&auto=format&fit=crop')",
  "Jaipur": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop')",
  "Goa": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1587922546307-776227941871?q=80&w=1000&auto=format&fit=crop')",
  "Kochi": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1590559911070-cd5624c4cece?q=80&w=1000&auto=format&fit=crop')",
  "Varanasi": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1561361058-c24cecde1257?q=80&w=1000&auto=format&fit=crop')"
};

interface CityBackdropProps {
  className?: string;
}

export function CityBackdrop({ className = "" }: CityBackdropProps) {
  const { currentCity } = useApp();
  
  // Get backdrop for current city or default to Kolkata
  const backdropUrl = CITY_BACKDROPS[currentCity] || CITY_BACKDROPS["Kolkata"];
  
  return (
    <div 
      className={`absolute inset-0 bg-cover bg-center ${className}`}
      style={{ 
        backgroundImage: backdropUrl,
        backgroundSize: "cover"
      }}
    />
  );
}