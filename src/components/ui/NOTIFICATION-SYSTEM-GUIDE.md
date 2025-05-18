# Notification System Integration Guide

This guide explains how to use the notification system in your components throughout the Niche Platform application.

## System Overview

The notification system consists of two main parts:

1. **Toast Notifications**: Brief, temporary notifications that appear at the top-right corner of the screen
2. **Notification Center**: Persistent notifications accessible via a bell icon, which users can mark as read or clear

## Setup

The notification system is already integrated at the application root level through the `AppShell` component. Both providers are included:

```tsx
// src/components/layout/AppShell.tsx
<ToastProvider>
  <NotificationProvider>
    {children}
  </NotificationProvider>
</ToastProvider>
```

## Using Toast Notifications

Toast notifications are perfect for immediate feedback on user actions.

### Basic Usage

```tsx
import { useToast } from '../ui/ToastProvider';

const YourComponent = () => {
  const { showToast } = useToast();
  
  const handleAction = () => {
    // Show a toast message when action completes
    showToast('Operation completed successfully!', 'success');
  };
  
  return (
    <button onClick={handleAction}>
      Perform Action
    </button>
  );
};
```

### Toast Types

There are three types of toast messages:

- `success`: Green background, for successful operations
- `error`: Red background, for errors or failures
- `info`: Blue background, for general information (default)

Example:
```tsx
showToast('Process completed successfully', 'success');
showToast('An error occurred', 'error');
showToast('New message received', 'info');
```

## Using the Notification Center

The Notification Center is for more persistent messages that users might want to refer back to later.

### Basic Usage

```tsx
import { useNotifications } from '../ui/NotificationContextProvider';

const YourComponent = () => {
  const { addNotification } = useNotifications();
  
  const handleImportantEvent = () => {
    // Add a notification to the notification center
    addNotification(
      'Your content has been approved by a moderator',
      'success'
    );
  };
  
  return (
    <button onClick={handleImportantEvent}>
      Process Content
    </button>
  );
};
```

### Notification Types

Notifications support four types:

- `success`: For positive outcomes
- `error`: For errors and issues
- `warning`: For cautionary information
- `info`: For general information (default)

### Advanced Usage: Categorized Notifications

For better organization, you can assign categories to notifications:

```tsx
import { useNotifications } from '../ui/NotificationContextProvider';

const { addNotification } = useNotifications();

// Add a categorized notification
addNotification(
  'New comment on your post', 
  'info',
  'Social' // Category
);

// The third parameter is the category
```

## Theme Support

The notification system automatically adapts to light and dark themes. To change the theme:

```tsx
// Set theme to dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Set theme to light mode
document.documentElement.setAttribute('data-theme', 'light');
```

## Notification Sounds

The system supports sound effects for notifications:

```tsx
import { playNotificationSound } from '../ui/NotificationSounds';

// Play a sound when something important happens
playNotificationSound('success');
```

Available sound types:
- `default` (standard notification)
- `success`
- `error`
- `warning`

## Customizing User Preferences

Users can customize their notification experience through the settings panel in the notification center:

- Enable/disable sounds
- Choose notification sound types
- Toggle grouping of similar notifications
- Switch between light and dark themes

## Implementation Example: Form Submission

Here's a full example of using both systems in a form submission:

```tsx
import React, { useState } from 'react';
import { useToast } from '../ui/ToastProvider';
import { useNotifications } from '../ui/NotificationContextProvider';

export const ContentForm = () => {
  const [content, setContent] = useState('');
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Submit content to API
      const response = await fetch('/api/content', {
        method: 'POST',
        body: JSON.stringify({ content }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        // Show immediate toast feedback
        showToast('Content submitted successfully!', 'success');
        
        // Add to notification center for later reference
        addNotification(
          'Your content has been submitted for review', 
          'info',
          'Content'
        );
        
        // Clear form
        setContent('');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showToast('Failed to submit content', 'error');
      console.error('Error submitting content:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your content"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Demo Component

For a complete demonstration of all notification features, check out the `NotificationDemo.tsx` component:

```tsx
import { NotificationDemo } from '../ui/NotificationDemo';

// Add this to any page to see the demo
<NotificationDemo />
```

## Best Practices

1. **Use Toasts for Immediate Feedback**: Show toast notifications for immediate responses to user actions
2. **Use Notifications for Important Events**: Add to the notification center for events users might want to check later
3. **Be Consistent with Types**: Use consistent notification types across the application
4. **Respect User Preferences**: Always check user notification preferences before showing notifications
5. **Keep Messages Clear and Concise**: Write clear, action-oriented notification messages

## Troubleshooting

- **Hooks Error**: If you see "hooks must be used within a provider" errors, ensure your component is a child of both providers
- **Missing Icons**: If notification icons don't appear, check that the NotificationIcons import is correct
- **Sound Issues**: If sounds don't play, verify the user has sound enabled in their preferences
