import { useApp } from "../lib/api_context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Info, Clock, Calendar, Wind } from "lucide-react";
import { useEffect, useState } from "react";

// City information object with detailed facts
const CITY_DETAILS: { [key: string]: {
  fullName: string;
  welcomeMessage: string;
  population: string;
  famousFor: string[];
  bestTimeToVisit: string;
  language: string;
  description: string;
  timezone: string;
  interestingFact: string;
}} = {
  "Kolkata": {
    fullName: "Kolkata (Calcutta)",
    welcomeMessage: "Welcome to the City of Joy!",
    population: "14.9 million",
    famousFor: ["Durga Puja", "Victoria Memorial", "Howrah Bridge", "Bengali Cuisine"],
    bestTimeToVisit: "October to March",
    language: "Bengali",
    description: "Kolkata, the cultural capital of India, is known for its literary, artistic and revolutionary heritage. It's home to Mother House, the headquarters of the Missionaries of Charity, founded by Mother Teresa.",
    timezone: "GMT +5:30",
    interestingFact: "Kolkata has the oldest operating port in India, established in 1870."
  },
  "Mumbai": {
    fullName: "Mumbai (Bombay)",
    welcomeMessage: "Welcome to the City of Dreams!",
    population: "20.4 million",
    famousFor: ["Bollywood", "Gateway of India", "Marine Drive", "Vada Pav"],
    bestTimeToVisit: "November to February",
    language: "Marathi",
    description: "Mumbai, the financial capital of India, is a vibrant metropolis that never sleeps. It's home to Bollywood, India's film industry, and has a beautiful coastline along the Arabian Sea.",
    timezone: "GMT +5:30",
    interestingFact: "Mumbai's Dabbawalas deliver approximately 200,000 lunch boxes every day with an accuracy rate of 99.999%."
  },
  "Delhi": {
    fullName: "Delhi (New Delhi)",
    welcomeMessage: "Welcome to the Heart of India!",
    population: "30.3 million",
    famousFor: ["Red Fort", "India Gate", "Qutub Minar", "Street Food"],
    bestTimeToVisit: "October to March",
    language: "Hindi",
    description: "Delhi, India's capital territory, is a massive metropolitan area with a rich history. It's home to numerous historical monuments and is a melting pot of diverse cultures.",
    timezone: "GMT +5:30",
    interestingFact: "Delhi has been continuously inhabited since the 6th century BCE and has been the capital of various empires."
  },
  "Chennai": {
    fullName: "Chennai (Madras)",
    welcomeMessage: "Welcome to the Gateway of South India!",
    population: "10.7 million",
    famousFor: ["Marina Beach", "Kapaleeshwarar Temple", "Carnatic Music", "Filter Coffee"],
    bestTimeToVisit: "November to February",
    language: "Tamil",
    description: "Chennai, on the Bay of Bengal, is a major cultural and economic center in South India. It's known for its classical music, dance performances and rich Tamil culture.",
    timezone: "GMT +5:30",
    interestingFact: "Chennai is home to one of the longest urban beaches in the world, Marina Beach, stretching 13 km."
  },
  "Bangalore": {
    fullName: "Bangalore (Bengaluru)",
    welcomeMessage: "Welcome to the Silicon Valley of India!",
    population: "12.3 million",
    famousFor: ["Tech Companies", "Cubbon Park", "Lalbagh Botanical Garden", "Dosa"],
    bestTimeToVisit: "Year-round, best from September to February",
    language: "Kannada",
    description: "Bangalore is the center of India's high-tech industry with pleasant climate throughout the year. It's known for its vibrant nightlife, parks and modern lifestyle.",
    timezone: "GMT +5:30",
    interestingFact: "Bangalore has over 1,000 startups, making it the second fastest-growing startup ecosystem in the world after Silicon Valley."
  },
  "Hyderabad": {
    fullName: "Hyderabad",
    welcomeMessage: "Welcome to the City of Pearls!",
    population: "10 million",
    famousFor: ["Charminar", "Biryani", "Golconda Fort", "Pearls Market"],
    bestTimeToVisit: "October to February",
    language: "Telugu, Urdu",
    description: "Hyderabad blends old-world charm with modern development. It's famous for its rich history, architecture, and the delicious Hyderabadi cuisine, especially the biryani.",
    timezone: "GMT +5:30",
    interestingFact: "The iconic Charminar was built in 1591 and is said to have been constructed to commemorate the eradication of plague from the city."
  },
  "Jaipur": {
    fullName: "Jaipur",
    welcomeMessage: "Welcome to the Pink City!",
    population: "3.1 million",
    famousFor: ["Hawa Mahal", "Amber Fort", "City Palace", "Traditional Handicrafts"],
    bestTimeToVisit: "October to March",
    language: "Hindi, Rajasthani",
    description: "Jaipur is known for its stunning pink-hued buildings and rich royal heritage. Part of the Golden Triangle tourist circuit, it's a gateway to Rajasthan's magnificent past.",
    timezone: "GMT +5:30",
    interestingFact: "Jaipur was painted pink in 1876 to welcome the Prince of Wales (later King Edward VII), as pink was considered the color of hospitality."
  },
  "Goa": {
    fullName: "Goa",
    welcomeMessage: "Welcome to the Beach Paradise!",
    population: "1.5 million",
    famousFor: ["Beaches", "Portuguese Architecture", "Seafood", "Nightlife"],
    bestTimeToVisit: "November to February",
    language: "Konkani, Marathi",
    description: "Goa, a coastal paradise on the Arabian Sea, is known for its pristine beaches, vibrant nightlife, and Portuguese influence seen in its architecture and cuisine.",
    timezone: "GMT +5:30",
    interestingFact: "Goa was a Portuguese colony for about 450 years until 1961, making it the longest-held colonial possession in the world."
  },
  "Kochi": {
    fullName: "Kochi (Cochin)",
    welcomeMessage: "Welcome to the Queen of the Arabian Sea!",
    population: "2.1 million",
    famousFor: ["Chinese Fishing Nets", "Fort Kochi", "Backwaters", "Spice Markets"],
    bestTimeToVisit: "October to March",
    language: "Malayalam",
    description: "Kochi is a major port city known for its rich history of international trade. It showcases a blend of cultures including Arab, Chinese, Dutch, Portuguese, and British influences.",
    timezone: "GMT +5:30",
    interestingFact: "Kochi's Chinese fishing nets, introduced by traders from the court of Kublai Khan in the 14th century, are still in use today."
  },
  "Varanasi": {
    fullName: "Varanasi (Banaras)",
    welcomeMessage: "Welcome to the Spiritual Capital of India!",
    population: "1.2 million",
    famousFor: ["Ghats", "Ganga Aarti", "Temples", "Banarasi Silk"],
    bestTimeToVisit: "October to March",
    language: "Hindi",
    description: "Varanasi, one of the world's oldest continuously inhabited cities, is a major religious hub for Hinduism. The sacred Ganges River forms the eastern boundary of this ancient city.",
    timezone: "GMT +5:30",
    interestingFact: "Varanasi is believed to be over 3,000 years old and is one of the oldest continuously inhabited cities in the world."
  }
};

