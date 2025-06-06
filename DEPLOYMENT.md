# Deployment Guide

## Quick Start for VS Code

### 1. Prerequisites
- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/)
- **PostgreSQL**: Local installation or cloud service

### 2. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd travel-companion

# Run setup script
./setup.sh

# Or manual setup:
npm install
cp .env.example .env
```

### 3. Configure Environment Variables
Edit `.env` file with your credentials:

```env
# Database (Required)
DATABASE_URL=postgresql://username:password@localhost:5432/travel_app

# API Keys (Required for full functionality)
FOURSQUARE_API_KEY=your_foursquare_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Optional
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Database Setup
```bash
# Push database schema
npm run db:push

# Verify setup
npm run check
```

### 5. Start Development
```bash
# Start development server
npm run dev

# Open browser
# http://localhost:5000
```

## VS Code Integration

### Recommended Extensions
The project includes `.vscode/extensions.json` with recommended extensions:
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- PostgreSQL

### Debugging
- Press `F5` to start debugging the server
- Breakpoints work in TypeScript files
- Integrated terminal for logging

### Features
- Auto-import suggestions
- Tailwind CSS class completion
- Type checking on save
- Hot reload for frontend changes
- Automatic server restart on backend changes

## API Keys Setup

### Foursquare Places API
1. Visit [developer.foursquare.com](https://developer.foursquare.com/)
2. Create free account
3. Create new app
4. Copy API key to `.env` file
5. Free tier: 100,000 requests/month

### OpenWeatherMap API
1. Visit [openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for free account
3. Generate API key
4. Copy to `.env` file
5. Free tier: 1,000 calls/day

### OpenAI API (Optional)
1. Visit [platform.openai.com](https://platform.openai.com/)
2. Create account and add billing
3. Generate API key
4. Copy to `.env` file

## Database Options

### Option 1: Local PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Create database
sudo -u postgres createdb travel_app
sudo -u postgres createuser -P travel_user
```

### Option 2: Cloud PostgreSQL (Recommended)
- **Neon**: [neon.tech](https://neon.tech/) - Free tier with 512MB
- **Supabase**: [supabase.com](https://supabase.com/) - Free tier with 500MB
- **Railway**: [railway.app](https://railway.app/) - Free tier with 1GB

### Option 3: Docker
```bash
# Start PostgreSQL with Docker
docker-compose up postgres

# Use connection string:
# postgresql://travel_user:travel_password@localhost:5432/travel_app
```

## Deployment Options

### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up

# Add environment variables in Railway dashboard
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build

# Production deployment
docker build -t travel-app .
docker run -p 5000:5000 --env-file .env travel-app
```

### Self-hosted VPS
```bash
# Build for production
npm run build

# Start with PM2
npm install -g pm2
pm2 start dist/index.js --name travel-app

# Or direct start
NODE_ENV=production npm start
```

## Troubleshooting

### Common Issues

1. **"Cannot connect to database"**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify database exists

2. **"Empty places in explore page"**
   - Verify Foursquare API key is correct
   - Check browser location permissions
   - Test API key with curl

3. **"Module not found" errors**
   - Delete node_modules and package-lock.json
   - Run `npm install` again
   - Check Node.js version (18+ required)

4. **TypeScript errors in VS Code**
   - Restart TypeScript server: Ctrl+Shift+P → "TypeScript: Restart TS Server"
   - Check tsconfig.json paths
   - Ensure all dependencies are installed

### Testing API Keys
```bash
# Test Foursquare API
curl -H "Authorization: YOUR_API_KEY" \
  "https://api.foursquare.com/v3/places/nearby?ll=22.5726,88.3639&limit=1"

# Test OpenWeatherMap API
curl "https://api.openweathermap.org/data/2.5/weather?lat=22.5726&lon=88.3639&appid=YOUR_API_KEY"
```

### Development Tips
- Use browser DevTools Network tab to debug API calls
- Check server logs in VS Code terminal
- Use `npm run db:push` after schema changes
- Set breakpoints in TypeScript files for debugging

## Project Structure Reference
```
travel-companion/
├── client/src/           # React frontend
│   ├── components/       # UI components
│   ├── pages/           # Route components
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilities
├── server/              # Express backend
│   ├── routes.ts        # API endpoints
│   ├── foursquare-api.ts # Places integration
│   └── storage.ts       # Database layer
├── shared/schema.ts     # Database schema
├── .vscode/             # VS Code configuration
├── .env.example         # Environment template
└── package.json         # Dependencies
```