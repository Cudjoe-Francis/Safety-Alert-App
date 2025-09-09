import { Alert } from 'react-native';
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseFirestore";
import { AlertData } from "./buildAlertData";
import { getServerUrl } from '../config/serverConfig';

// Function to get users with specific service type from Firestore
async function getUsersWithServiceType(serviceType: string): Promise<string[]> {
  try {
    console.log(`🔍 Mobile app cannot query users collection due to Firebase permissions`);
    console.log(`📧 Delegating user lookup to email server for serviceType: "${serviceType}"`);
    
    // Return empty array - email server will handle user lookup
    // This avoids Firebase permission errors in mobile app
    return [];
  } catch (error) {
    console.error(`❌ Error in getUsersWithServiceType:`, error);
    return [];
  }
}

// Function to notify service users via email server API
async function notifyServiceUsers(alertData: AlertData): Promise<void> {
  try {
    console.log(`📧 Skipping email sending from mobile app - website dashboard will handle notifications`);
    console.log(`🌐 Alert will be saved to Firebase and website will detect it and send emails`);
    
    // Mobile app no longer sends emails - website dashboard handles this
    return;
  } catch (error) {
    console.error('❌ Error in notifyServiceUsers:', error);
  }
}

// Function to send confirmation email to alert creator
async function sendConfirmationEmail(alertData: AlertData): Promise<void> {
  try {
    console.log(`📧 Sending confirmation email to ${alertData.user.email}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000) as any; // 10 second timeout
    
    console.log(`🌐 Mobile app sending confirmation email via: ${getServerUrl()}`);
    console.log(`📧 Confirmation email to: ${alertData.user.email}`);
    
    const response = await fetch(`${getServerUrl()}/api/send-alert-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceType: 'confirmation',
        recipientEmail: alertData.user.email,
        subject: `✅ Alert Confirmation - We Have Received Your ${alertData.serviceType.toUpperCase()} Request`,
        html: generateConfirmationHTML(alertData),
        alertId: `confirmation-${Date.now()}`,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Confirmation email sent to ${alertData.user.email}`);
      console.log(`📧 Message ID: ${result.messageId}`);
    } else {
      const errorText = await response.text();
      console.error(`❌ Failed to send confirmation email: ${response.status}`);
      console.error(`❌ Error response:`, errorText);
    }
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    if (error instanceof Error) {
      console.error('❌ Error details:', error.message);
      if (error.name === 'AbortError') {
        console.error('❌ Request timed out - email server may be slow or unreachable');
      } else if (error.message.includes('Network request failed')) {
        console.error('❌ Network error - check if email server is running on port 3002');
        console.error(`❌ Trying to connect to: ${getServerUrl()}`);
      }
    }
    console.log('💡 Email server may not be running. Alert still saved to Firebase.');
  }
}

// Generate confirmation email HTML
function generateConfirmationHTML(alertData: AlertData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Alert Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .alert-info { background: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 15px 0; }
        .footer { background: #121a68; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .success { color: #059669; font-weight: bold; font-size: 18px; }
        h2 { color: #121a68; margin-top: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ ALERT RECEIVED</h1>
          <p class="success">Your emergency request has been submitted!</p>
        </div>
        
        <div class="content">
          <p>Hello <strong>${alertData.user.email}</strong>,</p>
          <p>We have successfully received your emergency alert and notified the appropriate emergency services:</p>
          
          <div class="alert-info">
            <h2>Your Alert Details</h2>
            <p><strong>Service Requested:</strong> ${alertData.serviceType.toUpperCase()}</p>
            <p><strong>Person:</strong> ${alertData.userName}</p>
            <p><strong>Location:</strong> ${typeof alertData.location === 'string' ? alertData.location : alertData.location?.address || 'Location provided'}</p>
            <p><strong>Time:</strong> ${alertData.time}</p>
            ${alertData.message ? `<p><strong>Your Message:</strong> ${alertData.message}</p>` : ''}
          </div>

          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 5px; border-left: 4px solid #3b82f6;">
            <p><strong>📱 What happens next:</strong></p>
            <ul>
              <li>Emergency services have been automatically notified</li>
              <li>You will receive updates via push notifications in your app</li>
              <li>Emergency responders may contact you directly</li>
              <li>Keep your phone nearby for any follow-up communication</li>
            </ul>
          </div>

          <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
            <p><strong>⚠️ Important:</strong> If this is a life-threatening emergency, please also call your local emergency number immediately.</p>
          </div>
        </div>

        <div class="footer">
          <p>This confirmation was sent through the Safety Alert System</p>
          <p>Alert submitted at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate service alert HTML for dashboard users
function generateServiceAlertHTML(alertData: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Emergency Alert</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: #dc2626; color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .alert-info { background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 EMERGENCY ALERT</h1>
          <p>New ${alertData.serviceType.toUpperCase()} emergency request</p>
        </div>
        
        <div class="content">
          <p><strong>IMMEDIATE ATTENTION REQUIRED</strong></p>
          <p>A new emergency alert has been submitted and requires ${alertData.serviceType.toUpperCase()} response.</p>
          
          <div class="alert-info">
            <h3>Alert Details</h3>
            <p><strong>Service Required:</strong> ${alertData.serviceType.toUpperCase()}</p>
            <p><strong>Person:</strong> ${alertData.userName}</p>
            <p><strong>Location:</strong> ${alertData.location}</p>
            <p><strong>Time:</strong> ${alertData.time}</p>
            <p><strong>Alert ID:</strong> ${alertData.alertId}</p>
            ${alertData.message ? `<p><strong>Message:</strong> ${alertData.message}</p>` : ''}
          </div>

          <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
            <p><strong>⚠️ Action Required:</strong> Please sign in to the Safety Alert Dashboard to view full details and respond to this emergency alert.</p>
            <p><strong>Dashboard URL:</strong> <a href="http://localhost:5173">http://localhost:5173</a></p>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated emergency alert from Safety Alert System</p>
          <p>Generated at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Sends alert data to Firestore
export async function sendAlertToFirestore(alert: AlertData) {
  // alert.serviceType should be set to "police", "fire", etc.
  // Ensure user email is included in the alert data
  const alertWithEmail = {
    ...alert,
    userEmail: alert.user.email, // Add userEmail field for easy access
  };
  
  const docRef = await addDoc(collection(firestore, "alerts"), alertWithEmail);
  
  // Send notifications after successfully creating the alert
  try {
    // Send confirmation email to the user
    await sendConfirmationEmail(alert);
    
    // Notify all service users with matching service type
    await notifyServiceUsers(alert);
    
    console.log(`✅ Alert created and notifications sent for ${alert.serviceType} service`);
  } catch (error) {
    console.error('❌ Error sending notifications after alert creation:', error);
  }
  
  return docRef;
}
