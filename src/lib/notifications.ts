export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export const getNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('app-notifications');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return [];
};

export const addNotification = (title: string, message: string, link?: string) => {
  if (typeof window === 'undefined') return;
  const notifications = getNotifications();
  const newNotification: Notification = {
    id: Date.now().toString(),
    title,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
    link,
  };
  const updated = [newNotification, ...notifications];
  localStorage.setItem('app-notifications', JSON.stringify(updated));
  // Dispatch a custom event so other components can update
  window.dispatchEvent(new Event('app-notifications-updated'));
};

export const markAllAsRead = () => {
  if (typeof window === 'undefined') return;
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, isRead: true }));
  localStorage.setItem('app-notifications', JSON.stringify(updated));
  window.dispatchEvent(new Event('app-notifications-updated'));
};
