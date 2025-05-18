import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test/utils/test-providers';
import { NotificationPreferences } from '../../../src/components/social/NotificationPreferences';

// Replace the real hooks with our mock hooks
jest.mock('../../../src/components/ui/ToastProvider', () => {
  return {
    useToast: jest.requireActual('../../../test/utils/mock-hooks').useToast
  };
});

jest.mock('../../../src/components/ui/NotificationContextProvider', () => {
  return {
    useNotifications: jest.requireActual('../../../test/utils/mock-hooks').useNotifications
  };
});

// Mock icons to avoid issues with rendering
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
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('NotificationPreferences', () => {
  // Add a sanity test to verify the component renders
  it('renders without crashing', () => {
    render(<NotificationPreferences userId="user123" />);
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
  });
  
  const userId = 'user123';
  const mockPrefs = {
    // Social Interactions
    reactions: true,
    shares: false,
    comments: true,
    mentions: false,
    follows: true,
    
    // Content Management
    reports: true,
    contentApproved: false,
    contentRejected: true,
    
    // Messages
    messages: false,
    groupMessages: true,
    
    // Groups & Events
    groupInvites: false,
    groupUpdates: true,
    eventReminders: false,
    eventRSVP: true,
    
    // System & Security
    accountSecurity: false,
    platformUpdates: true
  };

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('loads and displays preferences', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrefs
    });
    
    render(<NotificationPreferences userId={userId} />);
    
    // Check for loading state first
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    
    // Check that all categories are rendered after loading
    await waitFor(() => {
      expect(screen.getByText('Social Interactions')).toBeInTheDocument();
      expect(screen.getByText('Content Management')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();
      expect(screen.getByText('Groups & Events')).toBeInTheDocument();
      expect(screen.getByText('System & Security')).toBeInTheDocument();
    });
    
    // Verify some of the preference checkboxes are checked based on mockPrefs
    expect(screen.getByLabelText(/Reactions to your posts/i)).toBeChecked();
    expect(screen.getByLabelText(/Shares of your posts/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Comments on your posts/i)).toBeChecked();
  });

  it('saves preferences', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrefs
    });
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
    
    render(<NotificationPreferences userId={userId} />);
    
    await waitFor(() => expect(screen.getByText('Social Interactions')).toBeInTheDocument());
    
    // Toggle a preference
    fireEvent.click(screen.getByLabelText(/Shares of your posts/i));
    
    // Click save
    fireEvent.click(screen.getByText(/Save Preferences/i));
    
    // Check that success message appears
    await waitFor(() => {
      expect(screen.getByText(/have been saved/i)).toBeInTheDocument();
    });
    
    // Verify API was called
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/user_notification-preferences?userId='),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' })
      })
    );
  });
});
