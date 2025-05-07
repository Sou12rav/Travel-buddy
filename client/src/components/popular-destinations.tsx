import { useApp } from "../lib/api_context";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { DestinationsResponse } from "../lib/types";

export default function PopularDestinations() {
  const { currentCity, getDestinations } = useApp();
  
  const { data, isLoading, error } = useQuery<DestinationsResponse>({
    queryKey: [`/api/destinations/${currentCity}`]
  });

  // Extract destinations array from response
  const destinationsData = data?.destinations || [];

  if (isLoading) {
    return (
      <section className="px-4 py-3">
        <h2 className="font-poppins font-semibold text-dark mb-3">Popular in {currentCity}</h2>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex-shrink-0 w-36 bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div className="w-full h-24 bg-gray-300"></div>
              <div className="p-2">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || destinationsData.length === 0) {
    return (
      <section className="px-4 py-3">
        <h2 className="font-poppins font-semibold text-dark mb-3">Popular in {currentCity}</h2>
        <p className="text-medium">No destination data available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="px-4 py-3">
      <h2 className="font-poppins font-semibold text-dark mb-3">Popular in {currentCity}</h2>
      <div className="flex gap-4 overflow-x-auto pb-3">
        {destinationsData.map((destination) => (
          <div key={destination.id} className="flex-shrink-0 w-36 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-500">{destination.name}</span>
            </div>
            <div className="p-2">
              <h3 className="font-medium text-sm">{destination.name}</h3>
              <div className="flex items-center mt-1">
                <Star className="text-accent text-xs" size={12} />
                <span className="text-xs ml-1">
                  {destination.rating} ({Math.floor(destination.reviews / 100) / 10}k)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
