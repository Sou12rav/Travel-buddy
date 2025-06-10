import { pgTable, text, serial, integer, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: text("password").notNull(),
  displayName: varchar("display_name", { length: 100 }),
  email: varchar("email", { length: 255 }).unique(),
  avatar: text("avatar"),
  bio: text("bio"),
  location: varchar("location", { length: 100 }),
  preferences: jsonb("preferences").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  usernameIdx: index("users_username_idx").on(table.username),
  emailIdx: index("users_email_idx").on(table.email),
}));

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
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("conversations_user_id_idx").on(table.userId),
}));

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => ({
  conversationIdIdx: index("messages_conversation_id_idx").on(table.conversationId),
  timestampIdx: index("messages_timestamp_idx").on(table.timestamp),
}));

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  content: true,
  role: true,
});

export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  date: timestamp("date").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  activities: jsonb("activities").$type<any[]>().notNull().default([]),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("itineraries_user_id_idx").on(table.userId),
  dateIdx: index("itineraries_date_idx").on(table.date),
  cityIdx: index("itineraries_city_idx").on(table.city),
}));

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
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'hotel', 'restaurant', 'attraction'
  address: text("address"),
  city: varchar("city", { length: 100 }).notNull(),
  rating: integer("rating"),
  placeId: varchar("place_id", { length: 100 }), // For Google Places API reference
  coordinates: jsonb("coordinates").$type<{ lat: number; lng: number }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("saved_places_user_id_idx").on(table.userId),
  typeIdx: index("saved_places_type_idx").on(table.type),
  cityIdx: index("saved_places_city_idx").on(table.city),
  placeIdIdx: index("saved_places_place_id_idx").on(table.placeId),
}));

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
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content"),
  mediaUrl: text("media_url"),
  mediaType: varchar("media_type", { length: 20 }), // 'image', 'video', 'reel'
  location: varchar("location", { length: 200 }),
  placeId: varchar("place_id", { length: 100 }), // ID of a tagged place
  placeDetails: jsonb("place_details").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  likes: integer("likes").default(0).notNull(),
}, (table) => ({
  userIdIdx: index("posts_user_id_idx").on(table.userId),
  createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
  locationIdx: index("posts_location_idx").on(table.location),
  placeIdIdx: index("posts_place_id_idx").on(table.placeId),
}));

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
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  postIdIdx: index("comments_post_id_idx").on(table.postId),
  userIdIdx: index("comments_user_id_idx").on(table.userId),
  createdAtIdx: index("comments_created_at_idx").on(table.createdAt),
}));

export const insertCommentSchema = createInsertSchema(comments).pick({
  postId: true,
  userId: true,
  content: true,
});

export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  friendId: integer("friend_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("friendships_user_id_idx").on(table.userId),
  friendIdIdx: index("friendships_friend_id_idx").on(table.friendId),
  statusIdx: index("friendships_status_idx").on(table.status),
}));

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
  followerId: integer("follower_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  followingId: integer("following_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  followerIdIdx: index("followers_follower_id_idx").on(table.followerId),
  followingIdIdx: index("followers_following_id_idx").on(table.followingId),
  uniqueFollowIdx: index("followers_unique_follow_idx").on(table.followerId, table.followingId),
}));

export const insertFollowerSchema = createInsertSchema(followers).pick({
  followerId: true,
  followingId: true,
});

export type Follower = typeof followers.$inferSelect;
export type InsertFollower = z.infer<typeof insertFollowerSchema>;
