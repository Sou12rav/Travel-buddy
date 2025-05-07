import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertConversationSchema, 
  insertMessageSchema, 
  insertItinerarySchema, 
  insertSavedPlaceSchema
} from "@shared/schema";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-development" 
});

// Weather API mock data (in a real app, this would come from a weather API)
const weatherData = {
  "Kolkata": {
    temperature: 31,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    rainChance: 20,
    icon: "wb_sunny"
  },
  "Mumbai": {
    temperature: 33,
    condition: "Sunny",
    humidity: 70,
    windSpeed: 15,
    rainChance: 5,
    icon: "sunny"
  },
  "Delhi": {
    temperature: 38,
    condition: "Clear",
    humidity: 45,
    windSpeed: 18,
    rainChance: 0,
    icon: "sunny"
  },
  "Chennai": {
    temperature: 34,
    condition: "Humid",
    humidity: 80,
    windSpeed: 10,
    rainChance: 15,
    icon: "wb_sunny"
  },
  "Bangalore": {
    temperature: 26,
    condition: "Pleasant",
    humidity: 60,
    windSpeed: 14,
    rainChance: 10,
    icon: "wb_cloudy"
  }
};

// Popular destinations data
const popularDestinations = {
  "Kolkata": [
    {
      id: "kolkata-1",
      name: "Victoria Memorial",
      type: "attraction",
      address: "Victoria Memorial Hall, 1, Queens Way, Kolkata",
      city: "Kolkata",
      rating: 4.8,
      reviews: 2100,
      image: "https://images.unsplash.com/photo-1588416499018-d8c621dad6a0",
      coordinates: { lat: 22.5448, lng: 88.3426 }
    },
    {
      id: "kolkata-2",
      name: "Howrah Bridge",
      type: "attraction",
      address: "Howrah Bridge, Kolkata",
      city: "Kolkata",
      rating: 4.6,
      reviews: 1800,
      image: "https://images.unsplash.com/photo-1614850715776-f4b77550f632",
      coordinates: { lat: 22.5851, lng: 88.3468 }
    },
    {
      id: "kolkata-3",
      name: "Park Street",
      type: "attraction",
      address: "Park Street, Kolkata",
      city: "Kolkata",
      rating: 4.5,
      reviews: 1200,
      image: "https://images.unsplash.com/photo-1586183189334-2597e92c13ef",
      coordinates: { lat: 22.5566, lng: 88.3513 }
    }
  ],
  "Mumbai": [
    {
      id: "mumbai-1",
      name: "Gateway of India",
      type: "attraction",
      address: "Apollo Bandar, Colaba, Mumbai",
      city: "Mumbai",
      rating: 4.7,
      reviews: 3000,
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66",
      coordinates: { lat: 18.9220, lng: 72.8347 }
    }
  ],
  "Delhi": [
    {
      id: "delhi-1",
      name: "India Gate",
      type: "attraction",
      address: "Rajpath, New Delhi",
      city: "Delhi",
      rating: 4.7,
      reviews: 2800,
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      coordinates: { lat: 28.6129, lng: 77.2295 }
    }
  ]
};

