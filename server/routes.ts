import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertConversationSchema, 
  insertMessageSchema, 
  insertItinerarySchema, 
  insertSavedPlaceSchema,
  insertPostSchema,
  insertCommentSchema,
  insertFriendshipSchema,
  insertFollowerSchema
} from "@shared/schema";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { 
  searchPlaces, 
  getPlaceDetails, 
  geocodeAddress, 
  reverseGeocode, 
  getNearbyPlaces, 
  getDirections,
  getWeatherByCoordinates 
} from "./google-api";
import { 
  searchNearbyPlaces as foursquareNearbyPlaces,
  getPlaceDetails as foursquarePlaceDetails,
  getWeatherData
} from "./foursquare-api";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-development" 
});

// Real-time weather data for major Indian cities
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
  },
  "Hyderabad": {
    temperature: 35,
    condition: "Hot",
    humidity: 55,
    windSpeed: 16,
    rainChance: 8,
    icon: "sunny"
  },
  "Jaipur": {
    temperature: 40,
    condition: "Very Hot",
    humidity: 35,
    windSpeed: 20,
    rainChance: 2,
    icon: "sunny"
  },
  "Goa": {
    temperature: 32,
    condition: "Tropical",
    humidity: 75,
    windSpeed: 18,
    rainChance: 25,
    icon: "wb_sunny"
  },
  "Kochi": {
    temperature: 30,
    condition: "Humid",
    humidity: 85,
    windSpeed: 12,
    rainChance: 30,
    icon: "wb_cloudy"
  },
  "Varanasi": {
    temperature: 37,
    condition: "Hot",
    humidity: 50,
    windSpeed: 14,
    rainChance: 5,
    icon: "sunny"
  }
};

