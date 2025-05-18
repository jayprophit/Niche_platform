import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from './TestWrapper';

// A very simple component to test with mock hooks
const SimpleComponent = () => {
  return (
    <div>
      <h1>Simple Component</h1>
      <p>This is a simple component for testing.</p>
    </div>
  );
};

describe('Simple Component with Wrapper', () => {
  it('renders correctly with the test wrapper', () => {
    render(
      <TestWrapper>
        <SimpleComponent />
      </TestWrapper>
    );
    
    expect(screen.getByText('Simple Component')).toBeInTheDocument();
    expect(screen.getByText('This is a simple component for testing.')).toBeInTheDocument();
  });
});
