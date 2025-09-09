import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppNotification = {
  id: string;
  title?: string;
  message: string;
  timestamp: Date | string | number | undefined;
  read?: boolean;
  isRead?: boolean;
  replyDetails?: any;
  type?: "alert-reply" | "incident-reply" | "emergency-reply";
  serviceType?: string;
  responderName?: string;
  station?: string;
};

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: string | AppNotification) => void;
  markNotificationAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Load notifications from AsyncStorage on mount
  useEffect(() => {
    loadNotificationsFromStorage();
  }, []);

  const loadNotificationsFromStorage = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('app_notifications');
      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications);
        console.log('📱 Loaded notifications from storage:', parsed.length);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('❌ Error loading notifications from storage:', error);
    }
  };

  const saveNotificationsToStorage = async (notificationsList: AppNotification[]) => {
    try {
      await AsyncStorage.setItem('app_notifications', JSON.stringify(notificationsList));
      console.log('💾 Saved notifications to storage:', notificationsList.length);
    } catch (error) {
      console.error('❌ Error saving notifications to storage:', error);
    }
  };

  const addNotification = (notification: string | AppNotification) => {
    console.log('🔔 Adding notification to context:', notification);
    console.log('🔔 Current notifications before add:', notifications.length);
    
    if (typeof notification === "string") {
      const newNotification = {
        id: Date.now().toString(),
        message: notification,
        timestamp: new Date(),
        read: false,
      };
      console.log('📝 String notification created:', newNotification);
      setNotifications((prev) => {
        const updated = [...prev, newNotification];
        console.log('📊 Total notifications after add:', updated.length);
        console.log('📊 Updated notifications array:', updated);
        saveNotificationsToStorage(updated);
        return updated;
      });
    } else {
      const newNotification = {
        ...notification,
        id: notification.id || Date.now().toString(),
        timestamp: notification.timestamp || new Date(),
        read: typeof notification.read === "boolean" ? notification.read : false,
      };
      console.log('📝 Object notification created:', newNotification);
      setNotifications((prev) => {
        const updated = [...prev, newNotification];
        console.log('📊 Total notifications after add:', updated.length);
        console.log('📊 Updated notifications array:', updated);
        saveNotificationsToStorage(updated);
        return updated;
      });
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotificationsToStorage(updated);
      return updated;
    });
  };

  console.log('🔔 NotificationProvider rendering with notifications:', notifications.length);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markNotificationAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
