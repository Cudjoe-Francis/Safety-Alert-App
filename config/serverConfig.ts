// Server configuration for different environments
import { Platform } from 'react-native';

// Get your computer's IP address by running: ipconfig (Windows) or ifconfig (Mac/Linux)
// Your computer's actual IP address
const DEVELOPMENT_IP = '192.168.1.175'; // Your actual IP from ipconfig

export const getServerUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3003';
  }
  
  // For mobile devices, use your computer's IP address
  return `http://${DEVELOPMENT_IP}:3003`;
};

export const API_ENDPOINTS = {
  SEND_SERVICE_NOTIFICATIONS: '/api/send-service-notifications',
  SEND_ALERT_EMAIL: '/api/send-alert-email',
  HEALTH: '/health'
};