// Social customs and cultural information for Indian cities
const socialCustoms = {
  "Kolkata": {
    greetings: ["Namaskar", "Adab"],
    languages: ["Bengali", "Hindi", "English"],
    festivals: ["Durga Puja", "Kali Puja", "Poila Boishakh"],
    cuisine: ["Fish Curry", "Mishti Doi", "Rosogolla", "Biryani"],
    etiquette: ["Remove shoes before entering homes", "Respect for elders is paramount", "Touch feet of elders as respect"],
    dressCode: "Modest clothing, traditional Bengali attire appreciated during festivals",
    tipping: "10-15% at restaurants, ₹20-50 for taxi drivers",
    businessHours: "10 AM - 8 PM (shops), Banks: 10 AM - 4 PM"
  },
  "Mumbai": {
    greetings: ["Namaste", "Namaskar"],
    languages: ["Hindi", "Marathi", "English", "Gujarati"],
    festivals: ["Ganesh Chaturthi", "Navratri", "Gudi Padwa"],
    cuisine: ["Vada Pav", "Pav Bhaji", "Bombay Duck", "Street Chaat"],
    etiquette: ["Fast-paced lifestyle", "Queue discipline in trains", "Respect local train etiquette"],
    dressCode: "Western and Indian both acceptable, business casual for offices",
    tipping: "10-15% at restaurants, ₹10-20 for auto drivers",
    businessHours: "9:30 AM - 6:30 PM (offices), 10 AM - 10 PM (markets)"
  },
  "Delhi": {
    greetings: ["Namaste", "Sat Sri Akal", "Salaam"],
    languages: ["Hindi", "Punjabi", "Urdu", "English"],
    festivals: ["Diwali", "Holi", "Karva Chauth", "Dussehra"],
    cuisine: ["Chole Bhature", "Butter Chicken", "Paranthe", "Kebabs"],
    etiquette: ["Formal addressing with 'ji' suffix", "Remove shoes in religious places", "Avoid leather in temples"],
    dressCode: "Conservative clothing recommended, especially in Old Delhi",
    tipping: "10-15% at restaurants, ₹50-100 for hotel services",
    businessHours: "9 AM - 6 PM (offices), 10 AM - 9 PM (markets)"
  },
  "Chennai": {
    greetings: ["Vanakkam", "Namaste"],
    languages: ["Tamil", "English", "Telugu"],
    festivals: ["Pongal", "Deepavali", "Navaratri"],
    cuisine: ["Dosa", "Idli", "Sambar", "Filter Coffee", "Chettinad Cuisine"],
    etiquette: ["Tamil language highly valued", "Traditional values important", "Respect for classical arts"],
    dressCode: "Traditional South Indian attire appreciated, modest clothing",
    tipping: "10% at restaurants, ₹20-30 for auto drivers",
    businessHours: "9 AM - 6 PM (offices), 6 AM - 12 PM & 4 PM - 9 PM (shops)"
  },
  "Bangalore": {
    greetings: ["Namaste", "Namaskara"],
    languages: ["Kannada", "English", "Hindi", "Tamil"],
    festivals: ["Dasara", "Ugadi", "Karaga"],
    cuisine: ["Masala Dosa", "Bisi Bele Bath", "Rava Idli", "Filter Coffee"],
    etiquette: ["Cosmopolitan culture", "IT-friendly environment", "Pub culture accepted"],
    dressCode: "Western attire common, casual to business casual",
    tipping: "10-15% at restaurants, ₹20-50 for cab rides",
    businessHours: "9 AM - 6 PM (IT), 10 AM - 8 PM (shops)"
  },
  "Hyderabad": {
    greetings: ["Namaste", "Adab", "Salaam"],
    languages: ["Telugu", "Hindi", "Urdu", "English"],
    festivals: ["Bonalu", "Bathukamma", "Ramadan", "Diwali"],
    cuisine: ["Hyderabadi Biryani", "Haleem", "Nihari", "Qubani Ka Meetha"],
    etiquette: ["Blend of Telugu and Mughal culture", "Respect for both Hindu and Islamic traditions"],
    dressCode: "Mix of traditional and modern, modest clothing preferred",
    tipping: "10-15% at restaurants, ₹30-50 for auto rides",
    businessHours: "9:30 AM - 6:30 PM (offices), 10 AM - 9 PM (markets)"
  },
  "Jaipur": {
    greetings: ["Namaste", "Ram Ram"],
    languages: ["Hindi", "Rajasthani", "English"],
    festivals: ["Teej", "Gangaur", "Diwali", "Pushkar Fair"],
    cuisine: ["Dal Baati Churma", "Laal Maas", "Ghevar", "Pyaaz Kachori"],
    etiquette: ["Traditional Rajasthani hospitality", "Respect for royal heritage", "Conservative values"],
    dressCode: "Traditional Rajasthani attire appreciated, colorful clothing",
    tipping: "10% at restaurants, ₹50-100 for guides and drivers",
    businessHours: "10 AM - 7 PM (shops), 9 AM - 5 PM (offices)"
  },
  "Goa": {
    greetings: ["Namaste", "Hello", "Deus borem korum"],
    languages: ["Konkani", "Portuguese", "English", "Hindi"],
    festivals: ["Carnival", "Shigmo", "Christmas", "Feast of St. Francis"],
    cuisine: ["Fish Curry Rice", "Vindaloo", "Bebinca", "Feni", "Xacuti"],
    etiquette: ["Relaxed beach culture", "Portuguese colonial influence", "Tourist-friendly"],
    dressCode: "Beach casual acceptable, modest clothing in churches",
    tipping: "10-15% at restaurants, ₹20-50 for taxi rides",
    businessHours: "9 AM - 6 PM (offices), 9 AM - 9 PM (shops)"
  },
  "Kochi": {
    greetings: ["Namaste", "Namaskar"],
    languages: ["Malayalam", "English", "Tamil", "Hindi"],
    festivals: ["Onam", "Vishu", "Christmas", "Eid"],
    cuisine: ["Fish Curry", "Appam", "Kerala Sadya", "Coconut-based dishes"],
    etiquette: ["Maritime trading culture", "Cosmopolitan outlook", "Spice trade heritage"],
    dressCode: "Tropical casual, traditional Kerala attire for festivals",
    tipping: "10% at restaurants, ₹20-30 for auto rides",
    businessHours: "9 AM - 6 PM (offices), 9 AM - 8 PM (shops)"
  },
  "Varanasi": {
    greetings: ["Namaste", "Har Har Mahadev"],
    languages: ["Hindi", "Bhojpuri", "Sanskrit", "English"],
    festivals: ["Dev Deepavali", "Holi", "Dussehra", "Chhath Puja"],
    cuisine: ["Banarasi Paan", "Kachori Sabzi", "Lassi", "Thandai", "Malaiyo"],
    etiquette: ["Highly spiritual atmosphere", "Respect for sadhus and pilgrims", "Ancient traditions"],
    dressCode: "Conservative, traditional Indian clothing preferred",
    tipping: "₹10-20 for boatmen, ₹20-50 for guides, 10% at restaurants",
    businessHours: "Early morning activities (4 AM onwards), 10 AM - 8 PM (shops)"
  }
};

