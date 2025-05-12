import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  avatar: text("avatar"),
  bio: text("bio"),
  location: text("location"),
  preferences: jsonb("preferences"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  avatar: true,
  bio: true,
  location: true,
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
  metadata: jsonb("metadata"), // For storing additional info like budget, transportation, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertItinerarySchema = createInsertSchema(itineraries).pick({
  userId: true,
  title: true,
  date: true,
  city: true,
  activities: true,
  metadata: true,
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

// Social platform types
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content"),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"), // 'image', 'video', 'reel'
  location: text("location"),
  placeId: text("place_id"), // ID of a tagged place
  placeDetails: jsonb("place_details"), // Details about the tagged place
  createdAt: timestamp("created_at").defaultNow().notNull(),
  likes: integer("likes").default(0),
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  content: true,
  mediaUrl: true,
  mediaType: true,
  location: true,
  placeId: true,
  placeDetails: true,
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  postId: true,
  userId: true,
  content: true,
});

export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  friendId: integer("friend_id").references(() => users.id),
  status: text("status").notNull(), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFriendshipSchema = createInsertSchema(friendships).pick({
  userId: true,
  friendId: true,
  status: true,
});

// Types
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Friendship = typeof friendships.$inferSelect;
export type InsertFriendship = z.infer<typeof insertFriendshipSchema>;

// Instagram-like followers system
export const followers = pgTable("followers", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id).notNull(),
  followingId: integer("following_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFollowerSchema = createInsertSchema(followers).pick({
  followerId: true,
  followingId: true,
});

export type Follower = typeof followers.$inferSelect;
export type InsertFollower = z.infer<typeof insertFollowerSchema>;
