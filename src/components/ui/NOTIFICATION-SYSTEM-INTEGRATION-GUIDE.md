# Notification System Integration Guide

This guide explains how to integrate and fully enable all features of the enhanced notification system.

## 1. Backend Integration

The notification system uses WebSockets for real-time notifications. Here's how to connect it to your backend:

### Environment Configuration

We use environment variables for configuration. Copy these values to your `.env.local` file and update them to match your actual backend services:

```
# WebSocket notification server URL - REPLACE WITH YOUR ACTUAL SERVER URL
NEXT_PUBLIC_WS_NOTIFICATION_URL=wss://api.nicheplatform.example/notifications

# WebSocket connection options
NEXT_PUBLIC_WS_RECONNECT_ATTEMPTS=5
NEXT_PUBLIC_WS_RECONNECT_DELAY=3000

# API endpoint for notification preferences and analytics
NEXT_PUBLIC_API_URL=https://api.nicheplatform.example
```

### Backend Requirements

Your WebSocket server should support the following message formats:

1. **Sending notifications to clients**:
   ```json
   {
     "type": "NOTIFICATION",
     "message": "New comment on your post",
     "notificationType": "info",
     "category": "Social"
   }
   ```

2. **Receiving read receipts from clients**:
   ```json
   {
     "type": "READ_RECEIPT",
     "id": "notification-12345"
   }
   ```

### Application Startup

Add this to your main app component to initialize WebSocket connection:

```tsx
// In _app.tsx or layout.tsx
import { useEffect } from 'react';
import { initNotificationAnalytics } from '../services/analytics/NotificationAnalyticsService';
import { syncPendingFeedback } from '../services/feedback/NotificationFeedbackService';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize analytics tracking
    initNotificationAnalytics();
    
    // Sync any pending feedback
    syncPendingFeedback();
  }, []);
  
  return (
    <NotificationProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </NotificationProvider>
  );
}
```

## 2. Sound Files

The notification system uses sound files for different notification types.

### Adding Sound Files

1. Place the following sound files in your `/public/sounds/` directory:
   - `notification.mp3` - Default notification sound
   - `success.mp3` - Success notification sound
   - `error.mp3` - Error notification sound
   - `warning.mp3` - Warning notification sound
   - `message.mp3` - Message notification sound
   - `reminder.mp3` - Reminder notification sound
   - `mention.mp3` - Mention notification sound
   - `like.mp3` - Like notification sound

2. Recommended specifications:
   - Format: MP3
   - Duration: 0.5-2 seconds
   - File size: Under 100KB each
   - Volume: Consistent levels across all sounds

3. If you don't have sound files, here are some options:
   - Use royalty-free sound libraries like FreeSound.org
   - Purchase notification sound packs from audio marketplaces
   - Create your own using a sound editor

### Testing Sounds

Use the `NotificationSoundSelector` component to preview and test sounds:

```tsx
import { NotificationSoundSelector } from '../components/ui/NotificationSoundSelector';
import { previewSound } from '../components/ui/NotificationSounds';

// In a component
const handleSoundTest = (soundType) => {
  previewSound(soundType);
};

// In render
<NotificationSoundSelector onSoundSelect={handleSoundTest} />
```

## 3. User Testing

The notification system includes a user testing component to collect feedback.

### Implementing the Testing Component

Add the testing component to relevant pages:

```tsx
import { NotificationUserTesting } from '../components/ui/NotificationUserTesting';
import { submitNotificationFeedback } from '../services/feedback/NotificationFeedbackService';

// In a component
const handleFeedbackSubmission = async (feedback) => {
  const result = await submitNotificationFeedback(feedback);
  
  if (result.success) {
    // Show success message
    console.log('Feedback submitted:', result.message);
  } else {
    // Show error message
    console.error('Error submitting feedback:', result.message);
  }
};

// In render
<NotificationUserTesting 
  onComplete={handleFeedbackSubmission}
  initialFeedback={{ usefulness: 3 }} // Optional default values
/>
```

### Backend API for Feedback

Create an API endpoint to receive feedback:

```
POST /api/feedback/notifications
```

Request body:
```json
{
  "effectiveness": 4,
  "audioQuality": 3,
  "visualAppeal": 5,
  "usefulness": 4,
  "comments": "Very helpful notifications!",
  "timestamp": "2025-05-18T21:54:32.123Z",
  "userAgent": "Mozilla/5.0...",
  "screenSize": {
    "width": 1920,
    "height": 1080
  }
}
```

### Analyzing Feedback

The feedback system stores data locally when the API is unavailable and tries to resync later. Review the collected feedback to:

1. Identify areas for improvement in the notification system
2. Adjust sound settings based on audio quality feedback
3. Refine visual appearance based on visual appeal ratings
4. Optimize notification frequency based on usefulness scores

