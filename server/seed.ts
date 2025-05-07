import { IStorage } from "./storage";
import { User } from "../shared/schema";
// Define profile data for 20 users
const userProfiles = [
  {
    username: "demo",
    password: "demo",
    displayName: "Rahul Singh",
    email: "rahul.singh@example.com"
  },
  {
    username: "priya_sharma",
    password: "password",
    displayName: "Priya Sharma",
    email: "priya.sharma@example.com"
  },
  {
    username: "aditya_patel",
    password: "password",
    displayName: "Aditya Patel",
    email: "aditya.patel@example.com"
  },
  {
    username: "neha_gupta",
    password: "password",
    displayName: "Neha Gupta",
    email: "neha.gupta@example.com"
  },
  {
    username: "vikram_singh",
    password: "password",
    displayName: "Vikram Singh",
    email: "vikram.singh@example.com"
  },
  {
    username: "ananya_das",
    password: "password",
    displayName: "Ananya Das",
    email: "ananya.das@example.com"
  },
  {
    username: "rohan_sharma",
    password: "password",
    displayName: "Rohan Sharma",
    email: "rohan.sharma@example.com"
  },
  {
    username: "kavita_nair",
    password: "password",
    displayName: "Kavita Nair",
    email: "kavita.nair@example.com"
  },
  {
    username: "sameer_joshi",
    password: "password",
    displayName: "Sameer Joshi",
    email: "sameer.joshi@example.com"
  },
  {
    username: "meera_reddy",
    password: "password",
    displayName: "Meera Reddy",
    email: "meera.reddy@example.com"
  },
  {
    username: "arjun_krishnan",
    password: "password",
    displayName: "Arjun Krishnan",
    email: "arjun.krishnan@example.com"
  },
  {
    username: "tanvi_mehta",
    password: "password",
    displayName: "Tanvi Mehta",
    email: "tanvi.mehta@example.com"
  },
  {
    username: "siddharth_kapoor",
    password: "password",
    displayName: "Siddharth Kapoor",
    email: "siddharth.kapoor@example.com"
  },
  {
    username: "nisha_verma",
    password: "password",
    displayName: "Nisha Verma",
    email: "nisha.verma@example.com"
  },
  {
    username: "rajiv_malhotra",
    password: "password",
    displayName: "Rajiv Malhotra",
    email: "rajiv.malhotra@example.com"
  },
  {
    username: "deepika_sharma",
    password: "password",
    displayName: "Deepika Sharma",
    email: "deepika.sharma@example.com"
  },
  {
    username: "karan_murthy",
    password: "password",
    displayName: "Karan Murthy",
    email: "karan.murthy@example.com"
  },
  {
    username: "pooja_hegde",
    password: "password",
    displayName: "Pooja Hegde",
    email: "pooja.hegde@example.com"
  },
  {
    username: "vishal_singh",
    password: "password",
    displayName: "Vishal Singh",
    email: "vishal.singh@example.com"
  },
  {
    username: "jaya_iyer",
    password: "password",
    displayName: "Jaya Iyer",
    email: "jaya.iyer@example.com"
  }
];

