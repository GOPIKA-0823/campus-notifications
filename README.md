# Campus Hiring Evaluation - Afford Medical Technologies

**Confidential Document - For Evaluation Purposes Only**

This repository contains the solution for the Campus Hiring Evaluation - Frontend assessment conducted by Afford Medical Technologies.

## Project Overview

This project implements a **Campus Notifications Platform** with two main components:

### Stage 1: Priority Inbox System
- **Location**: `/stage1/`
- **Language**: TypeScript/Node.js
- **Purpose**: Implement a priority-based notification filtering system
- **Key Features**:
  - Min-Heap algorithm for efficient top-10 maintenance
  - Composite scoring based on notification type and recency
  - Comprehensive logging middleware
  - API integration with notification service

**Read**: [Notification_System_Design.md](Notification_System_Design.md)

### Stage 2: React/Next.js Frontend
- **Location**: `/stage2/`
- **Technology Stack**: React 18, Next.js 14, Material UI
- **Purpose**: Build a responsive web application for viewing notifications
- **Key Features**:
  - All Notifications page with filtering
  - Priority Inbox page showing top-N notifications
  - Read/unread status tracking
  - Mobile-responsive design
  - Real-time notification refresh

**Read**: [stage2/README.md](stage2/README.md)

## Quick Start

### Stage 1: Run the Priority System

```bash
cd stage1
npm install
npm run dev
```

### Stage 2: Run the React/Next.js Application

```bash
cd stage2
npm install
npm run dev
```

Navigate to http://localhost:3000

## Architecture

```
┌─────────────────────────────────────────┐
│     Notification API                     │
│  (4.224.186.213/evaluation-service)     │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│     Stage 1: Priority System             │
│  - Fetch notifications from API          │
│  - Calculate priority scores             │
│  - Maintain top-10 efficiently           │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│     Stage 2: React/Next.js Frontend     │
│  - Display all notifications             │
│  - Show priority inbox                   │
│  - Track read/unread status             │
│  - Responsive UI with Material UI        │
└─────────────────────────────────────────┘
```

## Key Algorithms

### Priority Scoring Algorithm

```
Total Score = Type Weight + Recency Score

Type Weights:
- Placement: 3.0 (Career opportunity)
- Result: 2.0 (Academic)
- Event: 1.0 (Informational)

Recency Score = e^(-0.005 × hours_ago)
```

### Min-Heap for Top-K Maintenance

The system uses a min-heap data structure to efficiently maintain the top-10 notifications:
- **Time Complexity**: O(log 10) ≈ O(1) per update
- **Space Complexity**: O(10) constant
- **Benefit**: Scales to millions of notifications

## Development Progress

### Completed Tasks

✅ Stage 1: Priority Inbox System
- Logging middleware implementation
- Notification service with API integration
- Min-Heap based priority management
- Comprehensive design documentation

✅ Stage 2: React/Next.js Frontend
- Next.js project setup
- Material UI integration
- All Notifications page
- Priority Inbox page
- Responsive components
- Local storage for view tracking

### Quality Assurance

- ✅ TypeScript strict mode enabled
- ✅ Material UI styling throughout
- ✅ Mobile-responsive design
- ✅ Comprehensive error handling
- ✅ Logging at every step
- ✅ Clean code architecture

## File Structure

```
affordmed/
├── stage1/
│   ├── logger.ts                 # Logging middleware
│   ├── notification-service.ts   # Main service with min-heap
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/                     # Compiled output
├── stage2/
│   ├── pages/
│   │   ├── _app.tsx             # App wrapper
│   │   ├── _document.tsx        # HTML document
│   │   ├── index.tsx            # All notifications page
│   │   └── priority.tsx         # Priority inbox page
│   ├── components/
│   │   ├── NotificationCard.tsx    # Notification display
│   │   ├── NotificationFilter.tsx  # Filter controls
│   │   ├── NavigationBar.tsx       # Top navigation
│   │   └── Layout.tsx              # Main layout
│   ├── lib/
│   │   ├── api.ts               # API utilities
│   │   └── storage.ts           # Local storage
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── .env.local
│   └── README.md
├── Notification_System_Design.md  # Stage 1 documentation
├── .gitignore
└── README.md                      # This file
```

## Testing

### Stage 1 Testing

Run the priority system:
```bash
cd stage1
npm run dev
```

Expected output: Top 10 notifications sorted by priority score

### Stage 2 Testing

Run the React application:
```bash
cd stage2
npm run dev
```

**Test Cases**:
1. Open http://localhost:3000 - View all notifications
2. Click on Priority Inbox - View top-10 notifications
3. Filter by type - Select Placement/Result/Event
4. Change top-N - Select 5, 10, 15, 20, 50
5. Mark as read - Click checkmark icon
6. Refresh - Click refresh button
7. Mobile view - Resize browser to test responsiveness

## API Documentation

### Notification Endpoint

```
GET http://4.224.186.213/evaluation-service/notifications
```

**Query Parameters:**
- `limit` (optional): Number of notifications (default: 20)
- `page` (optional): Page number for pagination
- `notification_type` (optional): Filter by type (Placement, Result, Event)

**Response (200):**
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

## Logging

All operations are logged using the custom Logging Middleware:

```
[2026-05-18T10:30:45.123Z] [INFO] [Module] Message
  {
    "key": "value"
  }
```

**Log Levels:**
- DEBUG: Detailed debugging information
- INFO: Informational messages
- WARN: Warning messages
- ERROR: Error messages

## Performance Metrics

- **Notification Fetch**: Network dependent (typical: 100-500ms)
- **Priority Calculation**: Linear O(n) with API response size
- **Top-10 Retrieval**: O(10 log 10) ≈ O(1)
- **Rendering**: Optimized with React hooks

## Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Constraints & Assumptions

- ✅ No user authentication required
- ✅ No database implementation (API-based data)
- ✅ No UI development in Stage 1
- ✅ Material UI for styling
- ✅ Comprehensive logging throughout
- ✅ Git commits at frequent intervals

## Contact & Support

**Organization**: Afford Medical Technologies Private Limited  
**Location**: Hyderabad/Secunderabad  
**Jurisdiction**: Courts of Hyderabad/Secunderabad

---

**Confidentiality Notice**: This document and the associated code contain confidential and proprietary information. Unauthorized use or disclosure is strictly prohibited and may result in legal action.

**Evaluation Date**: May 18, 2026  
**Time Limit**: 3 Hours
