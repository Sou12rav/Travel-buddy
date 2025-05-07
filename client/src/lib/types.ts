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
}

export interface MessagesResponse {
  messages: Array<ChatMessage>;
}