// Travel locations in India with corresponding images
const travelLocations = [
  {
    name: "Victoria Memorial",
    city: "Kolkata",
    type: "attraction",
    address: "Victoria Memorial Hall, 1, Queens Way, Kolkata",
    placeId: "ChIJa8K-gqp3AjoRr8gDZ9YR0tg",
    coordinates: { lat: 22.5448, lng: 88.3426 },
    image: "https://images.unsplash.com/photo-1588416499018-d8c621dad6a0?w=800&auto=format&fit=crop"
  },
  {
    name: "Park Street",
    city: "Kolkata",
    type: "area",
    address: "Park Street, Kolkata",
    placeId: "ChIJg9x5Tc12AjoRuMPZcyL5J5I",
    coordinates: { lat: 22.5566, lng: 88.3513 },
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop"
  },
  {
    name: "Howrah Bridge",
    city: "Kolkata",
    type: "attraction",
    address: "Howrah Bridge, Kolkata",
    placeId: "ChIJPT_y1MV3AjoR7G8tQMQQcE0",
    coordinates: { lat: 22.5855, lng: 88.3476 },
    image: "https://images.unsplash.com/photo-1614850715776-f4b77550f632?w=800&auto=format&fit=crop"
  },
  {
    name: "Taj Mahal",
    city: "Agra",
    type: "attraction",
    address: "Taj Mahal, Agra",
    placeId: "ChIJbf9s9QFxdDkR7gGRZZe5wbQ",
    coordinates: { lat: 27.1751, lng: 78.0421 },
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop"
  },
  {
    name: "Gateway of India",
    city: "Mumbai",
    type: "attraction",
    address: "Gateway of India, Mumbai",
    placeId: "ChIJiUcVa9HOWTkR_IoBYtDJlmU",
    coordinates: { lat: 18.9220, lng: 72.8347 },
    image: "https://images.unsplash.com/photo-1548034364-3c4f631bce4e?w=800&auto=format&fit=crop"
  },
  {
    name: "Hawa Mahal",
    city: "Jaipur",
    type: "attraction",
    address: "Hawa Mahal, Jaipur",
    placeId: "ChIJ7RuqQPu2bTkRxVhxVzjRRN8",
    coordinates: { lat: 26.9239, lng: 75.8267 },
    image: "https://images.unsplash.com/photo-1598874399428-b7d40fe3c3a0?w=800&auto=format&fit=crop"
  },
  {
    name: "Amber Fort",
    city: "Jaipur",
    type: "attraction",
    address: "Amber Fort, Jaipur",
    placeId: "ChIJ6zNrJaK3bTkR_u7LH1v-Qhs",
    coordinates: { lat: 26.9855, lng: 75.8513 },
    image: "https://images.unsplash.com/photo-1570458436416-b57dadf7f228?w=800&auto=format&fit=crop"
  },
  {
    name: "Marine Drive",
    city: "Mumbai",
    type: "area",
    address: "Marine Drive, Mumbai",
    placeId: "ChIJjW4Xu9zO5zsRWEjmJ3_K7xc",
    coordinates: { lat: 18.9548, lng: 72.8224 },
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop"
  },
  {
    name: "Golden Temple",
    city: "Amritsar",
    type: "attraction",
    address: "Golden Temple, Amritsar",
    placeId: "ChIJBYnvaMe4GTkRCzJfvpI8uZs",
    coordinates: { lat: 31.6200, lng: 74.8765 },
    image: "https://images.unsplash.com/photo-1598874432165-cb0abd58944f?w=800&auto=format&fit=crop"
  },
  {
    name: "Dal Lake",
    city: "Srinagar",
    type: "attraction",
    address: "Dal Lake, Srinagar",
    placeId: "ChIJtbjH9uBl4TgRikw4yVg3YF0",
    coordinates: { lat: 34.0836, lng: 74.8364 },
    image: "https://images.unsplash.com/photo-1566837497312-7be7830ae9b1?w=800&auto=format&fit=crop"
  },
  {
    name: "India Gate",
    city: "Delhi",
    type: "attraction",
    address: "India Gate, Delhi",
    placeId: "ChIJZ4QgaIF2DDkRRXXK_NLM8LM",
    coordinates: { lat: 28.6129, lng: 77.2295 },
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop"
  },
  {
    name: "Mysore Palace",
    city: "Mysore",
    type: "attraction",
    address: "Mysore Palace, Mysore",
    placeId: "ChIJE8K4NFpwrzsRt73IKQ_0Jq8",
    coordinates: { lat: 12.3052, lng: 76.6552 },
    image: "https://images.unsplash.com/photo-1590766117110-9bdf8e21ab47?w=800&auto=format&fit=crop"
  },
  {
    name: "Mehrangarh Fort",
    city: "Jodhpur",
    type: "attraction",
    address: "Mehrangarh Fort, Jodhpur",
    placeId: "ChIJKYrCf8TRQTkRzIEgwq8JnOw",
    coordinates: { lat: 26.2985, lng: 73.0187 },
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop"
  },
  {
    name: "Varkala Beach",
    city: "Kerala",
    type: "attraction",
    address: "Varkala Beach, Kerala",
    placeId: "ChIJQWfKL9hCCDsRNdVhUfPmgZY",
    coordinates: { lat: 8.7370, lng: 76.7066 },
    image: "https://images.unsplash.com/photo-1592461876281-ec9da03fa125?w=800&auto=format&fit=crop"
  },
  {
    name: "Lotus Temple",
    city: "Delhi",
    type: "attraction",
    address: "Lotus Temple, Delhi",
    placeId: "ChIJTfHbNZLiDDkRXlqU3B_GZb8",
    coordinates: { lat: 28.5535, lng: 77.2588 },
    image: "https://images.unsplash.com/photo-1610105888791-f995d5c97f7d?w=800&auto=format&fit=crop"
  },
  {
    name: "Udaipur City Palace",
    city: "Udaipur",
    type: "attraction",
    address: "City Palace, Udaipur",
    placeId: "ChIJa8AgoVq_ZzkR9jt5EZFvZrw",
    coordinates: { lat: 24.5766, lng: 73.6845 },
    image: "https://images.unsplash.com/photo-1602315726596-5cabdef4e074?w=800&auto=format&fit=crop"
  },
  {
    name: "Varanasi Ghats",
    city: "Varanasi",
    type: "attraction",
    address: "Dashashwamedh Ghat, Varanasi",
    placeId: "ChIJA2yxAFUxjDkRuBFatj2xNw0",
    coordinates: { lat: 25.3086, lng: 83.0105 },
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&auto=format&fit=crop"
  },
  {
    name: "Humayun's Tomb",
    city: "Delhi",
    type: "attraction",
    address: "Humayun's Tomb, Delhi",
    placeId: "ChIJfyH9KDH9DDkRGJf-PGZSmjQ",
    coordinates: { lat: 28.5933, lng: 77.2507 },
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop"
  },
  {
    name: "Ellora Caves",
    city: "Aurangabad",
    type: "attraction",
    address: "Ellora Caves, Aurangabad",
    placeId: "ChIJ-6gmZB_M3TsRRwO0KQBnIb4",
    coordinates: { lat: 20.0258, lng: 75.1777 },
    image: "https://images.unsplash.com/photo-1607531279138-3baf0a1ddc84?w=800&auto=format&fit=crop"
  },
  {
    name: "Darjeeling",
    city: "West Bengal",
    type: "city",
    address: "Darjeeling, West Bengal",
    placeId: "ChIJv4vJs2Zm5DkRFYdgB4KCAF4",
    coordinates: { lat: 27.0380, lng: 88.2627 },
    image: "https://images.unsplash.com/photo-1544666597-9a25e9c2ebbc?w=800&auto=format&fit=crop"
  }
];

