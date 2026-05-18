# Stage 1: Priority Inbox System Design

## Executive Summary

The Campus Notification Platform generates a high volume of notifications across different categories (Placements, Results, Events). To help users focus on the most important updates, we implemented a **Priority Inbox System** that maintains and displays the top-10 most important unread notifications based on a combination of notification type weight and recency.

## Problem Statement

- **Challenge**: Users lose track of important notifications due to high volume
- **Solution**: Implement a priority-based notification filtering system
- **Scope**: Display top-10 notifications to users based on importance

## Architecture Overview

### 1. Core Components

#### 1.1 Logging Middleware (`logger.ts`)
- **Purpose**: Centralized logging for all operations
- **Features**:
  - Multiple log levels: DEBUG, INFO, WARN, ERROR
  - Color-coded console output for readability
  - Timestamp and module tracking
  - Data context logging

#### 1.2 Notification Service (`notification-service.ts`)
- **Purpose**: Manage notification retrieval and priority processing
- **Key Classes**:
  - `PriorityInboxManager`: Manages top-K notifications using Min-Heap
  - `NotificationService`: Interfaces with the Notification API
  - Comprehensive logging at every step

#### 1.3 Notification Model
```typescript
interface Notification {
  ID: string;              // Unique identifier
  Type: 'Placement' | 'Result' | 'Event';
  Message: string;         // Notification content
  Timestamp: string;       // ISO format timestamp
}

interface NotificationWithScore extends Notification {
  score: number;           // Final priority score
  recencyScore: number;    // Recency component
  typeWeight: number;      // Type-based weight
}
```

## Priority Scoring Algorithm

### 2.1 Score Composition

Each notification receives a **composite score** calculated as:

```
Total Score = Type Weight + Recency Score
```

#### Type Weights (Deterministic)
- **Placement**: 3.0 (Highest priority - career opportunity)
- **Result**: 2.0 (Medium priority - academic)
- **Event**: 1.0 (Lowest priority - informational)

#### Recency Score (Dynamic)
Uses exponential decay based on how recently the notification was created:

```
Recency Score = e^(-0.005 × hours_ago)

Where:
- e = Euler's number (2.71828)
- hours_ago = Time elapsed since notification timestamp
- Decay factor = 0.005 (0.5% per hour)
```

**Characteristics**:
- **Now**: Score ≈ 1.0
- **1 hour ago**: Score ≈ 0.995
- **1 day ago**: Score ≈ 0.88
- **1 week ago**: Score ≈ 0.42
- **1 month ago**: Score ≈ 0.14

### 2.2 Scoring Example

**Example Calculation**:

| Notification | Type | Hours Ago | Type Weight | Recency Score | Total Score |
|--------------|------|-----------|-------------|---------------|-------------|
| Placement A  | Placement | 0.5 | 3.0 | 0.9975 | 3.9975 |
| Result B     | Result | 0.1 | 2.0 | 0.9995 | 2.9995 |
| Event C      | Event | 0 | 1.0 | 1.0000 | 2.0000 |
| Result D     | Result | 2 | 2.0 | 0.9900 | 2.9900 |

**Sorted by Priority**: Placement A → Result B → Result D → Event C

## Efficient Maintenance of Top-10: Min-Heap Algorithm

### 3.1 Why Min-Heap?

Traditional approach (sorting all notifications each time):
- **Time Complexity**: O(n log n) per update
- **Space Complexity**: O(n)
- **Problem**: Inefficient for continuous updates

Min-Heap approach:
- **Time Complexity**: O(log 10) ≈ O(1) per update
- **Space Complexity**: O(10) constant
- **Benefit**: Scales perfectly as n grows

### 3.2 Implementation Strategy

```
Min-Heap Structure (Size = 10):
┌─────────────────────────┐
│   Worst Notification    │ (Root - smallest score)
├─────────────────────────┤
│   Better Notifications  │ (Left subtree)
├─────────────────────────┤
│   Better Notifications  │ (Right subtree)
└─────────────────────────┘
```

#### Algorithm Steps:

1. **When heap size < 10**:
   - Add new notification
   - Bubble Up: Move higher-scored items toward root
   - Maintain min-heap property

2. **When heap size = 10**:
   - Compare new score with root (worst notification)
   - **If new score > root score**:
     - Replace root with new notification
     - Bubble Down: Restore min-heap property
   - **Else**: Ignore (not important enough for top-10)

### 3.3 Operations Complexity

| Operation | Time Complexity | Space |
|-----------|-----------------|-------|
| Add to heap | O(log 10) ≈ O(1) | O(10) |
| Get top-10 | O(10 log 10) ≈ O(1) | O(10) |
| Total with API fetch | O(n + 10 log 10) | O(n + 10) |

### 3.4 Handling New Notifications

