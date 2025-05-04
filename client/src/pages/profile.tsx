import { useState } from "react";
import { useApp } from "../lib/api_context";
import { 
  User, 
  Bell, 
  Moon, 
  Globe, 
  Clock, 
  Bookmark, 
  CreditCard, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  const { currentUser, setCurrentUser } = useApp();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState(
    currentUser?.preferences?.notifications ?? true
  );
  const [darkMode, setDarkMode] = useState(
    currentUser?.preferences?.darkMode ?? false
  );
  
  // Handle preference updates
  const { mutate: updatePreference } = useMutation({
    mutationFn: async (preferences: any) => {
      // In a real app, we would make an API call to update the user's preferences
      return { ...currentUser, preferences: { ...currentUser?.preferences, ...preferences } };
    },
    onSuccess: (updatedUser) => {
      setCurrentUser(updatedUser);
    }
  });
  
  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    updatePreference({ notifications: checked });
  };
  
  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    updatePreference({ darkMode: checked });
    
    // Toggle dark mode class on HTML element
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleSignOut = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Please sign in</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <h1 className="font-poppins font-semibold text-dark text-lg">My Profile</h1>
        </div>
      </header>

      {/* Profile Info */}
      <section className="px-4 py-6 bg-white">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <User className="text-primary" size={32} />
          </div>
          <div>
            <h2 className="font-poppins font-semibold text-lg">
              {currentUser.displayName || currentUser.username}
            </h2>
            <p className="text-medium">{currentUser.email}</p>
            <button className="mt-1 text-primary text-sm font-medium">Edit Profile</button>
          </div>
        </div>
      </section>

      {/* Settings List */}
      <section className="mt-4 bg-white">
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium text-medium">Preferences</h3>
        </div>
        <div className="divide-y">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="text-medium mr-3" size={20} />
              <span>Notifications</span>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={handleNotificationsChange}
            />
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Moon className="text-medium mr-3" size={20} />
              <span>Dark Mode</span>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={handleDarkModeChange}
            />
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="text-medium mr-3" size={20} />
              <span>Language</span>
            </div>
            <div className="flex items-center">
              <span className="text-medium mr-2">
                {currentUser.preferences?.language || "English"}
              </span>
              <ChevronRight className="text-medium" size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* Account Settings */}
      <section className="mt-4 bg-white">
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium text-medium">Account</h3>
        </div>
        <div className="divide-y">
          <div className="px-4 py-3 flex items-center">
            <Clock className="text-medium mr-3" size={20} />
            <span>Travel History</span>
            <ChevronRight className="text-medium ml-auto" size={16} />
          </div>
          <div className="px-4 py-3 flex items-center">
            <Bookmark className="text-medium mr-3" size={20} />
            <span>Saved Places</span>
            <ChevronRight className="text-medium ml-auto" size={16} />
          </div>
          <div className="px-4 py-3 flex items-center">
            <CreditCard className="text-medium mr-3" size={20} />
            <span>Payment Methods</span>
            <ChevronRight className="text-medium ml-auto" size={16} />
          </div>
          <div 
            className="px-4 py-3 flex items-center"
            onClick={handleSignOut}
          >
            <LogOut className="text-red-500 mr-3" size={20} />
            <span className="text-red-500">Sign Out</span>
          </div>
        </div>
      </section>
    </div>
  );
}