// Post content options for variation
const postContents = [
  "Exploring the beautiful {place} in {city}! What an amazing experience. 🌟 #Travel #India",
  "Just visited {place} in {city}. Simply breathtaking! ✨ #TravelIndia #Wanderlust",
  "The view from {place} in {city} is absolutely stunning! Can't get enough of this place. 😍 #TravelDiaries",
  "Taking in the sights at {place}, {city}. One of the most beautiful spots in India! #Traveling #IndianTourism",
  "Day trip to {place} in {city}. The architecture is incredible! #IndiaTourism #Travel",
  "Morning vibes at {place}, {city}. Perfect weather for sightseeing! ☀️ #Traveling #ExploreIndia",
  "Finally checked {place} off my bucket list! {city} has so much to offer. #TravelGoals #IndiaTravel",
  "Sunset at {place} in {city}. Words can't describe how magical this moment was. 🌅 #TravelPhotography",
  "Road trip to {place}, {city}. The journey was as beautiful as the destination! #RoadTrip #TravelIndia",
  "Weekend getaway to {place} in {city}. Much needed break from the routine! #WeekendVibes #TravelDiaries"
];

// Comment content for interactions
const commentContents = [
  "Beautiful photo! I've always wanted to visit {place}.",
  "The view looks amazing! How was your experience?",
  "This is now on my travel list! Thanks for sharing!",
  "Absolutely gorgeous! How long did you stay in {city}?",
  "The architecture is stunning! Great capture!",
  "I was there last month! Such an incredible place.",
  "Your photos always give me travel inspiration!",
  "This looks even better than the pictures online!",
  "Did you try the local food in {city}? Any recommendations?",
  "Perfect shot! What camera/phone are you using?",
  "The colors in this photo are incredible!",
  "This makes me want to book a ticket right now!",
  "How crowded was it when you visited?",
  "One of my favorite places in India!",
  "I've heard so much about {place}, now I really need to go.",
  "Your travel feed is giving me serious wanderlust!",
  "The light in this photo is just perfect!",
  "Was it easy to get around in {city}?",
  "This view alone is worth the trip!",
  "Adding this to my bucket list right now!"
];