```
New Notification Arrives
        ↓
   Calculate Score
        ↓
  Is heap full?
   ↙          ↘
  NO          YES
  ↓            ↓
Add &      Is score > min?
BubbleUp   ↙         ↘
           YES         NO
           ↓           ↓
        Replace    Discard
         & Bubble
         Down
```

## Data Flow

```
Notification API
        ↓
[Fetch Notifications]
        ↓
[For each notification]
├─ Calculate Type Weight
├─ Calculate Recency Score
├─ Combine into Total Score
└─ Add to Min-Heap (Top-10 Maintenance)
        ↓
[Retrieve Top-10]
        ↓
[Sort by Score (Descending)]
        ↓
[Display to User]
```

## Logging Strategy

Every operation logs extensively through the Logging Middleware:

1. **Initialization**: Service startup and configuration
2. **API Calls**: Request attempts and responses
3. **Scoring**: Each notification's score calculation
4. **Heap Operations**: Add, bubble up/down operations
5. **Results**: Final top-10 list

**Sample Log Output**:
```
[2026-05-18T10:30:45.123Z] [INFO] [NotificationService] Fetched 10 notifications
[2026-05-18T10:30:45.234Z] [DEBUG] [PriorityInboxManager] Recency score calculated
  {
    "timestamp": "2026-04-22 17:51:30",
    "hoursAgo": "0.00",
    "recencyScore": "0.9999"
  }
[2026-05-18T10:30:45.345Z] [INFO] [PriorityInboxManager] Notification added. Heap size: 1
[2026-05-18T10:30:45.890Z] [INFO] [Main] #1 [Placement] CSX Corporation hiring
  {
    "id": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
    "totalScore": 3.9999,
    "typeWeight": 3,
    "recencyScore": 0.9999
  }
```

## Performance Characteristics

### Time Complexity Analysis
- **Single Notification Processing**: O(log 10) ≈ O(1)
- **Process N notifications**: O(n log 10) ≈ O(n)
- **API fetch time**: Dominates (network I/O)

### Space Complexity Analysis
- **Min-Heap**: O(10) constant
- **Notification storage**: O(n) for temporary API response
- **Total**: O(n) where n = API response size

### Scalability
- ✅ **New notifications**: Efficiently added at O(log 10)
- ✅ **Growing API response**: Linear time, constant heap space
- ✅ **Configurable top-K**: Simply adjust heap size
- ✅ **Real-time updates**: Min-heap enables live feeds

## API Integration

### Endpoint Used
```
GET http://4.224.186.213/evaluation-service/notifications
Headers: Authorization: Bearer {API_KEY}
Response: 200 OK
```

### Response Structure
```json
{
  "notifications": [
    {
      "ID": "unique-id",
      "Type": "Placement",
      "Message": "notification content",
      "Timestamp": "2026-04-22 17:51:30"
    }
  ]
}
```

## Error Handling

1. **API Errors**: Log and throw with context
2. **Invalid Data**: Validate notification structure
3. **Network Issues**: Graceful degradation with logging
4. **Malformed Timestamps**: Default to current time

## Usage

### Compilation and Execution
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Run the service
npm start

# Development mode with ts-node
npm run dev
```

### Output Example
```
=== Campus Notifications Priority Inbox ===
=== TOP 10 PRIORITY NOTIFICATIONS ===

#1. [Placement] CSX Corporation hiring (Score: 3.9999)
     ID: b283218f-ea5a-4b7c-93a9-1f2f240d64b0
     Timestamp: 2026-04-22 17:51:18

#2. [Result] mid-sem (Score: 2.9998)
     ID: d146095a-0d86-4a34-9e69-3900a14576bc
     Timestamp: 2026-04-22 17:51:30
...
```

## Future Enhancements

1. **Persistent Storage**: Cache top-10 in database for faster retrieval
2. **User Preferences**: Allow users to adjust type weights
3. **Machine Learning**: Learn weight thresholds from user interactions
4. **Notification Read Status**: Track which notifications user has seen
5. **Batching**: Process notifications in batches for high-volume scenarios
6. **TTL (Time-to-Live)**: Auto-expire old notifications
7. **Customizable Recency**: Adjust decay factor per notification type
8. **Distributed System**: Use consistent hashing for multi-server deployment

## Conclusion

The Priority Inbox System uses a **Min-Heap based approach** combined with a **composite scoring algorithm** to efficiently maintain the top-10 most important notifications. This design:

- ✅ Handles high notification volume efficiently
- ✅ Combines importance (type) with urgency (recency)
- ✅ Scales to millions of notifications with constant top-K space
- ✅ Provides comprehensive logging for debugging
- ✅ Enables real-time notification updates
- ✅ Maintains production-grade code quality

The solution prioritizes **Placements > Results > Events** while giving more weight to recent notifications, ensuring users never miss critical updates even in a high-volume notification environment.