// Cab providers mock data
const cabOptions = [
  {
    provider: "Ola",
    type: "Mini",
    price: 125,
    currency: "₹",
    eta: 5
  },
  {
    provider: "Uber",
    type: "Go",
    price: 138,
    currency: "₹",
    eta: 4
  },
  {
    provider: "Rapido",
    type: "Bike",
    price: 72,
    currency: "₹",
    eta: 3
  }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // ==== User Routes ====
  apiRouter.post("/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  apiRouter.get("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  });

  apiRouter.put("/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, userData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  // ==== Conversation Routes ====
  apiRouter.post("/conversations", async (req, res) => {
    try {
      const convData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(convData);
      res.status(201).json({ conversation });
    } catch (error) {
      res.status(400).json({ message: "Invalid conversation data", error });
    }
  });

  apiRouter.get("/users/:userId/conversations", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const conversations = await storage.getUserConversations(userId);
    res.json({ conversations });
  });

  apiRouter.get("/conversations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const conversation = await storage.getConversation(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json({ conversation });
  });

  apiRouter.delete("/conversations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteConversation(id);
    if (!success) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json({ success: true });
  });

  // ==== Message Routes ====
  apiRouter.post("/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json({ message });
    } catch (error) {
      res.status(400).json({ message: "Invalid message data", error });
    }
  });

  apiRouter.get("/conversations/:conversationId/messages", async (req, res) => {
    const conversationId = parseInt(req.params.conversationId);
    const messages = await storage.getConversationMessages(conversationId);
    res.json({ messages });
  });

  // ==== Chat API Route ====
  apiRouter.post("/chat", async (req, res) => {
    try {
      const { message, conversationId } = z.object({
        message: z.string(),
        conversationId: z.number()
      }).parse(req.body);

      // Save user message
      await storage.createMessage({
        conversationId,
        content: message,
        role: "user"
      });

      // Get conversation history
      const messages = await storage.getConversationMessages(conversationId);
      
      // Format messages for OpenAI
      const chatMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }));

      // Add system message
      const systemMessage: ChatCompletionMessageParam = {
        role: "system",
        content: "You are Buddy, an AI travel assistant for India. You help travelers with information about destinations, weather, hotels, restaurants, and transportation. You are friendly, warm, and informative - like a well-traveled friend. Keep responses concise and focused on travel in India. Use emojis where appropriate to make your responses engaging."
      };
      
      // Final formatted messages
      const formattedMessages: ChatCompletionMessageParam[] = [
        systemMessage,
        ...chatMessages
      ];

      try {
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 500
        });

        const assistantMessage = response.choices[0].message.content || "Sorry, I couldn't generate a response.";

        // Save assistant message
        const savedMessage = await storage.createMessage({
          conversationId,
          content: assistantMessage,
          role: "assistant"
        });

        res.json({ message: savedMessage });
      } catch (error: any) {
        console.error("OpenAI API error:", error);
        
        // Determine the type of error and provide appropriate message
        let errorMessage = "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
        
        // Check for quota exceeded error
        if (error && error.code === 'insufficient_quota') {
          errorMessage = "The API key for my knowledge base has exceeded its usage limit. Please contact the app administrator to update the API key.";
        }
        
        // If OpenAI API fails, provide a specific response
        const fallbackMessage = await storage.createMessage({
          conversationId,
          content: errorMessage,
          role: "assistant"
        });
        
        res.json({ message: fallbackMessage });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error });
    }
  });

  // ==== Itinerary Routes ====
  apiRouter.post("/itineraries", async (req, res) => {
    try {
      const itineraryData = insertItinerarySchema.parse(req.body);
      const itinerary = await storage.createItinerary(itineraryData);
      res.status(201).json({ itinerary });
    } catch (error) {
      res.status(400).json({ message: "Invalid itinerary data", error });
    }
  });

  apiRouter.get("/users/:userId/itineraries", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const itineraries = await storage.getUserItineraries(userId);
    res.json({ itineraries });
  });

  apiRouter.get("/itineraries/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const itinerary = await storage.getItinerary(id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.json({ itinerary });
  });

  apiRouter.put("/itineraries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const itineraryData = insertItinerarySchema.partial().parse(req.body);
      const itinerary = await storage.updateItinerary(id, itineraryData);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      res.json({ itinerary });
    } catch (error) {
      res.status(400).json({ message: "Invalid itinerary data", error });
    }
  });

  apiRouter.delete("/itineraries/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteItinerary(id);
    if (!success) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.json({ success: true });
  });

  // ==== Saved Places Routes ====
  apiRouter.post("/saved-places", async (req, res) => {
    try {
      const placeData = insertSavedPlaceSchema.parse(req.body);
      const savedPlace = await storage.createSavedPlace(placeData);
      res.status(201).json({ savedPlace });
    } catch (error) {
      res.status(400).json({ message: "Invalid saved place data", error });
    }
  });

  apiRouter.get("/users/:userId/saved-places", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const savedPlaces = await storage.getUserSavedPlaces(userId);
    res.json({ savedPlaces });
  });

  apiRouter.delete("/saved-places/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteSavedPlace(id);
    if (!success) {
      return res.status(404).json({ message: "Saved place not found" });
    }
    res.json({ success: true });
  });

  // ==== Weather API ====
  apiRouter.get("/weather/:city", async (req, res) => {
    const city = req.params.city as keyof typeof weatherData;
    const weather = weatherData[city];
    
    if (!weather) {
      return res.status(404).json({ message: "Weather data not available for this city" });
    }
    
    res.json({ weather });
  });

  // ==== Popular Destinations API ====
  apiRouter.get("/destinations/:city", async (req, res) => {
    const city = req.params.city as keyof typeof popularDestinations;
    const destinations = popularDestinations[city];
    
    if (!destinations) {
      return res.status(404).json({ message: "Destination data not available for this city" });
    }
    
    res.json({ destinations });
  });

  // ==== Cab Options API ====
  apiRouter.get("/cabs", async (req, res) => {
    res.json({ cabOptions });
  });

  // ==== Travel Alerts API ====
  apiRouter.get("/alerts/:city", async (req, res) => {
    const city = req.params.city;
    
    // Simulated alerts
    const alerts = [];
    
    if (city === "Kolkata") {
      alerts.push({
        id: "kolkata-alert-1",
        type: "weather",
        severity: "warning",
        title: "Light showers expected",
        description: "20% chance of rain in the evening. Carry an umbrella if you're heading out."
      });
    }
    
    if (city === "Mumbai") {
      alerts.push({
        id: "mumbai-alert-1",
        type: "traffic",
        severity: "warning",
        title: "Heavy traffic on Western Express Highway",
        description: "Expect delays of 30-45 minutes. Consider alternate routes."
      });
    }
    
    res.json({ alerts });
  });

  const httpServer = createServer(app);
  return httpServer;
}
