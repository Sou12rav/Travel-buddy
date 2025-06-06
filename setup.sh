#!/bin/bash

# AI-Powered Travel Companion Setup Script

echo "🌍 Setting up AI-Powered Travel Companion..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys and database credentials"
    echo "   Required: FOURSQUARE_API_KEY, OPENWEATHER_API_KEY"
    echo "   Optional: OPENAI_API_KEY"
fi

# Check for PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL detected"
else
    echo "⚠️  PostgreSQL not detected. Options:"
    echo "   1. Install locally: sudo apt install postgresql (Ubuntu/Debian)"
    echo "   2. Use cloud PostgreSQL (Neon, Supabase, Railway)"
    echo "   3. Use Docker: docker-compose up postgres"
fi

echo ""
echo "🚀 Setup complete! Next steps:"
echo ""
echo "1. Edit .env file with your credentials:"
echo "   - Database URL (PostgreSQL connection string)"
echo "   - Foursquare API key (https://developer.foursquare.com/)"
echo "   - OpenWeatherMap API key (https://openweathermap.org/api)"
echo ""
echo "2. Set up database:"
echo "   npm run db:push"
echo ""
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "4. Open in browser:"
echo "   http://localhost:5000"
echo ""
echo "For VS Code users:"
echo "- Install recommended extensions (check .vscode/extensions.json)"
echo "- Use F5 to debug the server"
echo "- TypeScript and Tailwind intellisense included"
echo ""