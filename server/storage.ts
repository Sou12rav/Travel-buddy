import {
  User,
  InsertUser,
  Conversation,
  InsertConversation,
  Message,
  InsertMessage,
  Itinerary,
  InsertItinerary,
  SavedPlace,
  InsertSavedPlace,
  PlaceInfo,
  Weather,
  CabOption,
  Activity
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Conversation operations
  getConversation(id: number): Promise<Conversation | undefined>;
  getUserConversations(userId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  deleteConversation(id: number): Promise<boolean>;

  // Message operations
  getConversationMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Itinerary operations
  getItinerary(id: number): Promise<Itinerary | undefined>;
  getUserItineraries(userId: number): Promise<Itinerary[]>;
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  updateItinerary(id: number, itinerary: Partial<InsertItinerary>): Promise<Itinerary | undefined>;
  deleteItinerary(id: number): Promise<boolean>;

  // SavedPlace operations
  getSavedPlace(id: number): Promise<SavedPlace | undefined>;
  getUserSavedPlaces(userId: number): Promise<SavedPlace[]>;
  createSavedPlace(savedPlace: InsertSavedPlace): Promise<SavedPlace>;
  deleteSavedPlace(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private itineraries: Map<number, Itinerary>;
  private savedPlaces: Map<number, SavedPlace>;
  
  private userId = 1;
  private conversationId = 1;
  private messageId = 1;
  private itineraryId = 1;
  private savedPlaceId = 1;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.itineraries = new Map();
    this.savedPlaces = new Map();

    // Add a demo user
    this.createUser({
      username: "demo",
      password: "demo",
      displayName: "Rahul Singh",
      email: "rahul.singh@example.com",
      preferences: { notifications: true, darkMode: false, language: "English" }
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Conversation operations
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conversation) => conversation.userId === userId
    );
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationId++;
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date()
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async deleteConversation(id: number): Promise<boolean> {
    return this.conversations.delete(id);
  }

  // Message operations
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.conversationId === conversationId
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  // Itinerary operations
  async getItinerary(id: number): Promise<Itinerary | undefined> {
    return this.itineraries.get(id);
  }

  async getUserItineraries(userId: number): Promise<Itinerary[]> {
    return Array.from(this.itineraries.values()).filter(
      (itinerary) => itinerary.userId === userId
    );
  }

  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const id = this.itineraryId++;
    const itinerary: Itinerary = {
      ...insertItinerary,
      id,
      createdAt: new Date()
    };
    this.itineraries.set(id, itinerary);
    return itinerary;
  }

  async updateItinerary(id: number, itineraryData: Partial<InsertItinerary>): Promise<Itinerary | undefined> {
    const itinerary = await this.getItinerary(id);
    if (!itinerary) return undefined;

    const updatedItinerary = { ...itinerary, ...itineraryData };
    this.itineraries.set(id, updatedItinerary);
    return updatedItinerary;
  }

  async deleteItinerary(id: number): Promise<boolean> {
    return this.itineraries.delete(id);
  }

  // SavedPlace operations
  async getSavedPlace(id: number): Promise<SavedPlace | undefined> {
    return this.savedPlaces.get(id);
  }

  async getUserSavedPlaces(userId: number): Promise<SavedPlace[]> {
    return Array.from(this.savedPlaces.values()).filter(
      (savedPlace) => savedPlace.userId === userId
    );
  }

  async createSavedPlace(insertSavedPlace: InsertSavedPlace): Promise<SavedPlace> {
    const id = this.savedPlaceId++;
    const savedPlace: SavedPlace = {
      ...insertSavedPlace,
      id,
      createdAt: new Date()
    };
    this.savedPlaces.set(id, savedPlace);
    return savedPlace;
  }

  async deleteSavedPlace(id: number): Promise<boolean> {
    return this.savedPlaces.delete(id);
  }
}

export const storage = new MemStorage();

// Initialize some demo data
(async () => {
  const user = await storage.getUserByUsername("demo");
  if (user) {
    // Create a sample itinerary
    const sampleItinerary: InsertItinerary = {
      userId: user.id,
      title: "1-Day Kolkata Tour",
      date: new Date(),
      city: "Kolkata",
      activities: [
        {
          time: "9:00 AM",
          title: "Tram Ride",
          description: "Start with a nostalgic tram ride from Esplanade",
          location: "Esplanade Tram Depot",
          icon: "wb_sunny"
        },
        {
          time: "11:00 AM",
          title: "Victoria Memorial",
          description: "Explore the iconic marble building and museum",
          location: "Victoria Memorial Hall",
          icon: "museum"
        },
        {
          time: "1:30 PM",
          title: "Lunch at Flurys",
          description: "Famous pastries and continental cuisine",
          location: "Park Street",
          icon: "restaurant"
        },
        {
          time: "6:00 PM",
          title: "Howrah Bridge Sunset",
          description: "Enjoy the sunset view of the iconic bridge",
          location: "Mullick Ghat Flower Market",
          icon: "nightlight"
        }
      ]
    };
    await storage.createItinerary(sampleItinerary);

    // Create a sample conversation
    const conversation = await storage.createConversation({ userId: user.id });
    
    // Add welcome message from assistant
    await storage.createMessage({
      conversationId: conversation.id,
      content: "🌤️ Welcome to Kolkata!\n\nI'm Buddy, your AI travel assistant. I can help you explore the city, find places to visit, book rides, and much more.\n\nWhat would you like to know about Kolkata?",
      role: "assistant"
    });

    // Create sample saved places
    const savedPlaces = [
      {
        userId: user.id,
        name: "Victoria Memorial",
        type: "attraction",
        address: "Victoria Memorial Hall, 1, Queens Way, Kolkata",
        city: "Kolkata",
        rating: 5,
        placeId: "ChIJN5XD4NR2AjoRbHojnL-Rwn0",
        coordinates: { lat: 22.5448, lng: 88.3426 }
      },
      {
        userId: user.id,
        name: "Howrah Bridge",
        type: "attraction",
        address: "Howrah Bridge, Kolkata",
        city: "Kolkata",
        rating: 5,
        placeId: "ChIJCwQvoJR3AjoRDWnd8ZBODu4",
        coordinates: { lat: 22.5851, lng: 88.3468 }
      },
      {
        userId: user.id,
        name: "Park Street",
        type: "attraction",
        address: "Park Street, Kolkata",
        city: "Kolkata",
        rating: 4,
        placeId: "ChIJg9x5Tc12AjoRuMPZcyL5J5I",
        coordinates: { lat: 22.5566, lng: 88.3513 }
      }
    ];

    for (const place of savedPlaces) {
      await storage.createSavedPlace(place);
    }
  }
})();
