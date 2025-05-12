import { useApp } from "../lib/api_context";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { Calendar, Map, Plus } from "lucide-react";

export default function Itinerary() {
  const { currentUser, getUserItineraries } = useApp();
  
  const { data: itineraries, isLoading } = useQuery({
    queryKey: currentUser ? [`/api/users/${currentUser.id}/itineraries`] : [],
    enabled: !!currentUser
  });

  // Get first itinerary for display
  const currentItinerary = itineraries && itineraries.length > 0 ? itineraries[0] : null;
  
  // Format date for display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <header className="bg-card dark:bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="font-poppins font-semibold text-foreground text-lg">My Itinerary</h1>
            <button className="text-primary font-medium text-sm flex items-center">
              <Plus size={16} className="mr-1" /> New Plan
            </button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded w-1/2"></div>
            <div className="h-40 bg-muted rounded"></div>
            <div className="h-40 bg-muted rounded"></div>
          </div>
        </div>
      ) : !currentItinerary ? (
        <div className="p-8 text-center">
          <Calendar className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h2 className="font-poppins font-semibold text-xl mb-2 text-foreground">No Itineraries Yet</h2>
          <p className="text-muted-foreground mb-6">Create your first travel plan with Buddy</p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium">
            Create Itinerary
          </button>
        </div>
      ) : (
        <section className="px-4 py-4">
          <div className="bg-card dark:bg-card rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b dark:border-muted">
              <h2 className="font-poppins font-semibold text-foreground">{currentItinerary.title}</h2>
              <p className="text-muted-foreground text-sm">
                {formatDate(currentItinerary.date)}
              </p>
            </div>
            
            {/* Timeline */}
            <div className="p-4">
              {(currentItinerary.activities as Activity[]).map((activity, index) => (
                <div 
                  key={index} 
                  className={`relative ${
                    index < (currentItinerary.activities as Activity[]).length - 1 ? 'pb-8' : ''
                  }`}
                >
                  {index < (currentItinerary.activities as Activity[]).length - 1 && (
                    <div className="absolute top-0 left-4 h-full w-0.5 bg-muted"></div>
                  )}
                  <div className="flex items-start relative">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center z-10">
                        <span className="material-icons text-primary text-sm">
                          {activity.icon}
                        </span>
                      </div>
                      <span className="text-xs font-medium mt-1 text-foreground">{activity.time}</span>
                    </div>
                    <div className="flex-1 bg-accent/20 dark:bg-accent/20 rounded-lg p-3">
                      <h3 className="font-medium text-foreground">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      <div className="flex items-center mt-2">
                        <Map className="text-muted-foreground mr-1" size={12} />
                        <span className="text-xs text-muted-foreground">{activity.location}</span>
                      </div>
                      
                      {activity.title.includes("Victoria") && (
                        <div className="mt-2 flex gap-2">
                          <button className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Get Directions
                          </button>
                          <button className="text-xs bg-muted/30 dark:bg-muted/20 border border-border px-2 py-1 rounded-full text-foreground">
                            Book Tickets
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
