import { eq, and, or, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, 
  conversations,
  messages,
  itineraries,
  savedPlaces,
  posts,
  comments,
  friendships,
  followers,
  type User,
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Itinerary,
  type InsertItinerary,
  type SavedPlace,
  type InsertSavedPlace,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Friendship,
  type InsertFriendship,
  type Follower,
  type InsertFollower
} from "../shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Conversation operations
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation;
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId));
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [createdConversation] = await db
      .insert(conversations)
      .values(conversation)
      .returning();
    return createdConversation;
  }

  async deleteConversation(id: number): Promise<boolean> {
    const result = await db
      .delete(conversations)
      .where(eq(conversations.id, id));
    return !!result.rowCount;
  }

  // Message operations
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [createdMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return createdMessage;
  }

  // Itinerary operations
  async getItinerary(id: number): Promise<Itinerary | undefined> {
    const [itinerary] = await db
      .select()
      .from(itineraries)
      .where(eq(itineraries.id, id));
    return itinerary;
  }

  async getUserItineraries(userId: number): Promise<Itinerary[]> {
    return db
      .select()
      .from(itineraries)
      .where(eq(itineraries.userId, userId))
      .orderBy(desc(itineraries.createdAt));
  }

  async createItinerary(itinerary: InsertItinerary): Promise<Itinerary> {
    const [createdItinerary] = await db
      .insert(itineraries)
      .values(itinerary)
      .returning();
    return createdItinerary;
  }

  async updateItinerary(id: number, itineraryData: Partial<InsertItinerary>): Promise<Itinerary | undefined> {
    const [updatedItinerary] = await db
      .update(itineraries)
      .set(itineraryData)
      .where(eq(itineraries.id, id))
      .returning();
    return updatedItinerary;
  }

  async deleteItinerary(id: number): Promise<boolean> {
    const result = await db
      .delete(itineraries)
      .where(eq(itineraries.id, id));
    return !!result.rowCount;
  }

  // SavedPlace operations
  async getSavedPlace(id: number): Promise<SavedPlace | undefined> {
    const [savedPlace] = await db
      .select()
      .from(savedPlaces)
      .where(eq(savedPlaces.id, id));
    return savedPlace;
  }

  async getUserSavedPlaces(userId: number): Promise<SavedPlace[]> {
    return db
      .select()
      .from(savedPlaces)
      .where(eq(savedPlaces.userId, userId))
      .orderBy(desc(savedPlaces.createdAt));
  }

  async createSavedPlace(savedPlace: InsertSavedPlace): Promise<SavedPlace> {
    const [createdSavedPlace] = await db
      .insert(savedPlaces)
      .values(savedPlace)
      .returning();
    return createdSavedPlace;
  }

  async deleteSavedPlace(id: number): Promise<boolean> {
    const result = await db
      .delete(savedPlaces)
      .where(eq(savedPlaces.id, id));
    return !!result.rowCount;
  }

  // Social platform operations
  // Post operations
  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id));
    return post;
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }

  async getFeedPosts(userId: number): Promise<Post[]> {
    // This is a simplified implementation
    // In real-world, you would fetch posts from users that this user follows
    // For now, return all posts
    return db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [createdPost] = await db
      .insert(posts)
      .values(post)
      .returning();
    return createdPost;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db
      .delete(posts)
      .where(eq(posts.id, id));
    return !!result.rowCount;
  }

  async likePost(id: number): Promise<Post | undefined> {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id));
    
    if (!post) return undefined;
    
    const [updatedPost] = await db
      .update(posts)
      .set({ likes: (post.likes ?? 0) + 1 })
      .where(eq(posts.id, id))
      .returning();
    
    return updatedPost;
  }
  
  // Comment operations
  async getPostComments(postId: number): Promise<Comment[]> {
    return db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [createdComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return createdComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db
      .delete(comments)
      .where(eq(comments.id, id));
    return result.rowCount > 0;
  }
  
  // Friendship operations
  async getUserFriends(userId: number): Promise<User[]> {
    const friendshipsList = await db
      .select()
      .from(friendships)
      .where(
        and(
          or(
            eq(friendships.userId, userId),
            eq(friendships.friendId, userId)
          ),
          eq(friendships.status, 'accepted')
        )
      );
    
    const friendIds = friendshipsList.map((f: any) => 
      f.userId === userId ? f.friendId : f.userId
    ).filter(Boolean) as number[];
    
    if (friendIds.length === 0) return [];
    
    // For now, return empty array as we'd need an "in" operator
    return [];
  }

  async getPendingFriendRequests(userId: number): Promise<Friendship[]> {
    return db
      .select()
      .from(friendships)
      .where(
        and(
          eq(friendships.friendId, userId),
          eq(friendships.status, 'pending')
        )
      );
  }

  async sendFriendRequest(friendship: InsertFriendship): Promise<Friendship> {
    const [createdFriendship] = await db
      .insert(friendships)
      .values(friendship)
      .returning();
    return createdFriendship;
  }

  async updateFriendshipStatus(id: number, status: string): Promise<Friendship | undefined> {
    const [updatedFriendship] = await db
      .update(friendships)
      .set({ status })
      .where(eq(friendships.id, id))
      .returning();
    return updatedFriendship;
  }
  
  // Instagram-like Follower operations
  async followUser(follower: InsertFollower): Promise<Follower> {
    const [createdFollower] = await db
      .insert(followers)
      .values(follower)
      .returning();
    return createdFollower;
  }

  async unfollowUser(followerId: number, followingId: number): Promise<boolean> {
    const result = await db
      .delete(followers)
      .where(
        and(
          eq(followers.followerId, followerId),
          eq(followers.followingId, followingId)
        )
      );
    return result.rowCount > 0;
  }

  async getUserFollowers(userId: number): Promise<User[]> {
    const followerList = await db
      .select()
      .from(followers)
      .where(eq(followers.followingId, userId));
    
    const followerIds = followerList.map(f => f.followerId).filter(Boolean);
    
    if (followerIds.length === 0) return [];
    
    // Need to use "in" operator here
    return [];
  }

  async getUserFollowing(userId: number): Promise<User[]> {
    const followingList = await db
      .select()
      .from(followers)
      .where(eq(followers.followerId, userId));
    
    const followingIds = followingList.map(f => f.followingId).filter(Boolean);
    
    if (followingIds.length === 0) return [];
    
    // Need to use "in" operator here
    return [];
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const [follower] = await db
      .select()
      .from(followers)
      .where(
        and(
          eq(followers.followerId, followerId),
          eq(followers.followingId, followingId)
        )
      );
    
    return !!follower;
  }
  
  // Tagged place operations
  async addPlaceToItinerary(userId: number, itineraryId: number, placeId: string, placeDetails: any): Promise<Itinerary | undefined> {
    const [itinerary] = await db
      .select()
      .from(itineraries)
      .where(
        and(
          eq(itineraries.id, itineraryId),
          eq(itineraries.userId, userId)
        )
      );
    
    if (!itinerary) return undefined;
    
    const activities = itinerary.activities as any[] || [];
    
    const newActivity = {
      time: new Date().toLocaleTimeString(),
      title: placeDetails.name,
      description: `Visit ${placeDetails.name}`,
      location: placeDetails.address,
      icon: 'map-pin',
      placeId
    };
    
    activities.push(newActivity);
    
    const [updatedItinerary] = await db
      .update(itineraries)
      .set({ activities: activities })
      .where(eq(itineraries.id, itineraryId))
      .returning();
    
    return updatedItinerary;
  }
}