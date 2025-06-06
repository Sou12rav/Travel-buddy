import axios from 'axios';

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

if (!FOURSQUARE_API_KEY) {
  console.warn('Foursquare API key not provided. Foursquare API features will be disabled.');
}

// Foursquare Places API integration
export async function searchNearbyPlaces(lat: number, lng: number, category: string, radius = 5000) {
  if (!FOURSQUARE_API_KEY) {
    throw new Error('Foursquare API key not configured');
  }

  // Map category types to Foursquare category IDs
  const categoryMap: { [key: string]: string } = {
    restaurant: '13065',
    tourist_attraction: '16000',
    shopping_mall: '17000',
    lodging: '19014',
    hospital: '15014',
    gas_station: '17119'
  };

  const categoryId = categoryMap[category] || '13065'; // Default to restaurant

  try {
    const response = await axios.get('https://api.foursquare.com/v3/places/nearby', {
      headers: {
        'Authorization': FOURSQUARE_API_KEY,
        'Accept': 'application/json'
      },
      params: {
        ll: `${lat},${lng}`,
        radius: radius,
        categories: categoryId,
        limit: 20,
        fields: 'fsq_id,name,location,rating,price,hours,photos,categories,description,tel,website'
      }
    });

    return response.data.results.map((place: any) => ({
      id: place.fsq_id,
      name: place.name,
      address: place.location.formatted_address || `${place.location.address || ''} ${place.location.locality || ''}`.trim(),
      rating: place.rating ? place.rating / 2 : 0, // Convert from 10-point to 5-point scale
      priceLevel: place.price || 0,
      types: place.categories?.map((cat: any) => cat.name) || [],
      coordinates: {
        lat: place.geocodes?.main?.latitude || lat,
        lng: place.geocodes?.main?.longitude || lng
      },
      openNow: place.hours?.open_now,
      photos: place.photos?.slice(0, 3).map((photo: any) => 
        `${photo.prefix}400x300${photo.suffix}`
      ) || [],
      description: place.description || '',
      phoneNumber: place.tel || '',
      website: place.website || ''
    }));
  } catch (error: any) {
    console.error('Foursquare API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch nearby places');
  }
}

// Get place details with reviews
export async function getPlaceDetails(placeId: string) {
  if (!FOURSQUARE_API_KEY) {
    throw new Error('Foursquare API key not configured');
  }

  try {
    const [placeResponse, photosResponse] = await Promise.all([
      axios.get(`https://api.foursquare.com/v3/places/${placeId}`, {
        headers: {
          'Authorization': FOURSQUARE_API_KEY,
          'Accept': 'application/json'
        },
        params: {
          fields: 'fsq_id,name,location,rating,price,hours,photos,categories,description,tel,website,tastes,features'
        }
      }),
      axios.get(`https://api.foursquare.com/v3/places/${placeId}/photos`, {
        headers: {
          'Authorization': FOURSQUARE_API_KEY,
          'Accept': 'application/json'
        },
        params: {
          limit: 10
        }
      }).catch(() => ({ data: [] })) // Handle if photos endpoint fails
    ]);

    const place = placeResponse.data;
    const photos = photosResponse.data;

    return {
      id: place.fsq_id,
      name: place.name,
      address: place.location.formatted_address,
      rating: place.rating ? place.rating / 2 : 0,
      priceLevel: place.price || 0,
      types: place.categories?.map((cat: any) => cat.name) || [],
      coordinates: {
        lat: place.geocodes?.main?.latitude,
        lng: place.geocodes?.main?.longitude
      },
      openNow: place.hours?.open_now,
      hours: place.hours?.display || '',
      photos: photos.map?.((photo: any) => 
        `${photo.prefix}800x600${photo.suffix}`
      ) || [],
      description: place.description || '',
      phoneNumber: place.tel || '',
      website: place.website || '',
      features: place.features || {},
      tastes: place.tastes || []
    };
  } catch (error: any) {
    console.error('Foursquare place details error:', error.response?.data || error.message);
    throw new Error('Failed to get place details');
  }
}

// Get weather data using OpenWeatherMap
export async function getWeatherData(lat: number, lng: number) {
  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
  
  if (!OPENWEATHER_API_KEY) {
    throw new Error('OpenWeatherMap API key not configured');
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const data = response.data;
    
    return {
      city: data.name,
      coordinates: { lat, lng },
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      pressure: data.main.pressure,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : null,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
    };
  } catch (error: any) {
    console.error('OpenWeatherMap API error:', error.response?.data || error.message);
    throw new Error('Failed to get weather data');
  }
}