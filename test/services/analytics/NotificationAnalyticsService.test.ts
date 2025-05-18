import { NotificationAnalyticsService } from '../../../src/services/analytics/NotificationAnalyticsService';

describe('NotificationAnalyticsService', () => {
  it('tracks notification events', () => {
    const spy = jest.spyOn(NotificationAnalyticsService, 'trackNotificationEvent');
    NotificationAnalyticsService.trackNotificationEvent('received');
    expect(spy).toHaveBeenCalledWith('received');
  });

  it('queues events for server sync', () => {
    NotificationAnalyticsService.eventQueue = [];
    NotificationAnalyticsService.trackNotificationEvent('clicked');
    expect(NotificationAnalyticsService.eventQueue.length).toBeGreaterThan(0);
    expect(NotificationAnalyticsService.eventQueue[0].event).toBe('clicked');
  });
});