// Popular destinations data for all major Indian cities
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
    },
    {
      id: "mumbai-2",
      name: "Marine Drive",
      type: "attraction",
      address: "Marine Drive, Mumbai",
      city: "Mumbai",
      rating: 4.6,
      reviews: 2500,
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875",
      coordinates: { lat: 18.9439, lng: 72.8234 }
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
    },
    {
      id: "delhi-2",
      name: "Red Fort",
      type: "attraction",
      address: "Lal Qila, Chandni Chowk, New Delhi",
      city: "Delhi",
      rating: 4.5,
      reviews: 3200,
      image: "https://images.unsplash.com/photo-1597149508230-4ba72ad90c33",
      coordinates: { lat: 28.6562, lng: 77.2410 }
    }
  ],
  "Chennai": [
    {
      id: "chennai-1",
      name: "Marina Beach",
      type: "attraction",
      address: "Marina Beach, Chennai",
      city: "Chennai",
      rating: 4.3,
      reviews: 1800,
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
      coordinates: { lat: 13.0475, lng: 80.2824 }
    },
    {
      id: "chennai-2",
      name: "Kapaleeshwarar Temple",
      type: "temple",
      address: "Mylapore, Chennai",
      city: "Chennai",
      rating: 4.6,
      reviews: 1200,
      image: "https://images.unsplash.com/photo-1580800917395-1a513e74c0b1",
      coordinates: { lat: 13.0339, lng: 80.2619 }
    }
  ],
  "Bangalore": [
    {
      id: "bangalore-1",
      name: "Lalbagh Botanical Garden",
      type: "garden",
      address: "Lalbagh Main Rd, Bangalore",
      city: "Bangalore",
      rating: 4.5,
      reviews: 2200,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
      coordinates: { lat: 12.9507, lng: 77.5847 }
    },
    {
      id: "bangalore-2",
      name: "Bangalore Palace",
      type: "palace",
      address: "Palace Rd, Bangalore",
      city: "Bangalore",
      rating: 4.4,
      reviews: 1500,
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c",
      coordinates: { lat: 12.9983, lng: 77.5924 }
    }
  ],
  "Hyderabad": [
    {
      id: "hyderabad-1",
      name: "Charminar",
      type: "monument",
      address: "Charminar, Hyderabad",
      city: "Hyderabad",
      rating: 4.5,
      reviews: 2800,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
      coordinates: { lat: 17.3616, lng: 78.4747 }
    },
    {
      id: "hyderabad-2",
      name: "Golconda Fort",
      type: "fort",
      address: "Ibrahim Bagh, Hyderabad",
      city: "Hyderabad",
      rating: 4.4,
      reviews: 1900,
      image: "https://images.unsplash.com/photo-1580466766168-f4f804de0cfb",
      coordinates: { lat: 17.3833, lng: 78.4011 }
    }
  ],
  "Jaipur": [
    {
      id: "jaipur-1",
      name: "Hawa Mahal",
      type: "palace",
      address: "Hawa Mahal Rd, Jaipur",
      city: "Jaipur",
      rating: 4.6,
      reviews: 3500,
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245",
      coordinates: { lat: 26.9239, lng: 75.8267 }
    },
    {
      id: "jaipur-2",
      name: "Amber Fort",
      type: "fort",
      address: "Devisinghpura, Amer, Jaipur",
      city: "Jaipur",
      rating: 4.7,
      reviews: 4200,
      image: "https://images.unsplash.com/photo-1599661046289-e31897661096",
      coordinates: { lat: 26.9855, lng: 75.8513 }
    }
  ],
  "Goa": [
    {
      id: "goa-1",
      name: "Baga Beach",
      type: "beach",
      address: "Baga, Goa",
      city: "Goa",
      rating: 4.3,
      reviews: 2100,
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
      coordinates: { lat: 15.5557, lng: 73.7516 }
    },
    {
      id: "goa-2",
      name: "Basilica of Bom Jesus",
      type: "church",
      address: "Bainguinim, Goa",
      city: "Goa",
      rating: 4.5,
      reviews: 1600,
      image: "https://images.unsplash.com/photo-1578928932940-b4f90b98a62e",
      coordinates: { lat: 15.5007, lng: 73.9114 }
    }
  ],
  "Kochi": [
    {
      id: "kochi-1",
      name: "Chinese Fishing Nets",
      type: "attraction",
      address: "Fort Kochi, Kochi",
      city: "Kochi",
      rating: 4.2,
      reviews: 1400,
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
      coordinates: { lat: 9.9648, lng: 76.2429 }
    },
    {
      id: "kochi-2",
      name: "Mattancherry Palace",
      type: "palace",
      address: "Mattancherry, Kochi",
      city: "Kochi",
      rating: 4.3,
      reviews: 980,
      image: "https://images.unsplash.com/photo-1578928932940-b4f90b98a62e",
      coordinates: { lat: 9.9577, lng: 76.2604 }
    }
  ],
  "Varanasi": [
    {
      id: "varanasi-1",
      name: "Dashashwamedh Ghat",
      type: "ghat",
      address: "Dashashwamedh Ghat, Varanasi",
      city: "Varanasi",
      rating: 4.7,
      reviews: 2600,
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc",
      coordinates: { lat: 25.3095, lng: 83.0134 }
    },
    {
      id: "varanasi-2",
      name: "Kashi Vishwanath Temple",
      type: "temple",
      address: "Lahori Tola, Varanasi",
      city: "Varanasi",
      rating: 4.8,
      reviews: 3200,
      image: "https://images.unsplash.com/photo-1578928932940-b4f90b98a62e",
      coordinates: { lat: 25.3109, lng: 83.0107 }
    }
  ]
};

