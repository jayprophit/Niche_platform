import React from 'react';
import { render } from '@testing-library/react';

describe('Minimal React Test', () => {
  it('renders a div', () => {
    const { container } = render(<div>Test</div>);
    expect(container.firstChild).toBeTruthy();
    expect(container.textContent).toBe('Test');
  });
});
