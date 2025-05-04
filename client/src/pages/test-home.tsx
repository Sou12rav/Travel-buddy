import { useState } from "react";
import { useLocation } from "wouter";
import { MessageSquare } from "lucide-react";

export default function TestHome() {
  const [, navigate] = useLocation();
  
  const handleSuggestionSelect = (suggestion: string) => {
    console.log("Suggestion selected:", suggestion);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <div className="bg-white p-4 my-4 mx-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Buddy Travel Assistant</h1>
        <p className="mt-2">Welcome to your travel assistant for India</p>
      </div>
      
      {/* Welcome Card */}
      <section className="px-4 py-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-40">
            <img 
              src="https://images.unsplash.com/photo-1543162056-4ce16eb4e4b7" 
              alt="Kolkata cityscape" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
              <h2 className="font-semibold text-white text-xl">Welcome to Kolkata!</h2>
              <p className="text-white/80 text-sm">Let Buddy help you explore the City of Joy</p>
            </div>
          </div>
          <div className="p-4">
            <p className="mb-3">What would you like to do today?</p>
          </div>
        </div>
      </section>
      
      {/* Floating Chat Button */}
      <button 
        onClick={() => console.log("Chat button clicked")} 
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-blue-500 shadow-lg flex items-center justify-center text-white z-10"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}