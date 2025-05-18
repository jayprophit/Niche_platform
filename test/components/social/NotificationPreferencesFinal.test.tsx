import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestWrapper } from './TestWrapper';
import { NotificationPreferences } from '../../../src/components/social/NotificationPreferences';

// Mock the icons import
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

// Mock the hooks
jest.mock('../../../src/components/ui/ToastProvider', () => ({
  useToast: () => ({ showToast: jest.fn() })
}));

jest.mock('../../../src/components/ui/NotificationContextProvider', () => ({
  useNotifications: () => ({ addNotification: jest.fn() })
}));

// Mock fetch
const mockFetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      reactions: true,
      shares: false,
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
  
  it('renders the main title', async () => {
    render(
      <TestWrapper>
        <NotificationPreferences userId="user123" />
      </TestWrapper>
    );
    
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
  });
  
  it('loads and displays preferences from the API', async () => {
    render(
      <TestWrapper>
        <NotificationPreferences userId="user123" />
      </TestWrapper>
    );
    
    // Check that fetch was called with the correct URL
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/user_notification-preferences?userId=user123')
    );
    
    // Wait for category headers to appear (indicating data is loaded)
    await waitFor(() => {
      expect(screen.getByText('Social Interactions')).toBeInTheDocument();
    });
    
    // Verify all category sections are displayed
    expect(screen.getByText('Content Management')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Groups & Events')).toBeInTheDocument();
    expect(screen.getByText('System & Security')).toBeInTheDocument();
  });
  
  it('handles save preferences flow', async () => {
    render(
      <TestWrapper>
        <NotificationPreferences userId="user123" />
      </TestWrapper>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Social Interactions')).toBeInTheDocument();
    });
    
    // Click the save button
    fireEvent.click(screen.getByText('Save Preferences'));
    
    // Check that the second fetch (for saving) was called correctly
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/api/user_notification-preferences?userId=user123'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' })
        })
      );
    });
  });
});
