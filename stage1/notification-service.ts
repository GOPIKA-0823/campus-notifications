import { logger } from './logger';

/**
 * Notification interface matching API response
 */
interface Notification {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event';
  Message: string;
  Timestamp: string;
}

/**
 * NotificationWithScore includes computed priority score
 */
interface NotificationWithScore extends Notification {
  score: number;
  recencyScore: number;
  typeWeight: number;
}

/**
 * Priority Inbox Manager using Min-Heap for efficient top-k maintenance
 */
class PriorityInboxManager {
  private heap: NotificationWithScore[] = [];
  private maxSize: number = 10;
  private typeWeights: Record<string, number> = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
    logger.info('PriorityInboxManager', `Initialized with max size: ${maxSize}`);
  }

  /**
   * Calculate recency score based on timestamp
   * More recent = higher score
   */
  private calculateRecencyScore(timestamp: string): number {
    const notificationTime = new Date(timestamp).getTime();
    const currentTime = new Date().getTime();
    const ageInSeconds = (currentTime - notificationTime) / 1000;
    
    // Exponential decay: recent notifications get higher scores
    // Score decays by 0.5% per hour
    const hoursAgo = ageInSeconds / 3600;
    const recencyScore = Math.exp(-0.005 * hoursAgo);
    
    logger.debug('PriorityInboxManager', 'Recency score calculated', {
      timestamp,
      hoursAgo: hoursAgo.toFixed(2),
      recencyScore: recencyScore.toFixed(4),
    });
    
    return recencyScore;
  }

  /**
   * Calculate priority score: combines type weight and recency
   */
  private calculateScore(notification: Notification): number {
    const typeWeight = this.typeWeights[notification.Type] || 0;
    const recencyScore = this.calculateRecencyScore(notification.Timestamp);
    const totalScore = typeWeight + recencyScore;
    
    return totalScore;
  }

  /**
   * Add a notification to the priority inbox
   * Uses min-heap to efficiently maintain top-k notifications
   */
  addNotification(notification: Notification): void {
    const score = this.calculateScore(notification);
    const notificationWithScore: NotificationWithScore = {
      ...notification,
      score,
      recencyScore: this.calculateRecencyScore(notification.Timestamp),
      typeWeight: this.typeWeights[notification.Type] || 0,
    };

    logger.debug('PriorityInboxManager', 'Adding notification', {
      id: notification.ID,
      type: notification.Type,
      message: notification.Message,
      score: score.toFixed(4),
    });

    if (this.heap.length < this.maxSize) {
      // If heap is not full, add directly
      this.heap.push(notificationWithScore);
      this.bubbleUp(this.heap.length - 1);
      logger.info('PriorityInboxManager', `Notification added. Heap size: ${this.heap.length}`);
    } else if (score > this.heap[0].score) {
      // If new score is better than the worst (root), replace it
      this.heap[0] = notificationWithScore;
      this.bubbleDown(0);
      logger.info('PriorityInboxManager', `Notification replaced. Top notification score updated.`);
    } else {
      logger.debug('PriorityInboxManager', 'Notification not added (lower priority than current top 10)');
    }
  }

  /**
   * Bubble up operation for min-heap
   */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].score < this.heap[parentIndex].score) {
        [this.heap[index], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[index],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * Bubble down operation for min-heap
   */
  private bubbleDown(index: number): void {
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (
        leftChild < this.heap.length &&
        this.heap[leftChild].score < this.heap[smallest].score
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < this.heap.length &&
        this.heap[rightChild].score < this.heap[smallest].score
      ) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [
          this.heap[smallest],
          this.heap[index],
        ];
        index = smallest;
      } else {
        break;
      }
    }
  }

  /**
   * Get top-n notifications sorted by score (descending)
   */
  getTopNotifications(n: number = 10): NotificationWithScore[] {
    logger.info('PriorityInboxManager', `Retrieving top ${n} notifications`);
    
    // Sort heap in descending order by score
    const sorted = [...this.heap].sort((a, b) => b.score - a.score);
    const top = sorted.slice(0, n);
    
    logger.info('PriorityInboxManager', `Returning ${top.length} notifications`);
    
    return top;
  }

  /**
   * Get all notifications in priority order
   */
  getAllNotifications(): NotificationWithScore[] {
    return this.getTopNotifications(this.heap.length);
  }

  /**
   * Get current heap size
   */
  getHeapSize(): number {
    return this.heap.length;
  }
}

