import React from 'react';
import { render, screen } from '@testing-library/react';
import { SimpleComponent } from './SimpleComponent';

describe('SimpleComponent', () => {
  it('renders with provided text', () => {
    const testText = 'Hello, world!';
    render(<SimpleComponent text={testText} />);
    expect(screen.getByTestId('simple-component')).toHaveTextContent(testText);
  });
});
