import { useApp } from "../lib/api_context";
import { useQuery } from "@tanstack/react-query";
import { Info, AlertTriangle, AlertCircle } from "lucide-react";
import { AlertsResponse } from "../lib/types";

export default function TravelAlerts() {
  const { currentCity, getTravelAlerts } = useApp();
  
  const { data, isLoading, error } = useQuery<AlertsResponse>({
    queryKey: [`/api/alerts/${currentCity}`],
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });

  // Extract alerts array from response
  const alertsData = data?.alerts || [];

  if (isLoading) {
    return (
      <section className="px-4 py-3">
        <h2 className="font-poppins font-semibold text-foreground mb-3">Travel Alerts</h2>
        <div className="bg-card dark:bg-card rounded-lg shadow-sm p-3 border-l-4 border-gray-300 dark:border-gray-700 animate-pulse">
          <div className="h-5 bg-muted dark:bg-muted rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-muted dark:bg-muted rounded w-full"></div>
        </div>
      </section>
    );
  }

  if (error || alertsData.length === 0) {
    return (
      <section className="px-4 py-3">
        <h2 className="font-poppins font-semibold text-foreground mb-3">Travel Alerts</h2>
        <div className="bg-card dark:bg-card rounded-lg shadow-sm p-3 border-l-4 border-green-500 dark:border-green-600">
          <div className="flex items-start">
            <Info className="text-green-500 dark:text-green-400 mr-2" size={20} />
            <div>
              <h3 className="font-medium text-sm text-foreground dark:text-foreground">No active alerts</h3>
              <p className="text-xs text-muted-foreground mt-1">It looks like a great day to explore {currentCity}!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-3">
      <h2 className="font-poppins font-semibold text-foreground mb-3">Travel Alerts</h2>
      {alertsData.map((alert) => {
        // Determine alert icon and color based on severity
        let Icon = Info;
        let borderColor = "border-blue-500 dark:border-blue-400";
        let iconColor = "text-blue-500 dark:text-blue-400";
        
        if (alert.severity === "warning") {
          Icon = AlertTriangle;
          borderColor = "border-warning dark:border-warning/80";
          iconColor = "text-warning dark:text-warning/80";
        } else if (alert.severity === "danger") {
          Icon = AlertCircle;
          borderColor = "border-danger dark:border-danger/80";
          iconColor = "text-danger dark:text-danger/80";
        }
        
        return (
          <div 
            key={alert.id} 
            className={`bg-card dark:bg-card rounded-lg shadow-sm p-3 border-l-4 ${borderColor} mb-2`}
          >
            <div className="flex items-start">
              <Icon className={iconColor} size={20} />
              <div className="ml-2">
                <h3 className="font-medium text-sm text-foreground">{alert.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