## 4. Analytics Dashboard

The notification system includes an analytics dashboard for tracking engagement.

### Setting Up Analytics

The analytics system automatically:
- Tracks notification metrics (received, read, clicked)
- Categorizes by type and category
- Analyzes engagement patterns
- Syncs with the backend API

### Backend API for Analytics

Create these API endpoints:

1. **Receiving events**:
   ```
   POST /api/analytics/notifications
   ```
   
   Request body:
   ```json
   {
     "events": [
       {
         "event": {
           "type": "RECEIVED",
           "category": "Social",
           "notificationType": "info",
           "id": "notification-12345"
         },
         "timestamp": "2025-05-18T21:54:32.123Z"
       },
       {
         "event": {
           "type": "READ",
           "id": "notification-12345",
           "timeToRead": 35
         },
         "timestamp": "2025-05-18T21:55:07.456Z"
       }
     ],
     "device": {
       "userAgent": "Mozilla/5.0...",
       "language": "en-US",
       "screenSize": {
         "width": 1920,
         "height": 1080
       }
     }
   }
   ```

2. **Retrieving analytics data**:
   ```
   GET /api/analytics/notifications?period=week
   ```
   
   Response body:
   ```json
   {
     "totalReceived": 126,
     "totalRead": 98,
     "totalClicked": 56,
     "avgTimeToRead": 35,
     "categoryBreakdown": {
       "Social": 42,
       "Content": 28,
       "System": 21,
       "Messages": 35
     },
     "typeBreakdown": {
       "info": 70,
       "success": 21,
       "warning": 14,
       "error": 7,
       "message": 14
     }
   }
   ```

### Using the Analytics Dashboard

Add the analytics dashboard to your admin or settings pages:

```tsx
import { NotificationAnalytics } from '../components/ui/NotificationAnalytics';
import { fetchAnalyticsData } from '../services/analytics/NotificationAnalyticsService';

// In a component
const [analyticsData, setAnalyticsData] = useState(null);
const [period, setPeriod] = useState('week');

useEffect(() => {
  const loadAnalytics = async () => {
    const data = await fetchAnalyticsData(period);
    if (data) {
      setAnalyticsData(data);
    }
  };
  
  loadAnalytics();
}, [period]);

// In render
<NotificationAnalytics />
```

### Actionable Insights

The analytics dashboard helps you:

1. **Identify patterns**: Review which notification types/categories have highest engagement
2. **Optimize timing**: Analyze when users are most responsive to notifications
3. **Reduce notification fatigue**: Adjust frequency if read rates are declining
4. **Improve content**: Refine notification messages based on click-through rates

## 5. Complete Integration Example

Here's a full integration for your `AppShell` component:

```tsx
import { useEffect } from 'react';
import { NotificationProvider } from '../components/ui/NotificationContextProvider';
import { ToastProvider } from '../components/ui/ToastProvider';
import { initNotificationAnalytics } from '../services/analytics/NotificationAnalyticsService';
import { syncPendingFeedback } from '../services/feedback/NotificationFeedbackService';

export function AppShell({ children }) {
  useEffect(() => {
    // Initialize services
    initNotificationAnalytics();
    syncPendingFeedback();
    
    // Check browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      // We'll request permission when user interacts with the site
      const requestPermission = () => {
        Notification.requestPermission();
        document.removeEventListener('click', requestPermission);
      };
      
      document.addEventListener('click', requestPermission);
      
      return () => {
        document.removeEventListener('click', requestPermission);
      };
    }
  }, []);
  
  return (
    <NotificationProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </NotificationProvider>
  );
}
```

## Troubleshooting

### WebSocket Connection Issues

- Check the WebSocket URL in environment variables
- Verify server is running and accessible
- Check browser console for connection errors
- Try reconnecting manually with `socketRef.current.connect()`

### Sound Issues

- Ensure sound files exist in the correct location
- Check if user has enabled sounds in settings
- Test with `previewSound()` function
- Verify browser supports audio playback

### Browser Notifications

- Ensure permission has been granted
- Test with different browsers
- Check if icon files exist
- Verify notification click handlers are working

### Analytics Discrepancies

- Check queue processing with `syncEventsToServer()`
- Verify API endpoints are correct
- Look for console errors during sync attempts
- Confirm data formats match expected schema

## Next Steps

After integrating the notification system, consider these enhancements:

1. **User preference sync**: Sync notification preferences across devices
2. **Rich media notifications**: Add images and action buttons
3. **Scheduled notifications**: Allow future-dated notifications
4. **Smart grouping**: Group similar notifications for better UX
5. **Personalization**: Use ML to tailor notifications to user interests
