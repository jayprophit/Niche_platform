import React from 'react';

// Create contexts and mock providers for testing components that use hooks

// Toast Context Mock
interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const MockToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const mockShowToast = jest.fn();
  
  return (
    <ToastContext.Provider value={{ showToast: mockShowToast }}>
      <div data-testid="mock-toast-provider">
        {children}
      </div>
    </ToastContext.Provider>
  );
};

// Notification Context Mock
interface Notification {
  id: string;
  message: string;
  category?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type']) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

export const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const MockNotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const mockAddNotification = jest.fn();
  const mockMarkRead = jest.fn();
  const mockClearAll = jest.fn();
  
  const mockNotifications: Notification[] = [];
  
  return (
    <NotificationContext.Provider value={{
      notifications: mockNotifications,
      addNotification: mockAddNotification,
      markNotificationAsRead: mockMarkRead,
      clearAllNotifications: mockClearAll
    }}>
      <div data-testid="mock-notification-provider">
        {children}
      </div>
    </NotificationContext.Provider>
  );
};

// Combined provider for testing components that use both providers
export const AllProvidersWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <MockToastProvider>
      <MockNotificationProvider>
        {children}
      </MockNotificationProvider>
    </MockToastProvider>
  );
};

// Custom render for testing-library that wraps in our providers
import { render, RenderOptions } from '@testing-library/react';

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProvidersWrapper, ...options });

export * from '@testing-library/react';
export { customRender as render };
