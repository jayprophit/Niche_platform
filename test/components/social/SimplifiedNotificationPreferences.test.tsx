import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { NotificationPreferences } from '../../../src/components/social/NotificationPreferences';

// Mock the required hooks and components
jest.mock('../../../src/components/ui/ToastProvider', () => ({
  useToast: () => ({ showToast: jest.fn() })
}));

jest.mock('../../../src/components/ui/NotificationContextProvider', () => ({
  useNotifications: () => ({ addNotification: jest.fn() })
}));

jest.mock('../../../src/components/social/NotificationIcons', () => ({
  icons: {
    reactions: '👍',
    shares: '📤',
    comments: '💬',
    mentions: '@',
    follows: '👥',
    reports: '🚩',
    contentApproved: '✅',
    contentRejected: '❌',
    messages: '✉️',
    groupMessages: '👥✉️',
    groupInvites: '📨',
    groupUpdates: '📢',
    eventReminders: '🔔',
    eventRSVP: '📝',
    accountSecurity: '🔒',
    platformUpdates: '🔄'
  }
}));

// Mock fetch
const mockFetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      reactions: true,
      shares: true,
      comments: true,
      mentions: false,
      follows: true,
      reports: true,
      contentApproved: false,
      contentRejected: true,
      messages: false,
      groupMessages: true,
      groupInvites: false,
      groupUpdates: true,
      eventReminders: false,
      eventRSVP: true,
      accountSecurity: false,
      platformUpdates: true
    })
  })
);

global.fetch = mockFetch;

describe('NotificationPreferences', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });
  
  it('renders the title correctly', async () => {
    render(<NotificationPreferences userId="user123" />);
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
  });
  
  it('renders category section headers', async () => {
    render(<NotificationPreferences userId="user123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Social Interactions')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Content Management')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Groups & Events')).toBeInTheDocument();
    expect(screen.getByText('System & Security')).toBeInTheDocument();
  });
});
