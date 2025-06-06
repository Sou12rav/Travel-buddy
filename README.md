# AI-Powered Travel Companion for India

An intelligent travel companion web application designed for Indian travelers, offering personalized travel experiences with comprehensive technological integrations and social features.

## Features

### Travel Services
- **Real-time Weather Data** - Current conditions for major Indian cities
- **Destination Discovery** - Authentic place information via Google Places and Foursquare APIs
- **AI Chat Assistant** - GPT-4 powered travel advice and planning
- **Itinerary Planning** - Detailed trip planning with local insights
- **Social Feed** - Share travel experiences and discover places
- **Cultural Insights** - Local customs and etiquette guidance

### Development Features
- **GitHub Integration** - Automated CI/CD workflows
- **VSCode Optimization** - Pre-configured workspace settings
- **API Documentation** - Comprehensive endpoint documentation
- **Type Safety** - Full TypeScript implementation
- **Real-time Updates** - WebSocket integration for live data

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **APIs**: OpenAI GPT-4, Google Places, Foursquare
- **Authentication**: Passport.js with local strategy
- **Deployment**: Replit with auto-scaling

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- API keys for external services

### Environment Variables
```bash
DATABASE_URL=your_postgresql_url
OPENAI_API_KEY=your_openai_key
GOOGLE_PLACES_API_KEY=your_google_places_key
FOURSQUARE_API_KEY=your_foursquare_key
```

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd travel-companion

# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
npm run db:push      # Push database schema changes
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Travel Data
- `GET /api/weather/:city` - Weather information
- `GET /api/destinations/:city` - Popular destinations
- `GET /api/alerts/:city` - Travel alerts
- `GET /api/google/nearby` - Nearby places via Google Places
- `GET /api/foursquare/nearby` - Nearby places via Foursquare

### Chat & AI
- `POST /api/chat` - Send message to AI assistant
- `GET /api/conversations/:id/messages` - Get conversation history
- `POST /api/conversations` - Create new conversation

### Social Features
- `GET /api/feed/:userId` - User feed
- `POST /api/posts` - Create new post
- `GET /api/users/:userId/followers` - Get user followers
- `POST /api/follow` - Follow user

## VSCode Setup

The project includes pre-configured VSCode settings for optimal development experience:

### Recommended Extensions
- Prettier - Code formatter
- TypeScript - Language support
- Tailwind CSS IntelliSense - CSS autocomplete
- Thunder Client - API testing
- GitLens - Git integration
- ES7+ React snippets - React code snippets

### Workspace Settings
- Auto-format on save
- TypeScript path resolution
- Tailwind CSS support
- ESLint integration

## GitHub Integration

Automated workflows for:
- **Continuous Integration** - Type checking and build validation
- **Code Quality** - Automated PR reviews and status checks
- **Deployment** - Production deployment pipeline

### Setting up GitHub Secrets
Add these secrets to your GitHub repository:
```
OPENAI_API_KEY
GOOGLE_PLACES_API_KEY
FOURSQUARE_API_KEY
```

## Database Schema

The application uses PostgreSQL with the following main entities:
- **Users** - User accounts and profiles
- **Conversations** - Chat conversations
- **Messages** - Chat messages
- **Itineraries** - Travel plans
- **Posts** - Social media posts
- **Saved Places** - User bookmarked locations

## Deployment

### Replit (Current)
The application is configured for Replit deployment with auto-scaling capabilities.

### Alternative Deployments
```bash
# Vercel
npm i -g vercel
vercel

# Netlify
npm run build
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## API Integration Examples

### Google Places Integration
```typescript
const searchPlaces = async (query: string) => {
  const response = await fetch(`/api/google/places/search?query=${query}`);
  return response.json();
};
```

### Chat with AI Assistant
```typescript
const sendMessage = async (message: string, conversationId: number) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationId })
  });
  return response.json();
};
```

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please create a GitHub issue or contact the development team.