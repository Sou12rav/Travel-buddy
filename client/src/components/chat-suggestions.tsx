import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Code, 
  Calendar, 
  CloudSun, 
  Utensils, 
  Car, 
  Users, 
  Camera,
  Github,
  Settings
} from "lucide-react";

interface ChatSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
  isVisible: boolean;
}

export default function ChatSuggestions({ onSelectSuggestion, isVisible }: ChatSuggestionsProps) {
  if (!isVisible) return null;

  const suggestions = [
    {
      category: "Travel Planning",
      color: "bg-blue-500",
      icon: <MapPin className="h-4 w-4" />,
      items: [
        "Plan a 3-day trip to Goa",
        "Best time to visit Kerala",
        "Popular destinations in Rajasthan",
        "Weekend getaway from Mumbai"
      ]
    },
    {
      category: "Weather & Alerts",
      color: "bg-orange-500",
      icon: <CloudSun className="h-4 w-4" />,
      items: [
        "Current weather in Delhi",
        "Travel alerts for Chennai",
        "Monsoon forecast for Kerala",
        "Best weather for Himalayan trek"
      ]
    },
    {
      category: "Food & Culture",
      color: "bg-green-500",
      icon: <Utensils className="h-4 w-4" />,
      items: [
        "Best street food in Kolkata",
        "Cultural customs in Tamil Nadu",
        "Vegetarian restaurants in Bangalore",
        "Local festivals in Rajasthan"
      ]
    },
    {
      category: "Transportation",
      color: "bg-purple-500",
      icon: <Car className="h-4 w-4" />,
      items: [
        "How to book train tickets",
        "Airport transfer options",
        "Local transport in Mumbai",
        "Cab booking apps in India"
      ]
    },
    {
      category: "Development Help",
      color: "bg-gray-700",
      icon: <Code className="h-4 w-4" />,
      items: [
        "GitHub workflow setup",
        "VSCode extensions for React",
        "API integration best practices",
        "Deploy travel app to Vercel"
      ]
    },
    {
      category: "Quick Actions",
      color: "bg-indigo-500",
      icon: <Settings className="h-4 w-4" />,
      items: [
        "Create new itinerary",
        "Find nearby restaurants",
        "Social media integration",
        "Export travel plan"
      ]
    }
  ];

  return (
    <Card className="mb-4 border-dashed border-2 border-gray-300 dark:border-gray-600">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            What can I help you with?
          </span>
        </div>
        
        <div className="space-y-4">
          {suggestions.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`${category.color} p-1 rounded`}>
                  {category.icon}
                </div>
                <Badge variant="outline" className="text-xs">
                  {category.category}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {category.items.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectSuggestion(item)}
                    className="justify-start text-left h-auto p-2 text-xs whitespace-normal"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectSuggestion("Show me GitHub integration examples")}
              className="text-xs"
            >
              <Github className="h-3 w-3 mr-1" />
              GitHub Help
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectSuggestion("Configure VSCode for this project")}
              className="text-xs"
            >
              <Code className="h-3 w-3 mr-1" />
              VSCode Setup
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectSuggestion("Plan my next adventure")}
              className="text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Plan Trip
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}