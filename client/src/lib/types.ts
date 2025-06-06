// Define API response types for better type safety

export interface WeatherResponse {
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    rainChance: number;
    icon: string;
  };
}

export interface AlertsResponse {
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    title: string;
    description: string;
  }>;
}

export interface DestinationsResponse {
  destinations: Array<{
    id: string;
    name: string;
    type: string;
    address: string;
    city: string;
    rating: number;
    reviews: number;
    image?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }>;
}

export interface CabOptionsResponse {
  cabOptions: Array<{
    provider: string;
    type: string;
    price: number;
    currency: string;
    eta: number;
  }>;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
  timestamp: string;
}

export interface MessagesResponse {
  messages: Array<ChatMessage>;
}

export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  preferences: any;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  mediaUrl: string;
  mediaType: string; // 'image', 'video', 'reel'
  location: string;
  placeId?: string; // ID of a tagged place
  placeDetails?: any; // Details about the tagged place
  createdAt: string;
  likes: number;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface Friendship {
  id: number;
  userId: number;
  friendId: number;
  status: string; // 'pending', 'accepted', 'rejected'
  createdAt: string;
}

export interface Follower {
  id: number;
  followerId: number; // User who is following
  followingId: number; // User being followed
  createdAt: string;
}

export interface Itinerary {
  id: number;
  userId: number;
  title: string;
  date: string;
  city: string;
  activities: Activity[];
  createdAt: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  icon: string;
  placeId?: string;
}