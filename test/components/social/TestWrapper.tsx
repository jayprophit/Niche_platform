import React from 'react';

// Create mock context values
const mockToastValue = {
  showToast: jest.fn(),
};

const mockNotificationValue = {
  notifications: [],
  addNotification: jest.fn(),
  markNotificationAsRead: jest.fn(),
  clearAllNotifications: jest.fn(),
};

// Create mock contexts
export const MockToastContext = React.createContext(mockToastValue);
export const MockNotificationContext = React.createContext(mockNotificationValue);

// Mock hooks
export const MockToastProvider = ({ children }: { children: React.ReactNode }) => (
  <MockToastContext.Provider value={mockToastValue}>
    {children}
  </MockToastContext.Provider>
);

export const MockNotificationProvider = ({ children }: { children: React.ReactNode }) => (
  <MockNotificationContext.Provider value={mockNotificationValue}>
    {children}
  </MockNotificationContext.Provider>
);

// Combined test wrapper
export const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MockToastProvider>
    <MockNotificationProvider>
      {children}
    </MockNotificationProvider>
  </MockToastProvider>
);
