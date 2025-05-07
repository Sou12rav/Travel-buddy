import { IStorage } from "./storage";

export async function seedDatabase(storage: IStorage) {
  try {
    // Check if we already have users to avoid duplicate seeding
    const existingUser = await storage.getUserByUsername("demo");
    if (existingUser) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Create demo user
    const user = await storage.createUser({
      username: "demo",
      password: "demo",
      displayName: "Rahul Singh",
      email: "rahul.singh@example.com",
      preferences: { notifications: true, darkMode: false, language: "English" }
    });

    console.log("Created demo user:", user);

    // Create a friend user
    const friendUser = await storage.createUser({
      username: "friend",
      password: "friend",
      displayName: "Priya Sharma",
      email: "priya.sharma@example.com",
      preferences: { notifications: true, darkMode: true, language: "English" }
    });

    console.log("Created friend user:", friendUser);
    
    // Create sample conversation
    const conversation = await storage.createConversation({
      userId: user.id
    });

    console.log("Created conversation:", conversation);
    
    // Create sample messages
    await storage.createMessage({
      conversationId: conversation.id,
      content: "Hello Buddy! Can you help me plan a trip to Kolkata?",
      role: "user"
    });

    await storage.createMessage({
      conversationId: conversation.id,
      content: "Of course! I'd be happy to help plan your trip to Kolkata. When are you planning to visit and how long will you be staying?",
      role: "assistant"
    });

    // Create sample itinerary
    const itinerary = await storage.createItinerary({
      userId: user.id,
      title: "Weekend in Kolkata",
      city: "Kolkata",
      date: new Date("2025-05-20"),
      activities: [
        {
          time: "09:00",
          title: "Victoria Memorial",
          description: "Visit the iconic marble building",
          location: "Victoria Memorial Hall, 1, Queens Way, Kolkata",
          icon: "landmark"
        },
        {
          time: "13:00",
          title: "Lunch at Park Street",
          description: "Enjoy Bengali cuisine",
          location: "Park Street, Kolkata",
          icon: "utensils"
        },
        {
          time: "16:00",
          title: "Howrah Bridge",
          description: "Visit the famous suspension bridge",
          location: "Howrah Bridge, Kolkata",
          icon: "bridge"
        }
      ],
      metadata: {
        transportation: "flight",
        accommodation: "hotel",
        budget: 15000,
        duration: 3,
        notes: "First time visiting Kolkata"
      }
    });

    console.log("Created itinerary:", itinerary);

    // Create sample saved places
    const savedPlaces = [
      {
        userId: user.id,
        name: "Victoria Memorial",
        type: "attraction",
        city: "Kolkata",
        address: "Victoria Memorial Hall, 1, Queens Way, Kolkata",
        rating: 4.8,
        placeId: "ChIJa8K-gqp3AjoRr8gDZ9YR0tg",
        coordinates: { lat: 22.5448, lng: 88.3426 }
      },
      {
        userId: user.id,
        name: "Park Street",
        type: "area",
        city: "Kolkata",
        address: "Park Street, Kolkata",
        rating: 4.5,
        placeId: "ChIJg9x5Tc12AjoRuMPZcyL5J5I",
        coordinates: { lat: 22.5566, lng: 88.3513 }
      }
    ];

    for (const place of savedPlaces) {
      await storage.createSavedPlace(place);
      console.log("Created saved place:", place.name);
    }
    
    // Create friendship
    const friendship = await storage.sendFriendRequest({
      userId: friendUser.id,
      friendId: user.id,
      status: 'accepted'
    });

    console.log("Created friendship:", friendship);
    
    // Create follow relationship
    const followerRelation = await storage.followUser({
      followerId: user.id,
      followingId: friendUser.id
    });

    console.log("Created follower relationship:", followerRelation);
    
    // Create sample posts for demo user
    const userPosts = [
      {
        userId: user.id,
        content: "Enjoying the beautiful sunrise at Victoria Memorial! Perfect way to start my Kolkata trip. #Travel #Kolkata #India",
        mediaUrl: "https://images.unsplash.com/photo-1588416499018-d8c621dad6a0?w=800&auto=format&fit=crop",
        mediaType: "image",
        location: "Victoria Memorial, Kolkata",
        placeId: "ChIJa8K-gqp3AjoRr8gDZ9YR0tg",
        placeDetails: {
          name: "Victoria Memorial",
          address: "Victoria Memorial Hall, 1, Queens Way, Kolkata",
          city: "Kolkata",
          type: "attraction"
        },
        likes: 15
      },
      {
        userId: user.id,
        content: "The street food here is incredible! Loving the puchkas (pani puri) at this famous street stall in Park Street. #FoodLover #KolkataFood",
        mediaUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop",
        mediaType: "image",
        location: "Park Street, Kolkata",
        placeId: "ChIJg9x5Tc12AjoRuMPZcyL5J5I",
        placeDetails: {
          name: "Park Street",
          address: "Park Street, Kolkata",
          city: "Kolkata",
          type: "area"
        },
        likes: 24
      }
    ];

    for (const post of userPosts) {
      const createdPost = await storage.createPost(post);
      console.log("Created post:", createdPost.id);
    }
    
    // Create sample posts for friend user
    const friendPosts = [
      {
        userId: friendUser.id,
        content: "Visiting the majestic Howrah Bridge! One of the busiest bridges in the world and a symbol of Kolkata. #Engineering #TravelIndia",
        mediaUrl: "https://images.unsplash.com/photo-1614850715776-f4b77550f632?w=800&auto=format&fit=crop",
        mediaType: "image",
        location: "Howrah Bridge, Kolkata",
        placeId: "ChIJPT_y1MV3AjoR7G8tQMQQcE0",
        placeDetails: {
          name: "Howrah Bridge",
          address: "Howrah Bridge, Kolkata",
          city: "Kolkata",
          type: "attraction"
        },
        likes: 32
      }
    ];

    for (const post of friendPosts) {
      const createdPost = await storage.createPost(post);
      console.log("Created post:", createdPost.id);

      // Add a comment to this post from the main user
      await storage.createComment({
        userId: user.id,
        postId: createdPost.id,
        content: "Amazing view! I'm planning to visit there tomorrow."
      });
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}