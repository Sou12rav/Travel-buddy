// Simple script to trigger force database reset
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the force flag file
const forceReseedFlag = path.join(__dirname, 'server', '.reseed_force');

// Write to the file to trigger force reseed
fs.writeFileSync(forceReseedFlag, 'true');

console.log('Force reseed flag created! Restart the server to reset the database.');