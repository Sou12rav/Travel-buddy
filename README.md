# Travel Companion App

An AI-powered travel companion web application designed for Indian travelers, offering intelligent and personalized travel experiences with comprehensive technological integrations and social features.

## Features

- 🌙 Modern UI with Dark/Light mode support
- 🏙️ Detailed city information for major Indian cities
- 📍 Location-based services with custom welcome messages
- 🌦️ Weather information and travel alerts
- 🏨 Browse popular destinations, hotels, and restaurants
- 🗣️ AI-powered chat assistant
- 📱 Responsive mobile-first design

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS for styling
- **Backend**: Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Query for server state
- **UI Components**: Shadcn UI components
- **Routing**: Wouter for lightweight routing

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/travel-companion-app.git
   cd travel-companion-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the PostgreSQL connection details

4. Initialize the database:
   ```
   npm run db:push
   ```

### Running the App

To start the development server:

```
npm run dev
```

The application will be available at http://localhost:5000

## Project Structure

```
/
├── client/               # Frontend code
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and helpers
│   │   ├── pages/        # Page components
│   │   └── main.tsx      # Entry point
│   └── index.html        # HTML template
├── server/               # Backend code
│   ├── database-storage.ts  # Database integration
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── vite.ts           # Vite server configuration
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema and types
├── .env.example          # Example environment variables
├── drizzle.config.ts     # Drizzle ORM configuration
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite configuration
```

## VS Code Configuration

This project includes VS Code settings for an optimal development experience:

- Debug configurations for full-stack development
- Formatting on save with ESLint and Prettier
- Tailwind CSS IntelliSense support

## Dark Mode Support

The application uses custom theming with CSS variables to support both light and dark modes. The theme can be toggled via the UI with automatic preference detection based on system settings.

## Database Schema

The database schema is defined in `shared/schema.ts` using Drizzle ORM. To make changes to the schema:

1. Update the schema definitions in `shared/schema.ts`
2. Run `npm run db:push` to apply the changes to the database

## License

[MIT](LICENSE)