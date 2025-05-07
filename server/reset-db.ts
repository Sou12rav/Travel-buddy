import { pool } from "./db";
import { log } from "./vite";
import { seedDatabase } from "./seed";
import { storage } from "./storage";
import fs from 'fs';
import path from 'path';

// Create a special force flag file to bypass the existing user check
const FORCE_RESEED_FLAG = path.join(process.cwd(), 'server', '.reseed_force');

// Create the force flag file to indicate we want to reseed
fs.writeFileSync(FORCE_RESEED_FLAG, 'true');

async function resetDatabase() {
  try {
    log("Forcefully dropping all tables...");
    
    // Direct SQL approach to truncate all tables
    const client = await pool.connect();
    try {
      // Start a transaction
      await client.query('BEGIN');
      
      // Disable foreign key checks temporarily
      await client.query('SET CONSTRAINTS ALL DEFERRED');
      
      // Truncate all tables in one go
      await client.query(`
        TRUNCATE TABLE comments, 
                     posts, 
                     followers, 
                     friendships, 
                     saved_places, 
                     messages, 
                     conversations, 
                     itineraries, 
                     users
        CASCADE
      `);
      
      // Reset all sequences
      await client.query(`
        ALTER SEQUENCE users_id_seq RESTART WITH 1;
        ALTER SEQUENCE posts_id_seq RESTART WITH 1;
        ALTER SEQUENCE comments_id_seq RESTART WITH 1;
        ALTER SEQUENCE messages_id_seq RESTART WITH 1;
        ALTER SEQUENCE conversations_id_seq RESTART WITH 1;
        ALTER SEQUENCE itineraries_id_seq RESTART WITH 1;
        ALTER SEQUENCE saved_places_id_seq RESTART WITH 1;
        ALTER SEQUENCE friendships_id_seq RESTART WITH 1;
        ALTER SEQUENCE followers_id_seq RESTART WITH 1;
      `);
      
      // Commit the transaction
      await client.query('COMMIT');
      
      log("All tables truncated and sequences reset successfully");
    } catch (err) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
    }
    
    // Modify the seed.ts file temporarily to patch the existingUser check
    log("Patching seed.ts to force reseeding...");
    
    // Re-seed the database
    await seedDatabase(storage);
    
    // Clean up the force flag file
    if (fs.existsSync(FORCE_RESEED_FLAG)) {
      fs.unlinkSync(FORCE_RESEED_FLAG);
    }
    
    log("Database reset and re-seeded successfully");
    process.exit(0);
  } catch (error) {
    log(`Error resetting database: ${error}`);
    process.exit(1);
  }
}

resetDatabase();