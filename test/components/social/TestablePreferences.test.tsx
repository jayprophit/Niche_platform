import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TestableNotificationPreferences } from './TestableNotificationPreferences';

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

describe('TestableNotificationPreferences', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });
  
  it('renders the main title', () => {
    render(<TestableNotificationPreferences userId="user123" />);
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
  });
  
  it('displays loading state initially', () => {
    render(<TestableNotificationPreferences userId="user123" />);
    expect(screen.getByText('Loading preferences...')).toBeInTheDocument();
  });
  
  it('loads and displays preferences from the API', async () => {
    render(<TestableNotificationPreferences userId="user123" />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading preferences...')).not.toBeInTheDocument();
    });
    
    // Check that all category headers are visible
    expect(screen.getByText('Social Interactions')).toBeInTheDocument();
    expect(screen.getByText('Content Management')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Groups & Events')).toBeInTheDocument();
    expect(screen.getByText('System & Security')).toBeInTheDocument();
    
    // Verify checkbox state matches mock data
    expect(screen.getByLabelText('Reactions to your posts')).toBeChecked();
    expect(screen.getByLabelText('Content reports')).toBeChecked();
    expect(screen.getByLabelText('Direct messages')).not.toBeChecked();
  });
  
  it('calls API with updated preferences when saving', async () => {
    render(<TestableNotificationPreferences userId="user123" />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading preferences...')).not.toBeInTheDocument();
    });
    
    // Toggle a preference
    fireEvent.click(screen.getByLabelText('Direct messages'));
    
    // Click save
    fireEvent.click(screen.getByText('Save Preferences'));
    
    // Verify API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2); // Once for loading, once for saving
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
