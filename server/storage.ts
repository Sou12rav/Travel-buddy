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
  Post,
  InsertPost,
  Comment,
  InsertComment,
  Friendship,
  InsertFriendship,
  PlaceInfo,
  Weather,
  CabOption,
  Activity,
  Follower,
  InsertFollower
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
  
  // Social platform operations
  // Post operations
  getPost(id: number): Promise<Post | undefined>;
  getUserPosts(userId: number): Promise<Post[]>;
  getFeedPosts(userId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  deletePost(id: number): Promise<boolean>;
  likePost(id: number): Promise<Post | undefined>;
  
  // Comment operations
  getPostComments(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;
  
  // Friendship operations
  getUserFriends(userId: number): Promise<User[]>;
  getPendingFriendRequests(userId: number): Promise<Friendship[]>;
  sendFriendRequest(friendship: InsertFriendship): Promise<Friendship>;
  updateFriendshipStatus(id: number, status: string): Promise<Friendship | undefined>;
  
  // Instagram-like Follower operations
  followUser(follower: InsertFollower): Promise<Follower>;
  unfollowUser(followerId: number, followingId: number): Promise<boolean>;
  getUserFollowers(userId: number): Promise<User[]>;
  getUserFollowing(userId: number): Promise<User[]>;
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  
  // Tagged place operations
  addPlaceToItinerary(userId: number, itineraryId: number, placeId: string, placeDetails: any): Promise<Itinerary | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private itineraries: Map<number, Itinerary>;
  private savedPlaces: Map<number, SavedPlace>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private friendships: Map<number, Friendship>;
  private followers: Map<number, Follower>;
  
  private userId = 1;
  private conversationId = 1;
  private messageId = 1;
  private itineraryId = 1;
  private savedPlaceId = 1;
  private postId = 1;
  private commentId = 1;
  private friendshipId = 1;
  private followerId = 1;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.itineraries = new Map();
    this.savedPlaces = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.friendships = new Map();
    this.followers = new Map();

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
  
  // Post operations
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(
      (post) => post.userId === userId
    ).sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
  }
  
  async getFeedPosts(userId: number): Promise<Post[]> {
    // Get all friends of the user
    const friends = await this.getUserFriends(userId);
    const friendIds = friends.map(friend => friend.id);
    
    // Get posts from friends and the user's own posts
    return Array.from(this.posts.values())
      .filter(post => friendIds.includes(post.userId as number) || post.userId === userId)
      .sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
  }
  
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postId++;
    const post: Post = {
      ...insertPost,
      id,
      likes: 0,
      createdAt: new Date()
    };
    this.posts.set(id, post);
    return post;
  }
  
  async deletePost(id: number): Promise<boolean> {
    // Delete all comments on the post first
    Array.from(this.comments.values())
      .filter(comment => comment.postId === id)
      .forEach(comment => this.comments.delete(comment.id));
      
    // Delete the post
    return this.posts.delete(id);
  }
  
  async likePost(id: number): Promise<Post | undefined> {
    const post = await this.getPost(id);
    if (!post) return undefined;
    
    const updatedPost: Post = {
      ...post,
      likes: (post.likes || 0) + 1
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  // Comment operations
  async getPostComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => (a.createdAt as Date).getTime() - (b.createdAt as Date).getTime());
  }
  
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date()
    };
    this.comments.set(id, comment);
    return comment;
  }
  
  async deleteComment(id: number): Promise<boolean> {
    return this.comments.delete(id);
  }
  
  // Friendship operations
  async getUserFriends(userId: number): Promise<User[]> {
    const acceptedFriendships = Array.from(this.friendships.values())
      .filter(friendship => 
        (friendship.userId === userId || friendship.friendId === userId) && 
        friendship.status === 'accepted'
      );
      
    // Get friend IDs
    const friendIds = acceptedFriendships.map(friendship => 
      friendship.userId === userId ? friendship.friendId : friendship.userId
    );
    
    // Return friend objects
    return Array.from(this.users.values())
      .filter(user => friendIds.includes(user.id));
  }
  
  async getPendingFriendRequests(userId: number): Promise<Friendship[]> {
    return Array.from(this.friendships.values())
      .filter(friendship => 
        friendship.friendId === userId && 
        friendship.status === 'pending'
      );
  }
  
  async sendFriendRequest(insertFriendship: InsertFriendship): Promise<Friendship> {
    const id = this.friendshipId++;
    const friendship: Friendship = {
      ...insertFriendship,
      id,
      createdAt: new Date()
    };
    this.friendships.set(id, friendship);
    return friendship;
  }
  
  async updateFriendshipStatus(id: number, status: string): Promise<Friendship | undefined> {
    const friendship = this.friendships.get(id);
    if (!friendship) return undefined;
    
    const updatedFriendship: Friendship = {
      ...friendship,
      status
    };
    this.friendships.set(id, updatedFriendship);
    return updatedFriendship;
  }
  
  // Instagram-like Follower operations
  async followUser(insertFollower: InsertFollower): Promise<Follower> {
    const id = this.followerId++;
    const follower: Follower = {
      ...insertFollower,
      id,
      createdAt: new Date()
    };
    this.followers.set(id, follower);
    return follower;
  }
  
  async unfollowUser(followerId: number, followingId: number): Promise<boolean> {
    // Find the follower relationship
    const followerEntry = Array.from(this.followers.entries()).find(
      ([_, follower]) => follower.followerId === followerId && follower.followingId === followingId
    );
    
    if (!followerEntry) return false;
    
    // Delete the follower relationship
    return this.followers.delete(followerEntry[0]);
  }
  
  async getUserFollowers(userId: number): Promise<User[]> {
    // Find all users who follow this user
    const followerIds = Array.from(this.followers.values())
      .filter(follower => follower.followingId === userId)
      .map(follower => follower.followerId);
    
    // Return the follower user objects
    return Array.from(this.users.values())
      .filter(user => followerIds.includes(user.id));
  }
  
  async getUserFollowing(userId: number): Promise<User[]> {
    // Find all users who this user follows
    const followingIds = Array.from(this.followers.values())
      .filter(follower => follower.followerId === userId)
      .map(follower => follower.followingId);
    
    // Return the following user objects
    return Array.from(this.users.values())
      .filter(user => followingIds.includes(user.id));
  }
  
  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    return Array.from(this.followers.values()).some(
      follower => follower.followerId === followerId && follower.followingId === followingId
    );
  }
  
  // Tagged place operations
  async addPlaceToItinerary(userId: number, itineraryId: number, placeId: string, placeDetails: any): Promise<Itinerary | undefined> {
    const itinerary = await this.getItinerary(itineraryId);
    if (!itinerary || itinerary.userId !== userId) return undefined;
    
    // Create a new activity from the place details
    const newActivity: Activity = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: placeDetails.name || "Visit Place",
      description: `Visit ${placeDetails.name || "tagged place"}`,
      location: placeDetails.address || placeDetails.location || "",
      icon: placeDetails.type === "restaurant" ? "restaurant" : 
           placeDetails.type === "hotel" ? "hotel" : "place",
      placeId: placeId
    };
    
    // Add the activity to the itinerary
    const activities = [...(itinerary.activities as Activity[]), newActivity];
    
    // Update the itinerary
    const updatedItinerary = await this.updateItinerary(itineraryId, {
      ...itinerary,
      activities
    });
    
    return updatedItinerary;
  }
}

