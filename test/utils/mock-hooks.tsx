import React, { useContext } from 'react';
import { ToastContext, NotificationContext } from './test-providers';

// Mock useToast hook that returns the same API as the real hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Mock useNotifications hook that returns the same API as the real hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
