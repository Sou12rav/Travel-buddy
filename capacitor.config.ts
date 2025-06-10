import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.travelcompanion.app',
  appName: 'Travel Companion',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    App: {
      launchAutoHide: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1f2937'
    },
    Geolocation: {
      permissions: ['location']
    },
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;
