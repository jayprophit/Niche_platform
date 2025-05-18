import { render, act } from '@testing-library/react';
import NotificationSounds from '../../../src/components/ui/NotificationSounds';

// Mock Audio API
global.HTMLAudioElement = class {
  play = jest.fn();
  pause = jest.fn();
  load = jest.fn();
  set src(_url: string) {}
  get src() { return ''; }
  volume = 1;
} as any;

describe('NotificationSounds', () => {
  it('plays the correct sound for notification type', () => {
    const { getByTestId } = render(<NotificationSounds />);
    // Simulate a notification event (assuming NotificationSounds exposes a test button or method)
    // This is a placeholder: adapt to your actual API
    act(() => {
      // @ts-ignore
      window.dispatchEvent(new CustomEvent('play-notification-sound', { detail: { type: 'success' } }));
    });
    // Check that play was called
    expect(global.HTMLAudioElement.prototype.play).toHaveBeenCalled();
  });
});
