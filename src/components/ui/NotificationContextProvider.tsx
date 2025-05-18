import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Notification } from './NotificationCenter';
import { NotificationSocket, NotificationSocketEvent } from '../../services/websockets/NotificationSocket';
import { playNotificationSound } from './NotificationSounds';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type'], category?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markNotificationClicked: (id: string) => void;
  clearAllNotifications: () => void;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  analyticsData: NotificationAnalytics;
  browserNotificationsEnabled: boolean;
  toggleBrowserNotifications: (enabled: boolean) => void;
}

interface NotificationAnalytics {
  totalReceived: number;
  totalRead: number;
  totalClicked: number;
  categoryBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
};

// WebSocket server URL - replace with your actual WebSocket endpoint
const WS_NOTIFICATION_URL = process.env.NEXT_PUBLIC_WS_NOTIFICATION_URL || 'wss://api.example.com/notifications';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<NotificationAnalytics>({
    totalReceived: 0,
    totalRead: 0,
    totalClicked: 0,
    categoryBreakdown: {},
    typeBreakdown: {}
  });
  
  const socketRef = useRef<NotificationSocket | null>(null);

  // Load notifications and settings from localStorage on component mount
  useEffect(() => {
    try {
      // Load notifications
      const savedNotifications = localStorage.getItem('user_notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      
      // Load analytics data
      const savedAnalytics = localStorage.getItem('notification_analytics');
      if (savedAnalytics) {
        setAnalyticsData(JSON.parse(savedAnalytics));
      }
      
      // Load browser notification preferences
      const browserNotifPref = localStorage.getItem('browser_notifications_enabled');
      if (browserNotifPref) {
        setBrowserNotificationsEnabled(JSON.parse(browserNotifPref));
      }
    } catch (err) {
      console.error('Error loading notification data from localStorage:', err);
    }
    
    // Check if browser notifications are supported and permission is granted
    checkBrowserNotificationPermission();
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('user_notifications', JSON.stringify(notifications));
    } catch (err) {
      console.error('Error saving notifications to localStorage:', err);
    }
  }, [notifications]);
  
  // Save analytics data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('notification_analytics', JSON.stringify(analyticsData));
    } catch (err) {
      console.error('Error saving analytics data to localStorage:', err);
    }
  }, [analyticsData]);
  
  // Save browser notification preferences when they change
  useEffect(() => {
    try {
      localStorage.setItem('browser_notifications_enabled', JSON.stringify(browserNotificationsEnabled));
    } catch (err) {
      console.error('Error saving browser notification preferences to localStorage:', err);
    }
  }, [browserNotificationsEnabled]);
  
  // Connect to WebSocket for real-time notifications
  useEffect(() => {
    // Initialize WebSocket connection
    if (!socketRef.current) {
      socketRef.current = new NotificationSocket(WS_NOTIFICATION_URL, {
        reconnectAttempts: 5,
        reconnectDelay: 3000,
        debug: process.env.NODE_ENV === 'development'
      });
      
      // Subscribe to notifications
      const unsubscribe = socketRef.current.subscribe(handleSocketEvent);
      
      // Connect to socket
      socketRef.current.connect();
      setConnectionStatus('connecting');
      
      return () => {
        unsubscribe();
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, []);
  
  // Handle WebSocket events
  const handleSocketEvent = (event: NotificationSocketEvent) => {
    switch (event.type) {
      case 'CONNECTION_STATE':
        setConnectionStatus(event.payload.state);
        break;
        
      case 'NOTIFICATION':
        const { message, type, category } = event.payload;
        addNotification(message, type || 'info', category);
        break;
        
      case 'READ_RECEIPT':
        // Handle read receipt confirmation from server
        break;
    }
  };
  
  // Check browser notification permission
  const checkBrowserNotificationPermission = () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications');
      return;
    }
    
    if (Notification.permission === 'granted') {
      setBrowserNotificationsEnabled(true);
    }
  };
  
  // Request browser notification permission
  const requestBrowserNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return false;
  };

  const addNotification = (message: string, type: Notification['type'] = 'info', category?: string) => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      message,
      type,
      category,
      read: false,
      timestamp: new Date().toLocaleString()
    };
    
    // Update analytics
    setAnalyticsData(current => {
      const categoryBreakdown = { ...current.categoryBreakdown };
      const typeBreakdown = { ...current.typeBreakdown };
      
      if (category) {
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
      }
      
      typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
      
      return {
        ...current,
        totalReceived: current.totalReceived + 1,
        categoryBreakdown,
        typeBreakdown
      };
    });
    
    // Add to notification list
    setNotifications(current => [newNotification, ...current].slice(0, 50)); // Limit to last 50 notifications
    
    // Show browser notification if enabled
    if (browserNotificationsEnabled) {
      showBrowserNotification(message, { 
        type,
        category,
        id: newNotification.id
      });
    }
    
    // Play notification sound based on type
    playNotificationSound(type);
  };
  
  // Show a browser notification
  const showBrowserNotification = (message: string, options: { type: string, category?: string, id: string }) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }
    
    // Determine notification icon based on type
    let icon = '/icons/notification-default.png';
    if (options.type === 'success') icon = '/icons/notification-success.png';
    if (options.type === 'error') icon = '/icons/notification-error.png';
    if (options.type === 'warning') icon = '/icons/notification-warning.png';
    
    // Create and show the notification
    const notification = new Notification('Niche Platform', {
      body: message,
      icon,
      tag: options.id,
      // Badge for mobile
      badge: '/icons/notification-badge.png'
    });
    
    // Handle notification click
    notification.onclick = () => {
      window.focus();
      markNotificationClicked(options.id);
      notification.close();
    };
  };

  const markNotificationAsRead = (id: string) => {
    let notificationWasUnread = false;
    
    setNotifications(current => {
      const updated = current.map(notification => {
        if (notification.id === id && !notification.read) {
          notificationWasUnread = true;
          return { ...notification, read: true };
        }
        return notification;
      });
      return updated;
    });
    
    // Update analytics only if the notification was previously unread
    if (notificationWasUnread) {
      setAnalyticsData(current => ({
        ...current,
        totalRead: current.totalRead + 1
      }));
    }
    
    // Send read receipt to server if connected
    if (socketRef.current && connectionStatus === 'connected') {
      socketRef.current.sendReadReceipt(id);
    }
  };
  
  // Track when a notification is clicked/interacted with
  const markNotificationClicked = (id: string) => {
    // Mark as read first
    markNotificationAsRead(id);
    
    // Update analytics
    setAnalyticsData(current => ({
      ...current,
      totalClicked: current.totalClicked + 1
    }));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Toggle browser notifications
  const toggleBrowserNotifications = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestBrowserNotificationPermission();
      setBrowserNotificationsEnabled(granted);
      return granted;
    } else {
      setBrowserNotificationsEnabled(false);
      return true;
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      markNotificationAsRead, 
      markNotificationClicked,
      clearAllNotifications,
      connectionStatus,
      analyticsData,
      browserNotificationsEnabled,
      toggleBrowserNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
