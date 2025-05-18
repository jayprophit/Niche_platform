import React from 'react';
import { render, screen } from '@testing-library/react';
import SimplePreference from './SimplePreferenceTest';

describe('SimplePreference', () => {
  it('renders without crashing', () => {
    render(<SimplePreference />);
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
  });
  
  it('has a checkbox', () => {
    render(<SimplePreference />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});
