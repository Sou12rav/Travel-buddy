import { pool } from "./db";
import { log } from "./vite";
import { seedDatabase } from "./seed";
import { storage } from "./storage";

async function resetDatabase() {
  try {
    log("Dropping all tables...");
    
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
      
      // Commit the transaction
      await client.query('COMMIT');
      
      log("All tables truncated successfully");
    } catch (err) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
    }
    
    // Re-seed the database
    await seedDatabase(storage);
    
    log("Database reset and re-seeded successfully");
    process.exit(0);
  } catch (error) {
    log(`Error resetting database: ${error}`);
    process.exit(1);
  }
}

resetDatabase();