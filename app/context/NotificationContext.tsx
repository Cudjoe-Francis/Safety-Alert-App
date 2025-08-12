import React, { createContext, ReactNode, useContext, useState } from "react";

export type AppNotification = {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  replyDetails?: any;
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

  const addNotification = (notification: string | AppNotification) => {
    if (typeof notification === "string") {
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: notification,
          timestamp: new Date(),
          read: false,
        },
      ]);
    } else {
      setNotifications((prev) => [
        ...prev,
        {
          ...notification,
          id: notification.id || Date.now().toString(),
          timestamp: notification.timestamp || new Date(),
          read:
            typeof notification.read === "boolean" ? notification.read : false,
        },
      ]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markNotificationAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
