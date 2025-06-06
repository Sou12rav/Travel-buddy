# AI-Powered Travel Companion

An Instagram-style explore application for Indian travelers with authentic nearby places, weather data, and social features.

## Features

- 🌍 **Location-based Explore**: Instagram-style feed of nearby restaurants, attractions, hotels, and more
- 🌤️ **Real-time Weather**: Current weather conditions using OpenWeatherMap API
- 📍 **Authentic Places**: Real venue data with ratings, photos, and reviews from Foursquare API
- 🗺️ **Interactive Maps**: Get directions to any location
- 👥 **Social Platform**: Share travel experiences and follow other travelers
- 🤖 **AI Chat**: Travel assistance powered by OpenAI

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **APIs**: Foursquare Places, OpenWeatherMap, OpenAI

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- API Keys (see Environment Variables section)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd travel-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   
   **Option A: Local PostgreSQL**
   ```bash
   # Install PostgreSQL (Ubuntu/Debian)
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # Start PostgreSQL service
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE travel_app;
   CREATE USER travel_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE travel_app TO travel_user;
   \q
   ```
   
   **Option B: Cloud PostgreSQL (Recommended)**
   - Use services like Neon, Supabase, or Railway
   - Get your connection string

4. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys and database credentials:
   ```env
   # Database
   DATABASE_URL=postgresql://travel_user:your_password@localhost:5432/travel_app
   
   # API Keys
   FOURSQUARE_API_KEY=your_foursquare_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

## Getting API Keys

### 1. Foursquare Places API (Required for nearby places)
- Visit: https://developer.foursquare.com/
- Sign up for free account
- Create new app
- Copy your API key
- Free tier: 100,000 requests/month

### 2. OpenWeatherMap API (Required for weather)
- Visit: https://openweathermap.org/api
- Sign up for free account
- Generate API key
- Free tier: 1,000 calls/day

### 3. OpenAI API (Optional for AI chat)
- Visit: https://platform.openai.com/
- Create account and add billing
- Generate API key
- Note: Requires paid account

## Database Setup

1. **Push database schema**
   ```bash
   npm run db:push
   ```

2. **Verify tables are created**
   ```bash
   # Connect to your database and check tables
   psql $DATABASE_URL -c "\dt"
   ```

## Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   ```
   http://localhost:5000
   ```

The application serves both frontend and backend on the same port.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/           # Utilities and API clients
├── server/                 # Express backend
│   ├── routes.ts          # API endpoints
│   ├── foursquare-api.ts  # Foursquare integration
│   ├── google-api.ts      # Google APIs integration
│   └── storage.ts         # Database operations
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema
└── package.json
```

## Key Pages

- **Home** (`/`): Weather, destinations, and quick actions
- **Explore** (`/feed`): Instagram-style nearby places feed
- **Social** (`/social`): User profiles and social features
- **Itinerary** (`/itinerary`): Travel planning tools
- **Chat** (`/chat/:id`): AI-powered travel assistance

## VS Code Setup

1. **Install recommended extensions**
   - TypeScript and JavaScript Language Features
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - PostgreSQL (for database management)

2. **VS Code settings**
   
   Create `.vscode/settings.json`:
   ```json
   {
     "typescript.preferences.importModuleSpecifier": "relative",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "tailwindCSS.includeLanguages": {
       "typescript": "javascript",
       "typescriptreact": "javascript"
     }
   }
   ```

3. **Debug configuration**
   
   Create `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Launch Server",
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/server/index.ts",
         "outFiles": ["${workspaceFolder}/dist/**/*.js"],
         "envFile": "${workspaceFolder}/.env",
         "runtimeArgs": ["-r", "tsx/cjs"]
       }
     ]
   }
   ```

## Deployment

### Option 1: Railway (Recommended)
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`
4. Add environment variables in Railway dashboard

### Option 2: Vercel + Neon
1. Deploy frontend to Vercel
2. Use Neon for PostgreSQL
3. Set environment variables in Vercel dashboard

### Option 3: Self-hosted
1. Build application: `npm run build`
2. Set `NODE_ENV=production`
3. Start: `npm start`

## Troubleshooting

### Common Issues

1. **Empty places in explore page**
   - Check Foursquare API key is valid
   - Ensure location permissions are enabled
   - Verify API key has proper permissions

2. **Database connection errors**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify database exists and user has permissions

3. **Build errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run check`

### Development Tips

1. **Hot reload**: Changes to frontend automatically refresh
2. **Server restart**: Backend restarts automatically on file changes
3. **Database inspection**: Use `npm run db:push` to sync schema changes
4. **API testing**: Use the browser network tab to debug API calls

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## License

MIT License - see LICENSE file for details