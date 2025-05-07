import { useState, useEffect } from "react";
import { useApp } from "@/lib/api_context";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, Info, Lightbulb, MessageCircle, MapPin, Umbrella, Sun, CloudRain } from "lucide-react";

interface TravelTip {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  condition: string; // weather, location, time, etc.
  priority: number;
  animation: "slide" | "bounce" | "pulse" | "flip";
}

export interface TravelTipsProps {
  location: string;
  weather?: {
    condition: string;
    temperature: number;
  };
}

export default function TravelTips({ location, weather }: TravelTipsProps) {
  const [currentTip, setCurrentTip] = useState<TravelTip | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  // Sample travel tips
  const travelTips: TravelTip[] = [
    {
      id: "tip-1",
      title: "Weather Alert",
      content: "It looks like it's going to rain today. Don't forget to pack an umbrella!",
      icon: <Umbrella className="text-blue-500" />,
      condition: "rainy",
      priority: 1,
      animation: "slide"
    },
    {
      id: "tip-2",
      title: "Local Custom",
      content: "In Kolkata, it's customary to use your right hand when giving or receiving items.",
      icon: <Info className="text-purple-500" />,
      condition: "kolkata",
      priority: 2,
      animation: "bounce"
    },
    {
      id: "tip-3",
      title: "Travel Hack",
      content: "Carry a water bottle! You can refill it at most restaurants and hotels.",
      icon: <Lightbulb className="text-yellow-500" />,
      condition: "hot",
      priority: 3,
      animation: "pulse"
    },
    {
      id: "tip-4",
      title: "Local Food",
      content: "Don't miss trying 'Mishti Doi', a sweet yogurt dessert that Kolkata is famous for!",
      icon: <MessageCircle className="text-green-500" />,
      condition: "kolkata",
      priority: 2,
      animation: "flip"
    },
    {
      id: "tip-5",
      title: "Popular Spot",
      content: "Victoria Memorial is less crowded in the mornings. Visit early for the best experience!",
      icon: <MapPin className="text-red-500" />,
      condition: "kolkata",
      priority: 2,
      animation: "slide"
    }
  ];

  // Function to find a relevant tip based on context
  const findRelevantTip = () => {
    // Skip tips that have been dismissed
    const availableTips = travelTips.filter(tip => !dismissed.includes(tip.id));
    if (availableTips.length === 0) return null;

    // Filter by weather condition if available
    let relevantTips = [...availableTips];
    if (weather) {
      const weatherCondition = weather.condition.toLowerCase();
      const isRainy = weatherCondition.includes("rain") || weatherCondition.includes("shower");
      const isHot = weather.temperature > 30;

      // Apply weather filters
      if (isRainy) {
        const rainyTips = relevantTips.filter(tip => tip.condition === "rainy");
        if (rainyTips.length > 0) relevantTips = rainyTips;
      } else if (isHot) {
        const hotTips = relevantTips.filter(tip => tip.condition === "hot");
        if (hotTips.length > 0) relevantTips = hotTips;
      }
    }

    // Filter by location
    const locationLower = location.toLowerCase();
    const locationTips = relevantTips.filter(tip => 
      locationLower.includes(tip.condition.toLowerCase())
    );
    
    if (locationTips.length > 0) {
      relevantTips = locationTips;
    }

    // Sort by priority (lower number = higher priority)
    relevantTips.sort((a, b) => a.priority - b.priority);

    // Return the highest priority tip
    return relevantTips[0] || null;
  };

  const dismissTip = () => {
    if (currentTip) {
      setDismissed([...dismissed, currentTip.id]);
      setVisible(false);
      
      // Wait for animation to complete
      setTimeout(() => {
        setCurrentTip(null);
      }, 300);
    }
  };

  useEffect(() => {
    // Find a relevant tip when location or weather changes
    const tip = findRelevantTip();
    if (tip && tip.id !== currentTip?.id) {
      setCurrentTip(tip);
      
      // Add a small delay before showing the tip
      setTimeout(() => {
        setVisible(true);
      }, 500);
    }
  }, [location, weather, dismissed]);

  // Get animation settings based on tip's animation style
  const getAnimationVariants = (): Variants => {
    if (!currentTip) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
      };
    }
    
    switch (currentTip.animation) {
      case "bounce":
        return {
          hidden: { y: -100, opacity: 0 },
          visible: { 
            y: 0, 
            opacity: 1,
            transition: { 
              type: "spring", 
              stiffness: 300, 
              damping: 10 
            } 
          },
          exit: { y: -100, opacity: 0 }
        };
      case "pulse":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              yoyo: 2, // pulse twice
              duration: 0.5
            } 
          },
          exit: { opacity: 0, scale: 0.8 }
        };
      case "flip":
        return {
          hidden: { opacity: 0, rotateY: 90 },
          visible: { 
            opacity: 1, 
            rotateY: 0,
            transition: { 
              duration: 0.5 
            } 
          },
          exit: { opacity: 0, rotateY: 90 }
        };
      case "slide":
      default:
        return {
          hidden: { x: 300, opacity: 0 },
          visible: { 
            x: 0, 
            opacity: 1,
            transition: { 
              type: "tween", 
              duration: 0.5 
            } 
          },
          exit: { x: 300, opacity: 0 }
        };
    }
  };

  return (
    <AnimatePresence>
      {currentTip && visible && (
        <motion.div 
          className="fixed bottom-20 right-4 z-50 max-w-xs"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={getAnimationVariants()}
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {currentTip.icon}
                  <h3 className="font-medium text-primary">{currentTip.title}</h3>
                </div>
                <button 
                  onClick={dismissTip}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-600">{currentTip.content}</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}