// Most basic React test in plain JavaScript
const React = require('react');
const { render } = require('@testing-library/react');

describe('Very Simple React Test', () => {
  it('renders a div in plain JS', () => {
    const { container } = render(React.createElement('div', null, 'Simple Test'));
    expect(container.textContent).toBe('Simple Test');
  });
});
