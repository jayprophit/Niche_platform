import React, { useState, useRef, useEffect } from 'react';
import { NotificationSettings } from './NotificationSettings';
import { playNotificationSound } from './NotificationSounds';

export interface Notification {
  id: string;
  message: string;
  category?: string; // Optional category for grouping
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onMarkAllRead?: () => void; // Optional callback to mark all as read
}

// Group notifications by category
const groupNotificationsByCategory = (notifications: Notification[]): Record<string, Notification[]> => {
  const grouped: Record<string, Notification[]> = {};
  
  notifications.forEach(notification => {
    const category = notification.category || 'General';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(notification);
  });
  
  return grouped;
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  notifications, 
  onMarkRead, 
  onClearAll,
  onMarkAllRead 
}) => {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Load grouping preference
  useEffect(() => {
    try {
      const groupingEnabled = localStorage.getItem('notificationGroupingEnabled');
      if (groupingEnabled !== null) {
        setGroupByCategory(groupingEnabled === 'true');
      }
    } catch (e) {
      console.error('Failed to load notification grouping setting:', e);
    }
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && 
          dropdownRef.current && 
          buttonRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);
  
  // Play sound on new notifications
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0 && open) {
      playNotificationSound('default');
    }
  }, [open, notifications]);
  
  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);
  
  // Group notifications if enabled
  const groupedNotifications = groupByCategory 
    ? groupNotificationsByCategory(filteredNotifications) 
    : { 'All': filteredNotifications };
  
  // Handle opening/closing
  const toggleOpen = () => {
    setOpen(!open);
    if (showSettings) setShowSettings(false);
  };
  
  // For accessibility - close on escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setShowSettings(false);
    }
  };
  
  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    if (onMarkAllRead) {
      onMarkAllRead();
    } else {
      // Fallback if onMarkAllRead not provided: mark each notification as read
      filteredNotifications.forEach(notification => {
        if (!notification.read) {
          onMarkRead(notification.id);
        }
      });
    }
  };
  
  return (
    <div className="notification-center">
      <button
        ref={buttonRef}
        aria-label="Open notifications"
        aria-expanded={open}
        className="notification-center-btn"
        onClick={toggleOpen}
      >
        <span role="img" aria-label="Notifications">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge" aria-label={`${unreadCount} unread notifications`}>
            {unreadCount}
          </span>
        )}
      </button>
      
      {open && (
        <div 
          ref={dropdownRef}
          className="notification-center-dropdown" 
          role="region" 
          aria-label="Notifications"
          onKeyDown={handleKeyDown}
        >
          {showSettings ? (
            <NotificationSettings onClose={() => setShowSettings(false)} />
          ) : (
            <>
              <div className="notification-center-header">
                <span>Notifications</span>
                <div className="notification-actions">
                  {unreadCount > 0 && (
                    <button 
                      className="mark-all-read-btn"
                      onClick={handleMarkAllAsRead}
                      aria-label="Mark all as read"
                    >
                      Mark all read
                    </button>
                  )}
                  <button 
                    className="settings-btn"
                    onClick={toggleSettings}
                    aria-label="Notification settings"
                  >
                    ⚙️
                  </button>
                  <button 
                    onClick={onClearAll} 
                    className="clear-all-btn"
                    aria-label="Clear all notifications"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="notification-tabs">
                <div 
                  className={`notification-tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                  role="tab"
                  aria-selected={activeTab === 'all'}
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && setActiveTab('all')}
                >
                  All
                </div>
                <div 
                  className={`notification-tab ${activeTab === 'unread' ? 'active' : ''}`}
                  onClick={() => setActiveTab('unread')}
                  role="tab"
                  aria-selected={activeTab === 'unread'}
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && setActiveTab('unread')}
                >
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </div>
              </div>
              
              {/* Notification list */}
              <div className="notification-list">
                {Object.entries(groupedNotifications).map(([category, categoryNotifications]) => (
                  categoryNotifications.length > 0 ? (
                    <div key={category} className="notification-category">
                      {groupByCategory && (
                        <div className="category-header">{category}</div>
                      )}
                      {categoryNotifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                        >
                          <span className="notification-icon" aria-hidden="true">
                            {notification.type === 'success' && '✅'}
                            {notification.type === 'info' && 'ℹ️'}
                            {notification.type === 'warning' && '⚠️'}
                            {notification.type === 'error' && '❌'}
                          </span>
                          <div className="notification-content">
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-actions-row">
                              <span className="notification-time">{notification.timestamp}</span>
                              {!notification.read && (
                                <button
                                  className="mark-read-btn"
                                  onClick={() => onMarkRead(notification.id)}
                                  aria-label="Mark as read"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null
                ))}
                
                {filteredNotifications.length === 0 && (
                  <div className="empty-notifications">
                    {activeTab === 'all' ? 'No notifications yet' : 'No unread notifications'}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
