import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationPreferences } from '../../../src/components/social/NotificationPreferences';

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

describe('NotificationPreferences edge cases', () => {
  const userId = 'user-edge';

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('handles missing userId', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Missing userId' }),
      status: 400
    });
    render(<NotificationPreferences userId={''} onSave={jest.fn()} />);
    await waitFor(() => expect(screen.getByText(/could not load/i)).toBeInTheDocument());
  });

  it('shows error on non-boolean preference', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ reactions: true, shares: true, reports: true, messages: true, follows: true }) });
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Invalid value for reactions: must be boolean' }), status: 400 });
    render(<NotificationPreferences userId={userId} onSave={jest.fn()} />);
    await waitFor(() => expect(screen.getByLabelText(/Reactions to your posts/i)).toBeChecked());
    // Simulate a PUT with a non-boolean value
    fireEvent.click(screen.getByText(/Save Preferences/i));
    await waitFor(() => expect(screen.getByText(/failed to save/i)).toBeInTheDocument());
  });

  it('handles server error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Server error' }), status: 500 });
    render(<NotificationPreferences userId={userId} onSave={jest.fn()} />);
    await waitFor(() => expect(screen.getByText(/could not load/i)).toBeInTheDocument());
  });
});
