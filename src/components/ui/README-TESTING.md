# Testing the Notification System

This guide provides information on how to properly test the notification system components in the Niche Platform.

## Test Structure

We've created several testing utilities to help test components that use the notification hooks:

### 1. Mock Providers and Hooks

The `test/utils/test-providers.tsx` file contains:
- Mock providers for both Toast and Notification contexts
- A custom render method that wraps components in these providers

```tsx
// Import testing utilities
import { render, screen } from '../../test/utils/test-providers';

// Test a component that uses the notification hooks
it('renders with notification hooks', () => {
  render(<YourComponent />);
  // Your test assertions...
});
```

### 2. Simplified Test Components

For complex components, we've created simplified testable versions:

- `TestableNotificationPreferences.tsx` - A simpler version of NotificationPreferences without hook dependencies

## Testing Best Practices

1. **Use Simplified Components**: When testing complex components that use multiple hooks and providers, consider creating simplified test-specific versions.

2. **Mock External Hooks**: Always mock hooks from external context providers:

```tsx
// Mock hooks at the top of your test file
jest.mock('../../../src/components/ui/ToastProvider', () => ({
  useToast: () => ({ showToast: jest.fn() })
}));

jest.mock('../../../src/components/ui/NotificationContextProvider', () => ({
  useNotifications: () => ({ addNotification: jest.fn() })
}));
```

3. **Mock Fetch Calls**: Create mock implementations for API calls:

```tsx
const mockFetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ /* mock data */ })
  })
);

global.fetch = mockFetch;
```

4. **Test Isolated Functionality**: Test small pieces of functionality to keep tests focused and maintainable.

## Troubleshooting Common Issues

1. **"Unexpected token '<'"**: This error typically means JSX/TSX isn't being properly transformed. Check the Jest configuration.

2. **Missing Context Provider**: If you see errors about hooks not being used within providers, use the test-providers helpers.

3. **Test Times Out**: Use `waitFor` to wait for asynchronous operations like API calls:

```tsx
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

## Running Tests

Run tests using the following commands:

```bash
# Run all tests
npm test

# Run specific tests
npx jest path/to/test-file.test.tsx

# Run tests with coverage
npm test -- --coverage
```

Remember that well-written tests help maintain code quality and provide confidence when adding new features or refactoring existing code.
