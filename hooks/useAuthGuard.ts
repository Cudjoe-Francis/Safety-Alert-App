// Auth guard hook for mobile app to handle automatic logout and session expiry
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

interface AuthGuardOptions {
  redirectTo?: string;
  showAlert?: boolean;
}

export function useAuthGuard(options: AuthGuardOptions = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();
  
  const { redirectTo = '/signin', showAlert = true } = options;

  useEffect(() => {
    let sessionCheckInterval: NodeJS.Timeout;
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔐 Mobile Auth state changed:', currentUser ? 'User logged in' : 'No user');
      
      if (currentUser) {
        try {
          // Force token refresh to check if it's still valid
          await currentUser.getIdToken(true);
          setUser(currentUser);
          setSessionExpired(false);
          
          // Set up periodic session validation (every 5 minutes)
          sessionCheckInterval = setInterval(async () => {
            try {
              await currentUser.getIdToken(true);
              console.log('✅ Mobile session still valid');
            } catch (error) {
              console.log('❌ Mobile session expired during periodic check');
              handleSessionExpiry();
            }
          }, 5 * 60 * 1000); // 5 minutes
          
        } catch (error) {
          console.log('❌ Invalid token detected on mobile, logging out');
          handleSessionExpiry();
        }
      } else {
        // No user - check if this was an unexpected logout
        const wasLoggedIn = await import('expo-secure-store').then(SecureStore => 
          SecureStore.getItemAsync('wasLoggedIn')
        );
        
        if (wasLoggedIn === 'true' && !sessionExpired) {
          handleSessionExpiry();
        } else {
          setUser(null);
          await import('expo-secure-store').then(SecureStore => 
            SecureStore.deleteItemAsync('wasLoggedIn')
          );
        }
      }
      
      setLoading(false);
    });

    const handleSessionExpiry = async () => {
      console.log('🚪 Handling mobile session expiry');
      setSessionExpired(true);
      setUser(null);
      
      // Clear stored auth flag
      await import('expo-secure-store').then(SecureStore => 
        SecureStore.deleteItemAsync('wasLoggedIn')
      );
      
      // Clear session check interval
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
      
      // Show alert notification if enabled
      if (showAlert) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please sign in again.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/(auth)/signin' as any);
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        // Redirect immediately if no alert
        router.replace('/(auth)/signin' as any);
      }
    };

    // Set logged in flag when component mounts with user
    if (auth.currentUser) {
      import('expo-secure-store').then(SecureStore => 
        SecureStore.setItemAsync('wasLoggedIn', 'true')
      );
    }

    return () => {
      unsubscribe();
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
    };
  }, [router, redirectTo, showAlert, sessionExpired]);

  // Update logged in flag when user changes
  useEffect(() => {
    if (user) {
      import('expo-secure-store').then(SecureStore => 
        SecureStore.setItemAsync('wasLoggedIn', 'true')
      );
    }
  }, [user]);

  return {
    user,
    loading,
    sessionExpired,
    isAuthenticated: !!user && !sessionExpired
  };
}
