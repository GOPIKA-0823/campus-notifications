/**
 * API utility for fetching notifications
 */

export interface Notification {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event';
  Message: string;
  Timestamp: string;
}

export interface ApiResponse {
  notifications: Notification[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://4.224.186.213/evaluation-service';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'test-key';

/**
 * Mock notifications for testing when API is unavailable
 */
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    ID: 'd146095a-0d86-4a34-9e69-3900a14576bc',
    Type: 'Result',
    Message: 'mid-sem',
    Timestamp: new Date(Date.now() - 5 * 60000).toISOString().replace('T', ' ').substring(0, 19),
  },
  {
    ID: 'b283218f-ea5a-4b7c-93a9-1f2f240d64b0',
    Type: 'Placement',
    Message: 'CSX Corporation hiring',
    Timestamp: new Date(Date.now() - 10 * 60000).toISOString().replace('T', ' ').substring(0, 19),
  },
  {
    ID: '81589ada-0ad3-4f77-9554-f52fb558e09d',
    Type: 'Event',
    Message: 'farewell',
    Timestamp: new Date(Date.now() - 15 * 60000).toISOString().replace('T', ' ').substring(0, 19),
  },
  {
    ID: '0005513a-142b-4bbc-8678-eefec65e1ede',
    Type: 'Result',
    Message: 'mid-sem',
    Timestamp: new Date(Date.now() - 20 * 60000).toISOString().replace('T', ' ').substring(0, 19),
  },
  {
    ID: 'ea836726-c25e-4f21-a72f-544a6af8a37f',
    Type: 'Result',
    Message: 'project-review',
    Timestamp: new Date(Date.now() - 25 * 60000).toISOString().replace('T', ' ').substring(0, 19),
  },
  {
    ID: '003cb427-8fc6-47f7-bb00-be228f6b0d2c',
    Type: 'Result',
    Message: 'external',
    Timestamp: new Date(Date.now() - 30 * 60000).toISOString().replace('T', ' ').substring(0, 19),
  },
  {
    ID: 'e5c4ff20-31bf-4d40-8f02-72fda59e8918',
    Type: 'Result',
    Message: 'project-review',
    Timestamp: new Date(Date.now() - 35 * 60000).toISOString().replace('T', ' ').substring(0, 19),
  },
  {
    ID: '1cfce5ee-ad37-4894-8946-d707627176a5',
    Type: 'Event',
    Message: 'tech-fest',
    Timestamp: new Date(Date.now() - 40 * 60000).toISOString().replace('T', ' ').substring(0, 19),
  },
  {
    ID: 'cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8',
    Type: 'Result',
    Message: 'project-review',
    Timestamp: new Date(Date.now() - 45 * 60000).toISOString().replace('T', ' ').substring(0, 19),
  },
  {
    ID: '8a7412bd-6065-4d09-8501-a37f11cc848b',
    Type: 'Placement',
    Message: 'Advanced Micro Devices Inc. hiring',
    Timestamp: new Date(Date.now() - 50 * 60000).toISOString().replace('T', ' ').substring(0, 19),
  },
];

/**
 * Fetch notifications from the API
 */
export async function fetchNotifications(
  limit?: number,
  page?: number,
  notificationType?: string
): Promise<Notification[]> {
  try {
    let url = `${API_BASE_URL}/notifications`;
    const params = new URLSearchParams();

    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    if (notificationType) params.append('notification_type', notificationType);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log('Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      console.warn(`API returned ${response.status}: ${response.statusText}`);
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    console.log('API response:', data);
    return data.notifications || [];
  } catch (error) {
    console.error('Error fetching notifications from API:', error);
    console.log('Using mock data for demonstration...');
    
    // Return mock data when API fails (for testing/development)
    let notifications = [...MOCK_NOTIFICATIONS];
    
    // Apply filters if provided
    if (notificationType && notificationType !== 'all') {
      notifications = notifications.filter(n => n.Type === notificationType);
    }
    
    // Apply limit if provided
    if (limit) {
      notifications = notifications.slice(0, limit);
    }
    
    return notifications;
  }
}

/**
 * Calculate priority score for a notification
 */
export function calculatePriorityScore(notification: Notification): number {
  const typeWeights: Record<string, number> = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  const typeWeight = typeWeights[notification.Type] || 0;
  const notificationTime = new Date(notification.Timestamp).getTime();
  const currentTime = new Date().getTime();
  const ageInSeconds = (currentTime - notificationTime) / 1000;
  const hoursAgo = ageInSeconds / 3600;
  const recencyScore = Math.exp(-0.005 * hoursAgo);

  return typeWeight + recencyScore;
}

/**
 * Sort notifications by priority
 */
export function sortByPriority(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);
    return scoreB - scoreA;
  });
}

/**
 * Get top N notifications
 */
export function getTopNotifications(notifications: Notification[], n: number = 10): Notification[] {
  return sortByPriority(notifications).slice(0, n);
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  } catch {
    return timestamp;
  }
}

/**
 * Get color for notification type
 */
export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    Placement: '#4CAF50',
    Result: '#2196F3',
    Event: '#FF9800',
  };
  return colors[type] || '#9E9E9E';
}
