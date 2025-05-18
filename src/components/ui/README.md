# Niche Platform Notification System

This directory contains a comprehensive notification system for the Niche Platform, including toast messages for temporary feedback and a notification center for persistent notifications.

## Components

### 1. Toast System

The toast system provides temporary, non-disruptive feedback messages that automatically disappear after a few seconds.

**Key Files:**
- `ToastProvider.tsx` - Context provider for toast functionality
- `styles.css` - Styling for toast messages

**Usage:**

```tsx
// 1. Import the hook
import { useToast } from '../ui/ToastProvider';

// 2. Use it in your component
const YourComponent = () => {
  const { showToast } = useToast();
  
  const handleAction = () => {
    // Show a toast message when needed
    showToast('Operation completed successfully!', 'success'); // Types: success, error, info
  };
  
  return (
    <button onClick={handleAction}>Do Something</button>
  );
};
```

### 2. Notification Center

The notification center provides persistent notifications that users can view and manage from a dropdown bell icon interface.

**Key Files:**
- `NotificationCenter.tsx` - UI component for notification bell and dropdown
- `NotificationContextProvider.tsx` - Context provider for notification functionality
- `styles.css` - Styling for notification center UI

**Usage:**

```tsx
// 1. Import the hook
import { useNotifications } from '../ui/NotificationContextProvider';

// 2. Use it in your component
const YourComponent = () => {
  const { addNotification } = useNotifications();
  
  const handleAction = () => {
    // Add a notification when needed
    addNotification('You have a new message', 'info'); // Types: info, success, warning, error
  };
  
  return (
    <button onClick={handleAction}>Do Something</button>
  );
};
```

To display the notification center in your UI:

```tsx
import { NotificationCenter } from '../ui/NotificationCenter';
import { useNotifications } from '../ui/NotificationContextProvider';

const Header = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useNotifications();
  
  return (
    <header>
      <div className="header-right">
        <NotificationCenter 
          notifications={notifications}
          onMarkRead={markNotificationAsRead}
          onClearAll={clearAllNotifications}
        />
      </div>
    </header>
  );
};
```

### 3. Demo Component

The `NotificationDemo.tsx` component provides interactive examples of both systems.

## Application Integration

To use the notification system throughout your application:

1. Ensure the providers are wrapped around your app in the appropriate order:

```tsx
<ToastProvider>
  <NotificationProvider>
    <YourApp />
  </NotificationProvider>
</ToastProvider>
```

2. Import the CSS to style the components:

```tsx
import '../components/ui/styles.css';
```

3. Use the hooks in your components as shown in the examples above.

## Best Practices

- **Toast Messages**: Use for brief, non-critical feedback that doesn't require user action.
- **Notifications**: Use for important information that users might want to refer to later.
- **Message Types**:
  - `success`: For successful operations
  - `error`: For operation failures
  - `warning`: For cautionary messages
  - `info`: For general information
