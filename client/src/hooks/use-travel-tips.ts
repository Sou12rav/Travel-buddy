import { useState, useEffect } from "react";
import { useLocation } from "@/hooks/use-location";
import { useWeather } from "@/hooks/use-weather";

export function useTravelTips() {
  const { city } = useLocation();
  const { weather } = useWeather();
  const [showTips, setShowTips] = useState(true);
  const [lastTipTime, setLastTipTime] = useState<number | null>(null);
  
  // Control frequency of tips (in milliseconds)
  const TIP_FREQUENCY = 1000 * 60 * 10; // Show a tip every 10 minutes at most
  
  useEffect(() => {
    // Check if we should show tips based on time since last tip
    if (lastTipTime) {
      const timeSinceLastTip = Date.now() - lastTipTime;
      if (timeSinceLastTip < TIP_FREQUENCY) {
        setShowTips(false);
        
        // Set a timeout to re-enable tips after the frequency period
        const timeoutId = setTimeout(() => {
          setShowTips(true);
        }, TIP_FREQUENCY - timeSinceLastTip);
        
        return () => clearTimeout(timeoutId);
      }
    }
    
    setShowTips(true);
  }, [lastTipTime]);
  
  const markTipShown = () => {
    setLastTipTime(Date.now());
  };
  
  return {
    city,
    weather: weather ? {
      condition: weather.condition,
      temperature: weather.temperature
    } : undefined,
    showTips,
    markTipShown
  };
}