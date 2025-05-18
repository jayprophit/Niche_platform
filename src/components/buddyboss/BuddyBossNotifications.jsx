/**
 * BuddyBoss-style notification system
 * Implements notification functionality for the social networking platform
 */

import React, { useState, useEffect } from 'react';

/**
 * Notification center component
 */
export function NotificationCenter({ notifications = [], onMarkAsRead, onMarkAllAsRead }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };
  
  const handleMarkAllAsRead = () => {
    onMarkAllAsRead && onMarkAllAsRead();
  };
  
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  return (
    <div className="bb-notification-center">
      <button 
        className="bb-notification-trigger" 
        onClick={toggleNotifications}
      >
        <span className="bb-icon-bell"></span>
        {unreadCount > 0 && (
          <span className="bb-notification-badge">{unreadCount}</span>
        )}
      </button>
      
      {isOpen && (
        <div className="bb-notification-dropdown">
          <div className="bb-notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="bb-mark-all-read"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="bb-notification-list">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <NotificationItem 
                  key={index} 
                  notification={notification} 
                  onMarkAsRead={onMarkAsRead}
                />
              ))
            ) : (
              <div className="bb-notification-empty">
                <p>No notifications yet</p>
              </div>
            )}
          </div>
          
          <div className="bb-notification-footer">
            <a href="/notifications" className="bb-view-all">View all notifications</a>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual notification item
 */
function NotificationItem({ notification, onMarkAsRead }) {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead && onMarkAsRead(notification.id);
    }
    // Navigate to the notification target
    window.location.href = notification.link;
  };
  
  return (
    <div 
      className={`bb-notification-item ${!notification.isRead ? 'bb-notification-unread' : ''}`}
      onClick={handleClick}
    >
      <div className="bb-notification-avatar">
        <img 
          src={notification.actor.avatar || '/default-avatar.jpg'} 
          alt={notification.actor.name} 
        />
      </div>
      
      <div className="bb-notification-content">
        <div className="bb-notification-text" dangerouslySetInnerHTML={{ __html: notification.content }}></div>
        <div className="bb-notification-time">{notification.timeAgo}</div>
      </div>
      
      {notification.image && (
        <div className="bb-notification-image">
          <img src={notification.image} alt="" />
        </div>
      )}
    </div>
  );
}

/**
 * Friend request notification component
 */
export function FriendRequestNotification({ request, onAccept, onReject }) {
  return (
    <div className="bb-friend-request">
      <div className="bb-request-avatar">
        <img 
          src={request.sender.avatar || '/default-avatar.jpg'} 
          alt={request.sender.name} 
        />
      </div>
      
      <div className="bb-request-content">
        <div className="bb-request-text">
          <strong>{request.sender.name}</strong> sent you a friend request
        </div>
        <div className="bb-request-time">{request.timeAgo}</div>
        
        <div className="bb-request-actions">
          <button 
            className="bb-button bb-button-primary bb-button-sm"
            onClick={() => onAccept(request.id)}
          >
            Accept
          </button>
          <button 
            className="bb-button bb-button-sm"
            onClick={() => onReject(request.id)}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Toast notification component for real-time alerts
 */
export function ToastNotification({ notification, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);
  
  return (
    <div className={`bb-toast-notification bb-toast-${notification.type || 'info'}`}>
      <div className="bb-toast-icon">
        {notification.type === 'success' && <span className="bb-icon-check-circle"></span>}
        {notification.type === 'error' && <span className="bb-icon-alert-circle"></span>}
        {notification.type === 'warning' && <span className="bb-icon-alert-triangle"></span>}
        {notification.type === 'info' && <span className="bb-icon-info"></span>}
      </div>
      
      <div className="bb-toast-content">
        {notification.title && (
          <div className="bb-toast-title">{notification.title}</div>
        )}
        <div className="bb-toast-message">{notification.message}</div>
      </div>
      
      <button 
        className="bb-toast-close"
        onClick={() => onClose(notification.id)}
      >
        <span className="bb-icon-x"></span>
      </button>
    </div>
  );
}

/**
 * Toast notification container for managing multiple toasts
 */
export function ToastContainer({ toasts = [], onClose }) {
  return (
    <div className="bb-toast-container">
      {toasts.map((toast) => (
        <ToastNotification 
          key={toast.id} 
          notification={toast} 
          onClose={onClose} 
        />
      ))}
    </div>
  );
}

/**
 * Activity notification feed component
 */
export function ActivityNotificationFeed({ notifications = [] }) {
  return (
    <div className="bb-activity-notification-feed">
      <h3>Recent Activity</h3>
      
      <div className="bb-activity-notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="bb-activity-notification-item">
              <div className="bb-activity-notification-avatar">
                <img 
                  src={notification.actor.avatar || '/default-avatar.jpg'} 
                  alt={notification.actor.name} 
                />
              </div>
              
              <div className="bb-activity-notification-content">
                <div className="bb-activity-notification-text" dangerouslySetInnerHTML={{ __html: notification.content }}></div>
                <div className="bb-activity-notification-time">{notification.timeAgo}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="bb-activity-notification-empty">
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default {
  NotificationCenter,
  FriendRequestNotification,
  ToastNotification,
  ToastContainer,
  ActivityNotificationFeed
};
