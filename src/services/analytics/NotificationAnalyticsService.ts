/**
 * Service for tracking notification engagement metrics and syncing with server
 */

// Type for notification analytics data
export interface NotificationAnalyticsData {
  totalReceived: number;
  totalRead: number;
  totalClicked: number;
  categoryBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
  avgTimeToRead?: number;  // Average time in seconds
  userSegment?: string;    // For segmented analytics
}

// Event types for tracking
export type NotificationEvent = 
  | { type: 'RECEIVED'; category?: string; notificationType: string; id: string }
  | { type: 'READ'; id: string; timeToRead?: number }
  | { type: 'CLICKED'; id: string }
  | { type: 'DISMISSED'; id: string }
  | { type: 'SETTINGS_CHANGED'; settings: Record<string, any> };

// API endpoints
const ANALYTICS_API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nicheplatform.example'}/analytics/notifications`;
const ANALYTICS_BATCH_SIZE = 10;

// Track notification events locally and queue for server sync
let eventQueue: { event: NotificationEvent; timestamp: string }[] = [];

/**
 * Track a notification event
 */
export const trackNotificationEvent = (event: NotificationEvent): void => {
  try {
    // Add to queue
    eventQueue.push({
      event,
      timestamp: new Date().toISOString()
    });
    
    // Log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[Notification Analytics]', event);
    }
    
    // Queue sync if we reach batch size
    if (eventQueue.length >= ANALYTICS_BATCH_SIZE) {
      syncEventsToServer();
    }
  } catch (error) {
    console.error('Error tracking notification event:', error);
  }
};

/**
 * Sync events to server
 */
export const syncEventsToServer = async (): Promise<boolean> => {
  // If no events, nothing to do
  if (eventQueue.length === 0) return true;
  
  try {
    // In development mode, just log
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV MODE] Syncing ${eventQueue.length} notification events to server`);
      console.log(eventQueue);
      
      // Clear queue
      eventQueue = [];
      return true;
    }
    
    // Clone and clear queue
    const eventsToSync = [...eventQueue];
    eventQueue = [];
    
    // Send to server
    const response = await fetch(ANALYTICS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events: eventsToSync,
        device: typeof window !== 'undefined' ? {
          userAgent: window.navigator.userAgent,
          language: window.navigator.language,
          screenSize: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        } : { userAgent: 'unknown' }
      })
    });
    
    if (!response.ok) {
      // Put events back in queue
      eventQueue = [...eventsToSync, ...eventQueue];
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing notification events to server:', error);
    
    // Put events back in queue
    if (eventQueue.length === 0) {
      eventQueue = [...eventQueue];
    }
    
    return false;
  }
};

/**
 * Get current analytics data from server
 */
export const fetchAnalyticsData = async (timePeriod: 'day' | 'week' | 'month' = 'week'): Promise<NotificationAnalyticsData | null> => {
  try {
    // Force any pending events to sync first
    await syncEventsToServer();
    
    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development') {
      return getMockAnalyticsData(timePeriod);
    }
    
    // Fetch from server
    const response = await fetch(`${ANALYTICS_API_URL}?period=${timePeriod}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching notification analytics data:', error);
    return null;
  }
};

/**
 * Get mock analytics data for development mode
 */
const getMockAnalyticsData = (timePeriod: 'day' | 'week' | 'month'): NotificationAnalyticsData => {
  // Scale mock data based on time period
  const scale = timePeriod === 'day' ? 1 : timePeriod === 'week' ? 7 : 30;
  
  return {
    totalReceived: 18 * scale,
    totalRead: 14 * scale,
    totalClicked: 8 * scale,
    avgTimeToRead: 35,
    categoryBreakdown: {
      Social: 6 * scale,
      Content: 4 * scale,
      System: 3 * scale,
      Messages: 5 * scale
    },
    typeBreakdown: {
      info: 10 * scale,
      success: 3 * scale,
      warning: 2 * scale,
      error: 1 * scale,
      message: 2 * scale
    }
  };
};

/**
 * Initialize analytics service
 * Call this on app startup
 */
export const initNotificationAnalytics = (): void => {
  // Set up event listener to sync before page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      if (eventQueue.length > 0) {
        // Use sync to avoid waiting for async operation
        const xhr = new XMLHttpRequest();
        xhr.open('POST', ANALYTICS_API_URL, false); // false for synchronous
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
          events: eventQueue,
          device: {
            userAgent: window.navigator.userAgent,
            language: window.navigator.language,
            screenSize: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          }
        }));
      }
    });
    
    // Set up periodic sync
    setInterval(() => {
      if (eventQueue.length > 0) {
        syncEventsToServer();
      }
    }, 30000); // Every 30 seconds
  }
};