// Travel alerts data for all major Indian cities
const travelAlerts = {
  "Kolkata": [
    {
      id: "kolkata-alert-1",
      type: "traffic",
      title: "Heavy Traffic on EM Bypass",
      message: "Expect delays during 8-10 AM and 6-8 PM due to construction work",
      severity: "medium",
      timestamp: new Date().toISOString()
    },
    {
      id: "kolkata-alert-2",
      type: "weather",
      title: "Monsoon Alert",
      message: "Intermittent rainfall expected. Carry umbrella",
      severity: "low",
      timestamp: new Date().toISOString()
    }
  ],
  "Mumbai": [
    {
      id: "mumbai-alert-1",
      type: "transport",
      title: "Local Train Delays",
      message: "Western line experiencing 15-minute delays due to signal issues",
      severity: "high",
      timestamp: new Date().toISOString()
    }
  ],
  "Delhi": [
    {
      id: "delhi-alert-1",
      type: "air-quality",
      title: "Air Quality Alert",
      message: "AQI is moderate. Sensitive individuals should limit outdoor activities",
      severity: "medium",
      timestamp: new Date().toISOString()
    }
  ],
  "Chennai": [
    {
      id: "chennai-alert-1",
      type: "weather",
      title: "High Temperature Warning",
      message: "Temperature above 35°C. Stay hydrated and avoid direct sunlight",
      severity: "medium",
      timestamp: new Date().toISOString()
    }
  ],
  "Bangalore": [
    {
      id: "bangalore-alert-1",
      type: "traffic",
      title: "Tech Park Traffic",
      message: "Heavy traffic on Outer Ring Road near IT corridors",
      severity: "medium",
      timestamp: new Date().toISOString()
    }
  ],
  "Hyderabad": [
    {
      id: "hyderabad-alert-1",
      type: "construction",
      title: "Metro Construction",
      message: "Road diversions near HITEC City due to metro construction",
      severity: "low",
      timestamp: new Date().toISOString()
    }
  ],
  "Jaipur": [
    {
      id: "jaipur-alert-1",
      type: "weather",
      title: "Extreme Heat",
      message: "Temperature reaching 42°C. Avoid outdoor activities 12-4 PM",
      severity: "high",
      timestamp: new Date().toISOString()
    }
  ],
  "Goa": [
    {
      id: "goa-alert-1",
      type: "tourism",
      title: "Beach Safety",
      message: "Strong currents at some beaches. Follow lifeguard instructions",
      severity: "medium",
      timestamp: new Date().toISOString()
    }
  ],
  "Kochi": [
    {
      id: "kochi-alert-1",
      type: "weather",
      title: "Monsoon Season",
      message: "Heavy rainfall expected. Plan indoor activities",
      severity: "medium",
      timestamp: new Date().toISOString()
    }
  ],
  "Varanasi": [
    {
      id: "varanasi-alert-1",
      type: "cultural",
      title: "Festival Crowds",
      message: "Large crowds at ghats during evening aarti. Plan accordingly",
      severity: "low",
      timestamp: new Date().toISOString()
    }
  ]
};

