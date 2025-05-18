// jest.setup.tsx - Setup file for Jest tests with React/Testing Library
import '@testing-library/jest-dom';

// Mock the local storage API
class LocalStorageMock {
  private store: Record<string, string>;

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

// Set up localStorage mock
global.localStorage = new LocalStorageMock();

// Mock fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }) as unknown as Promise<Response>
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