export function CityDetails() {
  const { currentCity } = useApp();
  const cityInfo = CITY_DETAILS[currentCity] || CITY_DETAILS["Kolkata"]; // Fallback to Kolkata if no info

  return (
    <section className="px-4 py-3">
      <Card className="overflow-hidden bg-card dark:bg-card">
        <CardHeader className="bg-primary/5 dark:bg-primary/10 p-4">
          <CardTitle className="flex items-center text-xl">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            {cityInfo.fullName}
          </CardTitle>
          <CardDescription className="font-medium text-lg text-primary">
            {cityInfo.welcomeMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start">
              <Users className="mt-1 h-4 w-4 text-muted-foreground mr-2" />
              <div>
                <h4 className="text-sm font-medium">Population</h4>
                <p className="text-sm text-muted-foreground">{cityInfo.population}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="mt-1 h-4 w-4 text-muted-foreground mr-2" />
              <div>
                <h4 className="text-sm font-medium">Timezone</h4>
                <p className="text-sm text-muted-foreground">{cityInfo.timezone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="mt-1 h-4 w-4 text-muted-foreground mr-2" />
              <div>
                <h4 className="text-sm font-medium">Best Time to Visit</h4>
                <p className="text-sm text-muted-foreground">{cityInfo.bestTimeToVisit}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Info className="mt-1 h-4 w-4 text-muted-foreground mr-2" />
              <div>
                <h4 className="text-sm font-medium">Language</h4>
                <p className="text-sm text-muted-foreground">{cityInfo.language}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">About {currentCity}</h4>
            <p className="text-sm text-muted-foreground">{cityInfo.description}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Famous For</h4>
            <div className="flex flex-wrap gap-2">
              {cityInfo.famousFor.map((item, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-accent/10 text-accent-foreground dark:bg-accent/20 text-xs rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-muted/50 dark:bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium flex items-center">
              <Wind className="mr-2 h-4 w-4" />
              Did you know?
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{cityInfo.interestingFact}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}