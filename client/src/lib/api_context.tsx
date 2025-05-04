import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiRequest } from "./queryClient";
import { 
  User, 
  Weather, 
  PlaceInfo, 
  CabOption, 
  Itinerary, 
  SavedPlace, 
  Conversation, 
  Message
} from "@shared/schema";

interface AppContextType {
  currentUser: User | null;
  currentCity: string;
  setCurrentCity: (city: string) => void;
  setCurrentUser: (user: User | null) => void;
  getWeather: (city: string) => Promise<Weather>;
  getDestinations: (city: string) => Promise<PlaceInfo[]>;
  getCabOptions: () => Promise<CabOption[]>;
  getTravelAlerts: (city: string) => Promise<any[]>;
  getUserItineraries: (userId: number) => Promise<Itinerary[]>;
  getUserSavedPlaces: (userId: number) => Promise<SavedPlace[]>;
  getConversationMessages: (conversationId: number) => Promise<Message[]>;
  sendChatMessage: (message: string, conversationId: number) => Promise<Message>;
  createConversation: (userId: number) => Promise<Conversation>;
}

// Create a context for the app
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 1,
    username: "demo",
    password: "demo",
    displayName: "Rahul Singh",
    email: "rahul.singh@example.com",
    preferences: { notifications: true, darkMode: false, language: "English" }
  });
  const [currentCity, setCurrentCity] = useState<string>("Kolkata");

  // Function to get weather data
  const getWeather = async (city: string): Promise<Weather> => {
    const response = await apiRequest("GET", `/api/weather/${city}`);
    const data = await response.json();
    return data.weather;
  };

  // Function to get popular destinations
  const getDestinations = async (city: string): Promise<PlaceInfo[]> => {
    const response = await apiRequest("GET", `/api/destinations/${city}`);
    const data = await response.json();
    return data.destinations;
  };

  // Function to get cab options
  const getCabOptions = async (): Promise<CabOption[]> => {
    const response = await apiRequest("GET", `/api/cabs`);
    const data = await response.json();
    return data.cabOptions;
  };

  // Function to get travel alerts
  const getTravelAlerts = async (city: string): Promise<any[]> => {
    const response = await apiRequest("GET", `/api/alerts/${city}`);
    const data = await response.json();
    return data.alerts;
  };

  // Function to get user itineraries
  const getUserItineraries = async (userId: number): Promise<Itinerary[]> => {
    const response = await apiRequest("GET", `/api/users/${userId}/itineraries`);
    const data = await response.json();
    return data.itineraries;
  };

  // Function to get user saved places
  const getUserSavedPlaces = async (userId: number): Promise<SavedPlace[]> => {
    const response = await apiRequest("GET", `/api/users/${userId}/saved-places`);
    const data = await response.json();
    return data.savedPlaces;
  };

  // Function to get conversation messages
  const getConversationMessages = async (conversationId: number): Promise<Message[]> => {
    const response = await apiRequest("GET", `/api/conversations/${conversationId}/messages`);
    const data = await response.json();
    return data.messages;
  };

  // Function to send a chat message
  const sendChatMessage = async (message: string, conversationId: number): Promise<Message> => {
    const response = await apiRequest("POST", `/api/chat`, { message, conversationId });
    const data = await response.json();
    return data.message;
  };

  // Function to create a new conversation
  const createConversation = async (userId: number): Promise<Conversation> => {
    const response = await apiRequest("POST", `/api/conversations`, { userId });
    const data = await response.json();
    return data.conversation;
  };

  const contextValue: AppContextType = {
    currentUser,
    setCurrentUser,
    currentCity,
    setCurrentCity,
    getWeather,
    getDestinations,
    getCabOptions,
    getTravelAlerts,
    getUserItineraries,
    getUserSavedPlaces,
    getConversationMessages,
    sendChatMessage,
    createConversation
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};