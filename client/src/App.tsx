import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import Itinerary from "@/pages/itinerary";
import Profile from "@/pages/profile";
import Social from "@/pages/social";
import Feed from "@/pages/feed";
import BottomNavigation from "@/components/bottom-navigation";
import { useEffect, useState } from "react";
import { AppProvider } from "./lib/api_context";
import { ThemeProvider } from "@/components/theme-provider";
import { StarryBackground } from "@/components/starry-background";

function Router() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("home");
  
  useEffect(() => {
    // Map location to tab
    const path = location.split("/")[1];
    if (path === "") setActiveTab("home");
    else if (path === "chat") setActiveTab("chat");
    else if (path === "itinerary") setActiveTab("itinerary");
    else if (path === "profile") setActiveTab("profile");
    else if (path === "social") setActiveTab("social");
    else if (path === "feed") setActiveTab("feed");
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Starry background for dark mode */}
      <StarryBackground />
      
      <div className="flex-1 pb-16 relative z-10">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/chat/:id" component={Chat} />
          <Route path="/itinerary" component={Itinerary} />
          <Route path="/profile" component={Profile} />
          <Route path="/social" component={Social} />
          <Route path="/feed" component={Feed} />
          <Route component={NotFound} />
        </Switch>
      </div>
      
      <BottomNavigation activeTab={activeTab} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
