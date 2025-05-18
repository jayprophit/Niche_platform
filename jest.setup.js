// Import jest-dom extensions
require('@testing-library/jest-dom');

// Mock fetch globally
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Suppress React 18 console errors about act()
const originalError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning: ReactDOM.render is no longer supported/.test(args[0])
  ) {
    return;
  }
  originalError.call(console, ...args);
};
