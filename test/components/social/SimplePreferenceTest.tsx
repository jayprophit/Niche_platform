import React from 'react';
import { render, screen } from '@testing-library/react';

// A very simple component to test
const SimplePreference = () => {
  return (
    <div>
      <h1>Notification Preferences</h1>
      <div>
        <label>
          <input type="checkbox" />
          Enable notifications
        </label>
      </div>
    </div>
  );
};

// Export the component for testing
export default SimplePreference;
