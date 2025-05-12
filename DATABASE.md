# Database Setup and Migrations

This project uses PostgreSQL with Drizzle ORM for database management. The schema is defined in `shared/schema.ts`, and migrations are managed using Drizzle Kit.

## Setup Instructions

### Local Development

1. **Install PostgreSQL** (if not already installed)
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres`

2. **Create a database**
   ```sql
   CREATE DATABASE travel_app;
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the PostgreSQL connection details:
     ```
     DATABASE_URL=postgres://username:password@localhost:5432/travel_app
     PGHOST=localhost
     PGPORT=5432
     PGUSER=postgres
     PGPASSWORD=your_password
     PGDATABASE=travel_app
     ```

4. **Push schema to database**
   ```bash
   npm run db:push
   ```

## Schema Changes

When you need to update the database schema:

1. Edit the relevant schema definitions in `shared/schema.ts`
2. Run the migration command:
   ```bash
   npm run db:push
   ```

## Database Models

The application includes the following models:

- **User**: User accounts and authentication
- **Conversation**: Chat conversations
- **Message**: Individual chat messages
- **Itinerary**: Travel plans
- **SavedPlace**: Locations saved by users
- **Post**: Social media posts
- **Comment**: Comments on posts
- **Friendship**: User friend relationships
- **Follower**: User follow relationships

## Database Seed Data

For development and testing, you can seed the database with sample data:

```bash
# Run the seed script
node server/seed.js
```

This will populate the database with sample users, destinations, and other data to help with testing the application.

## Troubleshooting

If you encounter database connection issues:

1. Verify PostgreSQL is running
2. Check your environment variables
3. Ensure the database exists
4. Confirm user has appropriate permissions:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE travel_app TO username;
   ```

## Backing Up Data

To create a backup of your database:

```bash
pg_dump -U username -d travel_app > backup.sql
```

To restore from a backup:

```bash
psql -U username -d travel_app < backup.sql
```