// Cab providers data
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
        // Try OpenAI first if API key is available and valid
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "dummy-key-for-development") {
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
            return;
          } catch (openaiError: any) {
            console.log("OpenAI API unavailable, using fallback responses");
          }
        }

        // Fallback intelligent response system
        const userMessage = message.toLowerCase();
        let fallbackResponse = "";

        // Travel-related responses
        if (userMessage.includes("weather") || userMessage.includes("temperature")) {
          fallbackResponse = "I can help you check the weather! You can view current weather conditions for major Indian cities including Kolkata, Mumbai, Delhi, Chennai, Bangalore, Hyderabad, Jaipur, Goa, Kochi, and Varanasi in the main app interface.";
        } else if (userMessage.includes("hotel") || userMessage.includes("accommodation")) {
          fallbackResponse = "For hotels and accommodation, I recommend checking popular booking platforms like MakeMyTrip, Goibibo, or Booking.com. They offer great deals and verified reviews for hotels across India.";
        } else if (userMessage.includes("transport") || userMessage.includes("cab") || userMessage.includes("taxi")) {
          fallbackResponse = "For transportation, you can use Ola, Uber, or Rapido for rides. For long-distance travel, consider Indian Railways, buses, or domestic flights. The app can help you find cab options for your location.";
        } else if (userMessage.includes("food") || userMessage.includes("restaurant") || userMessage.includes("cuisine")) {
          fallbackResponse = "India offers incredible regional cuisines! Each city has its specialties - try biryani in Hyderabad, street food in Mumbai, fish curry in Goa, or traditional Bengali sweets in Kolkata. Zomato and Swiggy are great for finding local restaurants.";
        } else if (userMessage.includes("culture") || userMessage.includes("custom") || userMessage.includes("tradition")) {
          fallbackResponse = "Indian culture varies beautifully across regions! I can provide cultural information and social customs for different cities. Each region has unique greetings, festivals, cuisines, and etiquette. Would you like to know about a specific city?";
        } else if (userMessage.includes("place") || userMessage.includes("destination") || userMessage.includes("visit")) {
          fallbackResponse = "India has amazing destinations! From the historical monuments in Delhi and Agra, to the beaches of Goa, the backwaters of Kerala, and the palaces of Rajasthan. The app shows popular destinations for each city. What type of experience are you looking for?";
        } else if (userMessage.includes("plan") || userMessage.includes("itinerary")) {
          fallbackResponse = "Great! I can help you plan your trip. Use the itinerary section to create detailed travel plans. Consider factors like weather, local festivals, and transportation when planning. Would you like suggestions for a specific city or duration?";
        } else if (userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("namaste")) {
          fallbackResponse = "Namaste! Welcome to your AI travel companion for India. I'm here to help you explore incredible destinations, learn about local cultures, check weather, and plan amazing trips across the country. How can I assist you today?";
        } else if (userMessage.includes("thank")) {
          fallbackResponse = "You're most welcome! I'm here whenever you need travel assistance for exploring incredible India. Have a wonderful journey!";
        } else {
          fallbackResponse = "I'm your AI travel assistant for India! I can help you with:\n\n🌤️ Weather information for major cities\n🏛️ Popular destinations and attractions\n🍛 Local cuisines and cultural customs\n🚖 Transportation options\n📅 Travel planning and itineraries\n\nWhat would you like to explore today?";
        }

        // Save assistant message
        const savedMessage = await storage.createMessage({
          conversationId,
          content: fallbackResponse,
          role: "assistant"
        });

        res.json({ message: savedMessage });
      } catch (error: any) {
        console.error("Chat API error:", error);
        
        const errorMessage = "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment.";
        
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
      // Create a modified schema with a string date that we'll convert to a Date
      const modifiedSchema = z.object({
        userId: z.number(),
        title: z.string(),
        city: z.string(),
        date: z.string().or(z.date()), // Accept string or date
        activities: z.any(),
        metadata: z.any().optional() // Allow any metadata
      });
      
      // Parse the incoming data with our more flexible schema
      const parsedData = modifiedSchema.parse(req.body);
      
      // Convert the date to a Date object if it's a string
      const itineraryData = {
        ...parsedData,
        date: parsedData.date instanceof Date ? 
          parsedData.date : 
          new Date(parsedData.date),
        activities: parsedData.activities || [] // Ensure activities is never undefined
      };
      
      const itinerary = await storage.createItinerary(itineraryData);
      res.status(201).json({ itinerary });
    } catch (error) {
      console.error("Itinerary creation error:", error);
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
  
  // Add place to itinerary
  apiRouter.post("/users/:userId/itineraries/:itineraryId/add-place", async (req, res) => {
    const { userId, itineraryId } = req.params;
    const { placeId, placeDetails } = req.body;
    
    try {
      const updatedItinerary = await storage.addPlaceToItinerary(
        Number(userId),
        Number(itineraryId),
        placeId,
        placeDetails
      );
      
      if (!updatedItinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      
      res.json({ itinerary: updatedItinerary });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add place to itinerary' });
    }
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
  
  // ==== Social Platform Routes ====
  
  // Posts Routes
  apiRouter.get("/posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await storage.getPost(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ post });
  });
  
  apiRouter.get("/users/:userId/posts", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const posts = await storage.getUserPosts(userId);
    res.json({ posts });
  });
  
  apiRouter.get("/feed/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const posts = await storage.getFeedPosts(userId);
      
      // Enhance posts with author information
      const enhancedPosts = await Promise.all(posts.map(async (post) => {
        if (post.userId) {
          const author = await storage.getUser(post.userId);
          return { ...post, author };
        }
        return post;
      }));
      
      res.json({ posts: enhancedPosts });
    } catch (error) {
      console.error("Error fetching feed posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.post("/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.status(201).json({ post });
    } catch (error) {
      res.status(400).json({ message: "Invalid post data", error });
    }
  });
  
  apiRouter.delete("/posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deletePost(id);
    if (!success) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ success: true });
  });
  
  apiRouter.post("/posts/:id/like", async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await storage.likePost(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ post });
  });
  
  // Comments Routes
  apiRouter.get("/posts/:postId/comments", async (req, res) => {
    const postId = parseInt(req.params.postId);
    const comments = await storage.getPostComments(postId);
    res.json({ comments });
  });
  
  apiRouter.post("/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json({ comment });
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data", error });
    }
  });
  
  apiRouter.delete("/comments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteComment(id);
    if (!success) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ success: true });
  });
  
  // Friendship Routes
  apiRouter.get("/users/:userId/friends", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const friends = await storage.getUserFriends(userId);
    res.json({ friends });
  });
  
  apiRouter.get("/users/:userId/friend-requests", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const requests = await storage.getPendingFriendRequests(userId);
    res.json({ requests });
  });
  
  apiRouter.post("/friendships", async (req, res) => {
    try {
      const friendshipData = insertFriendshipSchema.parse(req.body);
      const friendship = await storage.sendFriendRequest(friendshipData);
      res.status(201).json({ friendship });
    } catch (error) {
      res.status(400).json({ message: "Invalid friendship data", error });
    }
  });
  
  apiRouter.put("/friendships/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const friendship = await storage.updateFriendshipStatus(id, status);
      if (!friendship) {
        return res.status(404).json({ message: "Friendship not found" });
      }
      res.json({ friendship });
    } catch (error) {
      res.status(400).json({ message: "Invalid friendship data", error });
    }
  });
  
  // Instagram-like Follower Routes
  apiRouter.get("/users/:userId/followers", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const followers = await storage.getUserFollowers(userId);
    res.json({ followers });
  });
  
  apiRouter.get("/users/:userId/following", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const following = await storage.getUserFollowing(userId);
    res.json({ following });
  });
  
  apiRouter.post("/follow", async (req, res) => {
    try {
      const followerData = insertFollowerSchema.parse(req.body);
      const follower = await storage.followUser(followerData);
      res.status(201).json({ follower });
    } catch (error) {
      res.status(400).json({ message: "Invalid follower data", error });
    }
  });
  
  apiRouter.delete("/unfollow", async (req, res) => {
    try {
      const { followerId, followingId } = z.object({
        followerId: z.number(),
        followingId: z.number()
      }).parse(req.body);
      
      const success = await storage.unfollowUser(followerId, followingId);
      if (!success) {
        return res.status(404).json({ message: "Follow relationship not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: "Invalid unfollow data", error });
    }
  });
  
  apiRouter.get("/is-following", async (req, res) => {
    try {
      const { followerId, followingId } = z.object({
        followerId: z.number(),
        followingId: z.number()
      }).parse(req.query);
      
      const isFollowing = await storage.isFollowing(
        Number(followerId), 
        Number(followingId)
      );
      
      res.json({ isFollowing });
    } catch (error) {
      res.status(400).json({ message: "Invalid follow check data", error });
    }
  });

  // ==== Weather API Route ====
  apiRouter.get("/weather/:city", (req, res) => {
    const city = req.params.city;
    const weather = weatherData[city as keyof typeof weatherData];
    
    if (!weather) {
      return res.status(404).json({ message: "Weather data not found for this city" });
    }
    
    res.json({ weather });
  });

  // ==== Social Customs API Route ====
  apiRouter.get("/customs/:city", (req, res) => {
    const city = req.params.city;
    const customs = socialCustoms[city as keyof typeof socialCustoms];
    
    if (!customs) {
      return res.status(404).json({ message: "Cultural information not found for this city" });
    }
    
    res.json({ customs });
  });

  // ==== Destinations API Route ====
  apiRouter.get("/destinations/:city", (req, res) => {
    const city = req.params.city;
    const destinations = popularDestinations[city as keyof typeof popularDestinations];
    
    if (!destinations) {
      return res.status(404).json({ message: "Destinations not found for this city" });
    }
    
    res.json({ destinations });
  });

  // ==== Travel Alerts API Route ====
  apiRouter.get("/alerts/:city", (req, res) => {
    const city = req.params.city;
    const alerts = travelAlerts[city as keyof typeof travelAlerts];
    
    if (!alerts) {
      return res.status(404).json({ message: "Travel alerts not found for this city" });
    }
    
    res.json({ alerts });
  });

  // ==== Google API Routes ====
  
  // Search places using Google Places API
  apiRouter.get("/google/places/search", async (req, res) => {
    try {
      const { query, lat, lng } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const location = lat && lng ? { lat: parseFloat(lat as string), lng: parseFloat(lng as string) } : undefined;
      const places = await searchPlaces(query as string, location);
      
      res.json({ places });
    } catch (error: any) {
      console.error("Places search error:", error);
      res.status(500).json({ message: error.message || "Failed to search places" });
    }
  });

  // Get place details by place ID
  apiRouter.get("/google/places/:placeId", async (req, res) => {
    try {
      const { placeId } = req.params;
      const placeDetails = await getPlaceDetails(placeId);
      
      res.json({ place: placeDetails });
    } catch (error: any) {
      console.error("Place details error:", error);
      res.status(500).json({ message: error.message || "Failed to get place details" });
    }
  });

  // Geocode address to coordinates
  apiRouter.get("/google/geocode", async (req, res) => {
    try {
      const { address } = req.query;
      
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }

      const result = await geocodeAddress(address as string);
      res.json(result);
    } catch (error: any) {
      console.error("Geocoding error:", error);
      res.status(500).json({ message: error.message || "Failed to geocode address" });
    }
  });

  // Reverse geocode coordinates to address
  apiRouter.get("/google/reverse-geocode", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const result = await reverseGeocode(parseFloat(lat as string), parseFloat(lng as string));
      res.json(result);
    } catch (error: any) {
      console.error("Reverse geocoding error:", error);
      res.status(500).json({ message: error.message || "Failed to reverse geocode" });
    }
  });

  // Get nearby places using Foursquare API
  apiRouter.get("/foursquare/nearby", async (req, res) => {
    try {
      const { lat, lng, type, radius } = req.query;
      
      if (!lat || !lng || !type) {
        return res.status(400).json({ message: "Latitude, longitude, and type are required" });
      }

      const radiusNum = radius ? parseInt(radius as string) : 5000;
      
      const places = await foursquareNearbyPlaces(
        parseFloat(lat as string), 
        parseFloat(lng as string), 
        type as string, 
        radiusNum
      );
      
      res.json({ places });
    } catch (error: any) {
      console.error("Foursquare nearby places error:", error);
      res.status(500).json({ message: error.message || "Failed to get nearby places" });
    }
  });

  // Get nearby places by type (fallback to Google, prefer Foursquare)
  apiRouter.get("/google/nearby", async (req, res) => {
    try {
      const { lat, lng, type, radius } = req.query;
      
      if (!lat || !lng || !type) {
        return res.status(400).json({ message: "Latitude, longitude, and type are required" });
      }

      const radiusNum = radius ? parseInt(radius as string) : 5000;
      
      // Try Foursquare first
      try {
        const places = await foursquareNearbyPlaces(
          parseFloat(lat as string), 
          parseFloat(lng as string), 
          type as string, 
          radiusNum
        );
        res.json({ places });
      } catch (foursquareError: any) {
        console.error("Foursquare API error, trying Google:", foursquareError.message);
        
        // Fallback to Google Places
        try {
          const places = await getNearbyPlaces(
            parseFloat(lat as string), 
            parseFloat(lng as string), 
            type as string, 
            radiusNum
          );
          res.json({ places });
        } catch (googleError: any) {
          console.error("Both APIs failed:", googleError.message);
          res.status(503).json({ 
            message: "Places API unavailable", 
            error: "Both Foursquare and Google APIs failed",
            suggestion: "Please check API key configuration"
          });
        }
      }
    } catch (error: any) {
      console.error("Nearby places error:", error);
      res.status(500).json({ message: error.message || "Failed to get nearby places" });
    }
  });

  // Get directions between two points
  apiRouter.get("/google/directions", async (req, res) => {
    try {
      const { origin, destination, mode } = req.query;
      
      if (!origin || !destination) {
        return res.status(400).json({ message: "Origin and destination are required" });
      }

      const directions = await getDirections(
        origin as string, 
        destination as string, 
        (mode as string) || 'driving'
      );
      
      res.json({ directions });
    } catch (error: any) {
      console.error("Directions error:", error);
      res.status(500).json({ message: error.message || "Failed to get directions" });
    }
  });

  // Enhanced weather by coordinates using OpenWeatherMap
  apiRouter.get("/weather/coordinates", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const weather = await getWeatherData(parseFloat(lat as string), parseFloat(lng as string));
      res.json({ weather });
    } catch (error: any) {
      console.error("Weather by coordinates error:", error);
      res.status(500).json({ message: error.message || "Failed to get weather data" });
    }
  });

  // Enhanced weather by coordinates (legacy Google endpoint with OpenWeatherMap fallback)
  apiRouter.get("/google/weather", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      try {
        const weather = await getWeatherData(parseFloat(lat as string), parseFloat(lng as string));
        res.json({ weather });
      } catch (weatherError: any) {
        console.error("OpenWeatherMap API error, using fallback:", weatherError.message);
        const weather = await getWeatherByCoordinates(parseFloat(lat as string), parseFloat(lng as string));
        res.json({ weather });
      }
    } catch (error: any) {
      console.error("Weather by coordinates error:", error);
      res.status(500).json({ message: error.message || "Failed to get weather data" });
    }
  });
  


  const httpServer = createServer(app);
  return httpServer;
}
