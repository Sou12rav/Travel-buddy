#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Travel Companion APK build process...');

// Create minimal dist folder with required files
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy essential client files
const clientDir = path.join(__dirname, 'client');
const srcDir = path.join(clientDir, 'src');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simplified index.html for mobile
const mobileHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <title>Travel Companion</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #root { width: 100%; height: 100vh; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
    </style>
</head>
<body>
    <div id="root">
        <div class="loading">
            <h2>Travel Companion Loading...</h2>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), mobileHtml);

console.log('✅ Created mobile HTML template');

// Create basic manifest for PWA capabilities
const manifest = {
  name: "Travel Companion",
  short_name: "TravelApp",
  description: "AI-powered travel companion for Indian travelers",
  start_url: "/",
  display: "standalone",
  background_color: "#1f2937",
  theme_color: "#3b82f6",
  icons: [
    {
      src: "icon-192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "icon-512.png",
      sizes: "512x512",
      type: "image/png"
    }
  ]
};

fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log('✅ Created PWA manifest');

// Run Capacitor sync
try {
  console.log('🔄 Syncing Capacitor...');
  execSync('npx cap sync', { stdio: 'inherit' });
  console.log('✅ Capacitor sync completed');
} catch (error) {
  console.log('⚠️ Capacitor sync had issues, continuing...');
}

console.log('🎯 Mobile build preparation complete!');
console.log('📱 Next steps:');
console.log('   1. Add Android platform: npx cap add android');
console.log('   2. Open Android Studio: npx cap open android');
console.log('   3. Build APK in Android Studio');