/**
 * Notification Service
 */
class NotificationService {
  private manager: PriorityInboxManager;
  private readonly API_URL = 'http://4.224.186.213/evaluation-service/notifications';
  private readonly API_KEY = process.env.API_KEY || 'test-api-key';

  constructor(topK: number = 10) {
    this.manager = new PriorityInboxManager(topK);
    logger.info('NotificationService', `Initialized with top-${topK} notification tracking`);
  }

  /**
   * Fetch notifications from API
   */
  async fetchNotifications(): Promise<Notification[]> {
    logger.info('NotificationService', `Fetching notifications from ${this.API_URL}`);
    
    try {
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
      });

      if (!response.ok) {
        logger.error('NotificationService', `API returned status ${response.status}`);
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const notifications: Notification[] = data.notifications || [];
      
      logger.info('NotificationService', `Fetched ${notifications.length} notifications`);
      
      return notifications;
    } catch (error) {
      logger.error('NotificationService', 'Error fetching notifications', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Process notifications and return top-10
   */
  async getTopPriorityNotifications(limit: number = 10): Promise<NotificationWithScore[]> {
    logger.info('NotificationService', `Getting top ${limit} priority notifications`);
    
    try {
      const notifications = await this.fetchNotifications();
      
      logger.info('NotificationService', `Processing ${notifications.length} notifications`);
      
      // Add each notification to the manager
      for (const notification of notifications) {
        this.manager.addNotification(notification);
      }

      const topNotifications = this.manager.getTopNotifications(limit);
      
      logger.info(
        'NotificationService',
        `Successfully retrieved top ${topNotifications.length} notifications`
      );
      
      return topNotifications;
    } catch (error) {
      logger.error('NotificationService', 'Error processing notifications', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get manager for advanced operations
   */
  getManager(): PriorityInboxManager {
    return this.manager;
  }
}

// Main execution
async function main() {
  logger.info('Main', '=== Campus Notifications Priority Inbox ===');
  
  const service = new NotificationService(10);

  try {
    const topNotifications = await service.getTopPriorityNotifications(10);

    logger.info('Main', '=== TOP 10 PRIORITY NOTIFICATIONS ===');
    console.log('\n');
    
    topNotifications.forEach((notif, index) => {
      const scorePercent = (notif.score * 100).toFixed(1);
      logger.info(
        'Main',
        `#${index + 1} [${notif.Type}] ${notif.Message}`,
        {
          id: notif.ID,
          timestamp: notif.Timestamp,
          totalScore: parseFloat(notif.score.toFixed(4)),
          typeWeight: notif.typeWeight,
          recencyScore: parseFloat(notif.recencyScore.toFixed(4)),
          scorePercent: `${scorePercent}%`,
        }
      );
      console.log(
        `  ${index + 1}. [${notif.Type}] ${notif.Message} (Score: ${notif.score.toFixed(4)})`
      );
      console.log(`     ID: ${notif.ID}`);
      console.log(`     Timestamp: ${notif.Timestamp}`);
      console.log();
    });

    logger.info('Main', 'Priority inbox processed successfully');
  } catch (error) {
    logger.error('Main', 'Failed to process notifications', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// Run the application
main().catch((error) => {
  logger.error('Main', 'Uncaught error', {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});

export { NotificationService, PriorityInboxManager, Notification };
