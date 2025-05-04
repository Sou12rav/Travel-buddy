import { Link } from "wouter";
import { Home, Map, Calendar, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
}

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "explore", label: "Explore", icon: Map, path: "/explore" },
    { id: "itinerary", label: "Itinerary", icon: Calendar, path: "/itinerary" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 w-full h-16 bg-white border-t shadow-md flex items-center z-10">
      {navItems.map((item) => (
        <Link 
          key={item.id} 
          href={item.path} 
          className="flex-1 flex flex-col items-center"
        >
          <div 
            className={`flex flex-col items-center ${
              activeTab === item.id ? "text-primary" : "text-medium"
            }`}
          >
            <item.icon 
              className={activeTab === item.id ? "text-primary" : "text-gray-500"} 
              size={20} 
            />
            <span 
              className={`text-xs font-medium ${
                activeTab === item.id ? "text-primary" : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
