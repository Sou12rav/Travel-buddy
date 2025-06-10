#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runCommand(command, options = {}) {
  try {
    console.log(`Running: ${command}`);
    const result = execSync(command, { 
      stdio: 'inherit', 
      cwd: __dirname,
      ...options 
    });
    return result;
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    throw error;
  }
}

async function buildAPK() {
  console.log('🚀 Building Travel Companion APK...');

  // Step 1: Prepare web assets
  console.log('\n📦 Step 1: Preparing web assets...');
  
  // Create a production-ready dist folder
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });

  // Create optimized index.html for mobile
  const mobileHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Travel Companion</title>
    <link rel="manifest" href="./manifest.json">
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
            -webkit-tap-highlight-color: transparent;
        }
        html, body { 
            height: 100%;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        #root { 
            width: 100%; 
            height: 100vh; 
            position: relative;
        }
        .loading { 
            display: flex; 
            flex-direction: column;
            justify-content: center; 
            align-items: center; 
            height: 100vh;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 20px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        h1 { font-size: 28px; margin-bottom: 10px; font-weight: 300; }
        p { font-size: 16px; opacity: 0.8; }
    </style>
</head>
<body>
    <div id="root">
        <div class="loading">
            <div class="spinner"></div>
            <h1>Travel Companion</h1>
            <p>Your AI-powered travel guide</p>
        </div>
    </div>
    <script>
        // Initialize app when page loads
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                document.querySelector('.loading h1').textContent = 'Ready to Explore!';
                document.querySelector('.loading p').textContent = 'Discover amazing places in India';
            }, 2000);
        });
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(distDir, 'index.html'), mobileHtml);

  // Create PWA manifest
  const manifest = {
    name: "Travel Companion",
    short_name: "TravelApp",
    description: "AI-powered travel companion for Indian travelers",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#667eea",
    theme_color: "#667eea",
    icons: [
      {
        src: "icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "icon-512.png", 
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('✅ Web assets prepared');

  // Step 2: Sync with Capacitor
  console.log('\n🔄 Step 2: Syncing with Capacitor...');
  runCommand('npx cap sync android');
  console.log('✅ Capacitor sync completed');

  // Step 3: Build Android APK
  console.log('\n🤖 Step 3: Building Android APK...');
  
  // Check if Android platform exists
  const androidDir = path.join(__dirname, 'android');
  if (!fs.existsSync(androidDir)) {
    console.log('Adding Android platform...');
    runCommand('npx cap add android');
  }

  // Build debug APK using Gradle
  console.log('Building debug APK...');
  const gradlewPath = path.join(androidDir, 'gradlew');
  
  // Make gradlew executable on Unix systems
  if (process.platform !== 'win32') {
    runCommand('chmod +x ./android/gradlew');
  }

  // Build the APK
  runCommand('./gradlew assembleDebug', { cwd: androidDir });

  // Find the generated APK
  const apkDir = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug');
  const apkFiles = fs.readdirSync(apkDir).filter(file => file.endsWith('.apk'));
  
  if (apkFiles.length > 0) {
    const apkPath = path.join(apkDir, apkFiles[0]);
    const outputApk = path.join(__dirname, 'travel-companion.apk');
    
    // Copy APK to root directory
    fs.copyFileSync(apkPath, outputApk);
    
    console.log('✅ APK built successfully!');
    console.log(`📱 APK location: ${outputApk}`);
    console.log(`📁 Original location: ${apkPath}`);
    
    // Get APK file size
    const stats = fs.statSync(outputApk);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 APK size: ${fileSizeInMB} MB`);
    
  } else {
    throw new Error('APK file not found after build');
  }

  console.log('\n🎉 Build completed successfully!');
  console.log('📲 You can now install travel-companion.apk on your Android device');
}

// Run the build process
buildAPK().catch(error => {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
});