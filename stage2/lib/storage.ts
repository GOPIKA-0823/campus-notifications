/**
 * Local storage utility for tracking viewed notifications
 */

const VIEWED_KEY = 'viewed_notifications';

export function getViewedNotifications(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  
  const stored = localStorage.getItem(VIEWED_KEY);
  return new Set(stored ? JSON.parse(stored) : []);
}

export function setNotificationAsViewed(notificationId: string): void {
  if (typeof window === 'undefined') return;
  
  const viewed = getViewedNotifications();
  viewed.add(notificationId);
  localStorage.setItem(VIEWED_KEY, JSON.stringify(Array.from(viewed)));
}

export function isNotificationViewed(notificationId: string): boolean {
  return getViewedNotifications().has(notificationId);
}

export function clearViewedNotifications(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(VIEWED_KEY);
}
