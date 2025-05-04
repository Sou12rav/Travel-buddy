import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  preferences: jsonb("preferences"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  preferences: true,
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  content: true,
  role: true,
});

export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  city: text("city").notNull(),
  activities: jsonb("activities").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertItinerarySchema = createInsertSchema(itineraries).pick({
  userId: true,
  title: true,
  date: true,
  city: true,
  activities: true,
});

export const savedPlaces = pgTable("saved_places", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'hotel', 'restaurant', 'attraction'
  address: text("address"),
  city: text("city").notNull(),
  rating: integer("rating"),
  placeId: text("place_id"), // For Google Places API reference
  coordinates: jsonb("coordinates"), // { lat: number, lng: number }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedPlaceSchema = createInsertSchema(savedPlaces).pick({
  userId: true,
  name: true,
  type: true,
  address: true,
  city: true,
  rating: true,
  placeId: true,
  coordinates: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Itinerary = typeof itineraries.$inferSelect;
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;

export type SavedPlace = typeof savedPlaces.$inferSelect;
export type InsertSavedPlace = z.infer<typeof insertSavedPlaceSchema>;

// Types for API responses
export type Weather = {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  icon: string;
};

export type PlaceInfo = {
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
};

export type CabOption = {
  provider: string;
  type: string;
  price: number;
  currency: string;
  eta: number;
};

export type MessagePayload = {
  content: string;
  role: 'user' | 'assistant';
};

export type Activity = {
  time: string;
  title: string;
  description: string;
  location: string;
  icon: string;
  placeId?: string;
};
