import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../lib/api_context";
import LocationHeader from "@/components/location-header";
import QuickActions from "@/components/quick-actions";
import PopularDestinations from "@/components/popular-destinations";
import TravelAlerts from "@/components/travel-alerts";
import TravelTips from "@/components/travel-tips";
import { useTravelTips } from "@/hooks/use-travel-tips";
import { WelcomeSuggestions } from "@/components/suggestion-chips";
import { MessageSquare } from "lucide-react";
import { CityDetails } from "@/components/city-details";
import { CityBackdrop } from "@/components/city-backdrop";
import CitySelector from "@/components/city-selector";

export default function Home() {
  const [, navigate] = useLocation();
  const { currentUser, createConversation } = useApp();
  const queryClient = useQueryClient();
  const { city, weather, showTips, markTipShown } = useTravelTips();
  
  // Create a new conversation when clicking the chat button
  const { mutate: startConversation } = useMutation({
    mutationFn: async () => {
      if (!currentUser) return null;
      return await createConversation(currentUser.id);
    },
    onSuccess: (conversation) => {
      if (conversation) {
        navigate(`/chat/${conversation.id}`);
      }
    }
  });
  
  const handleSuggestionSelect = (suggestion: string) => {
    startConversation();
  };

  // Get city nickname based on current city
  const getCityNickname = (city: string) => {
    const nicknames: {[key: string]: string} = {
      "Kolkata": "City of Joy",
      "Mumbai": "City of Dreams",
      "Delhi": "Heart of India",
      "Chennai": "Gateway of South India",
      "Bangalore": "Silicon Valley of India",
      "Hyderabad": "City of Pearls",
      "Jaipur": "Pink City",
      "Goa": "Beach Paradise",
      "Kochi": "Queen of the Arabian Sea",
      "Varanasi": "Spiritual Capital of India"
    };
    return nicknames[city] || "Beautiful City";
  };

  const { currentCity } = useApp();
  const cityNickname = getCityNickname(currentCity);

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <LocationHeader />
      
      {/* Welcome Card */}
      <section className="px-4 py-4">
        <div className="bg-card dark:bg-card rounded-xl shadow-md overflow-hidden">
          <div className="relative h-40">
            {/* City backdrop image */}
            <CityBackdrop className="rounded-t-xl" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm dark:backdrop-blur-md">
              <div className="text-center px-4 text-white drop-shadow-lg">
                <h2 className="font-poppins font-semibold text-white text-2xl">Welcome to {currentCity}!</h2>
                <p className="text-white/90 dark:text-white/90 text-sm mt-2 font-medium">
                  Let Buddy help you explore the {cityNickname}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-foreground dark:text-foreground/90 mb-3">What would you like to do today?</p>
            <WelcomeSuggestions onSelect={handleSuggestionSelect} />
          </div>
        </div>
      </section>
      
      {/* City Details */}
      <CityDetails />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Popular Destinations */}
      <PopularDestinations />
      
      {/* Travel Alerts */}
      <TravelAlerts />
      
      {/* Floating Chat Button */}
      <button 
        onClick={() => startConversation()} 
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-white z-10"
      >
        <MessageSquare size={24} />
      </button>
      
      {/* Contextual Travel Tips */}
      {showTips && city && <TravelTips location={city} weather={weather} />}
    </div>
  );
}
