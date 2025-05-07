import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../lib/api_context";
import LocationHeader from "@/components/location-header";
import QuickActions from "@/components/quick-actions";
import PopularDestinations from "@/components/popular-destinations";
import TravelAlerts from "@/components/travel-alerts";
import { WelcomeSuggestions } from "@/components/suggestion-chips";
import { MessageSquare } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const { currentUser, createConversation } = useApp();
  const queryClient = useQueryClient();
  
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

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <LocationHeader />
      
      {/* Welcome Card */}
      <section className="px-4 py-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-40">
            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
              <div className="text-center">
                <h2 className="font-poppins font-semibold text-primary text-xl">Welcome to Kolkata!</h2>
                <p className="text-gray-600 text-sm mt-2">Let Buddy help you explore the City of Joy</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-medium mb-3">What would you like to do today?</p>
            <WelcomeSuggestions onSelect={handleSuggestionSelect} />
          </div>
        </div>
      </section>
      
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
    </div>
  );
}
