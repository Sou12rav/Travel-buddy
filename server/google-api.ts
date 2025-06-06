import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.warn('Google API key not provided. Google API features will be disabled.');
}

// Google Places API integration
export async function searchPlaces(query: string, location?: { lat: number; lng: number }) {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API key not configured');
  }

  try {
    const locationParam = location ? `location=${location.lat},${location.lng}&radius=50000&` : '';
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&${locationParam}key=${GOOGLE_API_KEY}`
    );

    return response.data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating || 0,
      priceLevel: place.price_level,
      photos: place.photos ? place.photos.map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
      ) : [],
      types: place.types,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      openNow: place.opening_hours?.open_now
    }));
  } catch (error) {
    console.error('Google Places API error:', error);
    throw new Error('Failed to search places');
  }
}

// Get place details by place ID
export async function getPlaceDetails(placeId: string) {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API key not configured');
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,reviews,photos,geometry&key=${GOOGLE_API_KEY}`
    );

    const place = response.data.result;
    return {
      id: placeId,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      openingHours: place.opening_hours?.weekday_text || [],
      reviews: place.reviews ? place.reviews.slice(0, 5).map((review: any) => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time
      })) : [],
      photos: place.photos ? place.photos.slice(0, 5).map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
      ) : []
    };
  } catch (error) {
    console.error('Google Place Details API error:', error);
    throw new Error('Failed to get place details');
  }
}

// Geocoding: Get coordinates from address
export async function geocodeAddress(address: string) {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API key not configured');
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
    );

    if (response.data.results.length === 0) {
      throw new Error('Address not found');
    }

    const result = response.data.results[0];
    return {
      address: result.formatted_address,
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      },
      components: result.address_components
    };
  } catch (error) {
    console.error('Geocoding API error:', error);
    throw new Error('Failed to geocode address');
  }
}

// Reverse geocoding: Get address from coordinates
export async function reverseGeocode(lat: number, lng: number) {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API key not configured');
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );

    if (response.data.results.length === 0) {
      throw new Error('Location not found');
    }

    const result = response.data.results[0];
    return {
      address: result.formatted_address,
      coordinates: { lat, lng },
      components: result.address_components
    };
  } catch (error) {
    console.error('Reverse geocoding API error:', error);
    throw new Error('Failed to reverse geocode');
  }
}

// Get nearby places of a specific type
export async function getNearbyPlaces(lat: number, lng: number, type: string, radius = 5000) {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API key not configured');
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`
    );

    return response.data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 0,
      priceLevel: place.price_level,
      types: place.types,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      openNow: place.opening_hours?.open_now,
      photos: place.photos ? place.photos.slice(0, 1).map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
      ) : []
    }));
  } catch (error) {
    console.error('Nearby places API error:', error);
    throw new Error('Failed to get nearby places');
  }
}

// Get travel distance and time between two points
export async function getDirections(origin: string, destination: string, mode = 'driving') {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API key not configured');
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${GOOGLE_API_KEY}`
    );

    if (response.data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    return {
      distance: leg.distance.text,
      duration: leg.duration.text,
      steps: leg.steps.map((step: any) => ({
        instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
        distance: step.distance.text,
        duration: step.duration.text
      }))
    };
  } catch (error) {
    console.error('Directions API error:', error);
    throw new Error('Failed to get directions');
  }
}

// Enhanced weather using location data
export async function getWeatherByCoordinates(lat: number, lng: number) {
  // For now, we'll use the existing weather data but enhance it with location context
  // In a production app, you might integrate with OpenWeatherMap or similar
  try {
    const locationData = await reverseGeocode(lat, lng);
    
    // Extract city from address components
    const cityComponent = locationData.components.find(
      (component: any) => component.types.includes('locality') || component.types.includes('administrative_area_level_2')
    );
    
    const city = cityComponent?.long_name || 'Unknown';
    
    return {
      city,
      coordinates: { lat, lng },
      // Here you would integrate with a weather API
      // For now, returning enhanced mock data
      temperature: Math.round(20 + Math.random() * 20), // Random temp between 20-40
      condition: 'Partly Cloudy',
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 20)
    };
  } catch (error) {
    console.error('Weather by coordinates error:', error);
    throw new Error('Failed to get weather data');
  }
}