// Custom SVG images for the feed
const svgImages = [
  "/images/taj-mahal.svg",
  "/images/gateway-of-india.svg",
  "/images/golden-temple.svg",
  "/images/india-gate.svg",
  "/images/lotus-temple.svg",
  "/images/hawa-mahal.svg",
  "/images/mysore-palace.svg"
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

import fs from 'fs';
import path from 'path';

export async function seedDatabase(storage: IStorage) {
  try {
    // Check for force reseed flag
    const forceReseedFlag = path.join(process.cwd(), 'server', '.reseed_force');
    const forceReseed = fs.existsSync(forceReseedFlag);
    
    // Check if we already have users to avoid duplicate seeding
    const existingUser = await storage.getUserByUsername("demo");
    if (existingUser && !forceReseed) {
      console.log("Database already seeded, skipping...");
      return;
    }
    
    // If we're forcing a reseed, clean up the flag after using it
    if (forceReseed) {
      console.log("Force reseeding enabled...");
      try {
        fs.unlinkSync(forceReseedFlag);
      } catch (err) {
        // Ignore errors on cleanup
      }
    }

    console.log("Starting database seeding...");
    
    // Create all users
    const createdUsers: User[] = [];
    for (const profile of userProfiles) {
      const user = await storage.createUser({
        ...profile,
        preferences: { 
          notifications: Math.random() > 0.5, 
          darkMode: Math.random() > 0.5, 
          language: "English" 
        }
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.displayName}`);
    }

    // Sample main user for reference
    const mainUser = createdUsers[0];
    
    // Create follow relationships (each user follows between 5-15 random other users)
    for (const follower of createdUsers) {
      // Determine how many users this person will follow
      const followCount = getRandomNumber(5, 15);
      
      // Get a filtered list of potential users to follow (excluding self)
      const potentialFollows = createdUsers.filter(u => u.id !== follower.id);
      
      // Select random users to follow
      const usersToFollow = getRandomArrayItems(potentialFollows, followCount);
      
      // Create the follow relationships
      for (const userToFollow of usersToFollow) {
        await storage.followUser({
          followerId: follower.id,
          followingId: userToFollow.id
        });
      }
      
      console.log(`Created ${followCount} follows for user: ${follower.displayName}`);
    }
    
    // Ensure the main user has some friendships
    for (let i = 1; i <= 10; i++) {
      const friendUser = createdUsers[i];
      await storage.sendFriendRequest({
        userId: friendUser.id,
        friendId: mainUser.id,
        status: 'accepted'
      });
      console.log(`Created friendship between ${mainUser.displayName} and ${friendUser.displayName}`);
    }

    // Create sample conversation for main user
    const conversation = await storage.createConversation({
      userId: mainUser.id
    });

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

    // Create sample itinerary for main user
    const itinerary = await storage.createItinerary({
      userId: mainUser.id,
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

    console.log("Created itinerary for main user");

    // Save some places for main user
    const savedPlaces = [
      {
        userId: mainUser.id,
        name: "Victoria Memorial",
        type: "attraction",
        city: "Kolkata",
        address: "Victoria Memorial Hall, 1, Queens Way, Kolkata",
        rating: 5,
        placeId: "ChIJa8K-gqp3AjoRr8gDZ9YR0tg",
        coordinates: { lat: 22.5448, lng: 88.3426 }
      },
      {
        userId: mainUser.id,
        name: "Park Street",
        type: "area",
        city: "Kolkata",
        address: "Park Street, Kolkata",
        rating: 4,
        placeId: "ChIJg9x5Tc12AjoRuMPZcyL5J5I",
        coordinates: { lat: 22.5566, lng: 88.3513 }
      }
    ];

    for (const place of savedPlaces) {
      await storage.createSavedPlace(place);
    }

    // Using our SVG images for premium quality and faster loading
    
    // Create posts for all users (3-5 posts per user)
    for (const user of createdUsers) {
      // Determine number of posts for this user
      const postCount = getRandomNumber(4, 8);
      
      for (let i = 0; i < postCount; i++) {
        // Randomly select a location
        const location = getRandomItem(travelLocations);
        
        // Create content with placeholders replaced
        const content = getRandomItem(postContents)
          .replace('{place}', location.name)
          .replace('{city}', location.city);
        
        // Use a mix of external images and our local SVGs
        // Local SVGs provide faster loading and consistent styling
        const useLocalSvg = Math.random() > 0.6;
        const mediaUrl = useLocalSvg ? getRandomItem(svgImages) : location.image;
        
        // Create the post
        const post = await storage.createPost({
          userId: user.id,
          content,
          mediaUrl,
          mediaType: "image",
          location: `${location.name}, ${location.city}`,
          placeId: location.placeId,
          placeDetails: {
            name: location.name,
            address: location.address,
            city: location.city,
            type: location.type
          }
        });
        
        // Update the post to add likes (since likes isn't part of the insert schema)
        await storage.likePost(post.id);
        
        // Add 3-8 comments to each post
        const commentCount = getRandomNumber(3, 8);
        for (let j = 0; j < commentCount; j++) {
          // Select a random user to comment (not the post owner)
          let commenter;
          do {
            commenter = getRandomItem(createdUsers);
          } while (commenter.id === user.id);
          
          // Create comment with placeholders replaced
          const commentText = getRandomItem(commentContents)
            .replace('{place}', location.name)
            .replace('{city}', location.city);
          
          await storage.createComment({
            userId: commenter.id,
            postId: post.id,
            content: commentText
          });
        }
      }
      
      console.log(`Created ${postCount} posts with comments for user: ${user.displayName}`);
    }

    console.log("Database seeded with 20 users, posts, and follows!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}