import { DatabaseStorage } from "./database-storage";

// You can toggle between MemStorage and DatabaseStorage
// For development, you can use MemStorage
// export const storage = new MemStorage();

// For production with actual database
export const storage = new DatabaseStorage();

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
    
    // Create a friend user
    const friendUser = await storage.createUser({
      username: "friend",
      password: "friend",
      displayName: "Priya Sharma",
      email: "priya.sharma@example.com",
      preferences: { notifications: true, darkMode: true, language: "English" }
    });
    
    // Create friendship
    await storage.sendFriendRequest({
      userId: friendUser.id,
      friendId: user.id,
      status: 'accepted'
    });
    
    // Create sample posts
    const samplePosts = [
      {
        userId: user.id,
        content: "Enjoying the beautiful sunrise at Victoria Memorial! Perfect way to start my Kolkata trip. #Travel #Kolkata #India",
        mediaUrl: "https://images.unsplash.com/photo-1586183189334-1083383afe03?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        mediaType: "image",
        location: "Victoria Memorial, Kolkata"
      },
      {
        userId: friendUser.id,
        content: "Street food tour at Park Street! The phuchkas here are incredible. Who wants to join me next time? #FoodLover #Kolkata #StreetFood",
        mediaUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        mediaType: "image",
        location: "Park Street, Kolkata"
      },
      {
        userId: user.id,
        content: "Check out my boat ride along the Hooghly River! The views of Howrah Bridge at sunset are amazing. #TravelVlog #Kolkata",
        mediaUrl: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        mediaType: "video",
        location: "Hooghly River, Kolkata"
      }
    ];
    
    // Add posts
    for (const postData of samplePosts) {
      const post = await storage.createPost(postData);
      
      // Add some comments and likes
      if (post.userId === user.id) {
        await storage.createComment({
          postId: post.id,
          userId: friendUser.id,
          content: "Looks amazing! I'll have to visit there on my next trip."
        });
        await storage.likePost(post.id);
      } else {
        await storage.createComment({
          postId: post.id,
          userId: user.id,
          content: "Great photos! The food looks delicious."
        });
        await storage.likePost(post.id);
      }
    }
    
    // Create follow relationships (Instagram-like following)
    await storage.followUser({
      followerId: user.id,
      followingId: friendUser.id
    });
    
    await storage.followUser({
      followerId: friendUser.id,
      followingId: user.id
    });
  }
})();
