# Campus Notifications - Frontend

## Overview

This is the React/Next.js frontend for the Campus Notifications platform. It displays all notifications and provides a priority inbox that shows the most important unread notifications first.

## Features

- **All Notifications Page**: View all notifications with filtering by type
- **Priority Inbox Page**: View the top-N most important notifications
- **Notification Filtering**: Filter by Placement, Result, or Event
- **View Tracking**: Track which notifications you've read
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Updates**: Refresh notifications with a single click
- **Material UI Styling**: Professional and clean user interface

## Getting Started

### Prerequisites

- Node.js 18.0+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Build

```bash
npm run build
npm start
```

## Project Structure

```
stage2/
├── pages/
│   ├── _app.tsx          # App wrapper with Material UI theme
│   ├── _document.tsx     # HTML document setup
│   ├── index.tsx         # All notifications page
│   └── priority.tsx      # Priority inbox page
├── components/
│   ├── NotificationCard.tsx    # Notification display component
│   ├── NotificationFilter.tsx  # Filter controls
│   ├── NavigationBar.tsx       # Top navigation
│   └── Layout.tsx              # Main layout wrapper
├── lib/
│   ├── api.ts           # API utilities and scoring logic
│   └── storage.ts       # Local storage for viewed notifications
├── styles/              # Custom CSS (optional)
├── public/              # Static assets
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── next.config.js       # Next.js configuration
└── .env.local          # Environment variables
```

## API Integration

The application integrates with the Notification API:

```
GET http://4.224.186.213/evaluation-service/notifications
```

**Query Parameters:**
- `limit`: Number of notifications to fetch
- `page`: Page number for pagination
- `notification_type`: Filter by type (Placement, Result, Event)

## Priority Calculation

Notifications are prioritized using a scoring algorithm:

```
Score = Type Weight + Recency Score

Type Weights:
- Placement: 3.0
- Result: 2.0
- Event: 1.0

Recency Score = e^(-0.005 × hours_ago)
```

## Components

### NotificationCard
Displays a single notification with:
- Type badge with color coding
- Message content
- Timestamp with relative time (e.g., "2m ago")
- Read/unread status
- Favorite button
- Notification ID

### NotificationFilter
Provides filtering controls:
- Filter by notification type
- Select top-N notifications (5, 10, 15, 20, 50)
- Refresh button
- Last update timestamp

### NavigationBar
Top navigation bar with:
- Branding
- Links to All Notifications and Priority Inbox
- Unread notification badge

### Layout
Main layout component with:
- Navigation bar
- Content area
- Footer

## Mobile Responsiveness

The application is fully responsive:
- **Mobile (xs)**: Single column layout, stacked controls
- **Tablet (sm)**: Two column layout, horizontal controls
- **Desktop (md+)**: Full responsive layout with proper spacing

## State Management

The application uses React hooks for state management:
- `useState`: Manage notifications, filters, loading state
- `useEffect`: Fetch data on mount
- Local Storage: Persist viewed notification IDs

## Styling with Material UI

The application uses Material UI for styling:
- Custom theme with primary color (#1976d2)
- Consistent typography
- Responsive grid system
- Proper color palette for notification types

## Environment Variables

Configure in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://4.224.186.213/evaluation-service
NEXT_PUBLIC_API_KEY=evaluation-key-2026
```

## Performance Optimization

- Lazy loading of components
- Efficient re-renders with proper state management
- Image optimization with Next.js
- CSS-in-JS with Material UI for smaller bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

1. **Server-side Rendering**: Use Next.js SSR for better performance
2. **Data Caching**: Implement SWR for automatic data fetching
3. **Push Notifications**: Add browser push notifications
4. **Dark Mode**: Add dark theme support
5. **Notification Sound**: Add audio alerts for priority notifications
6. **User Preferences**: Save user filter preferences
7. **Search**: Add notification search functionality
8. **Analytics**: Track user interactions

## Troubleshooting

### Notifications not loading
- Check API_URL in `.env.local`
- Verify API key is correct
- Check browser console for errors

### Styling issues
- Ensure Material UI fonts are loaded
- Check for CSS conflicts
- Clear browser cache

### Mobile view not working
- Ensure viewport meta tag is set
- Check responsive breakpoints
- Test with browser DevTools

## Contact

For issues or questions, contact the development team at Afford Medical Technologies.
