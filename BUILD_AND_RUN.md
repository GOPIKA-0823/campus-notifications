# Build and Run Instructions

## Quick Start

Follow these steps to build and run the Campus Notifications Platform:

### Stage 1: Priority Notification System

```bash
# Navigate to stage1 directory
cd stage1

# Install dependencies
npm install

# Run the development server (requires API access)
npm run dev

# Or build and run production version
npm run build
npm start
```

**Expected Output**:
```
[2026-05-18T10:30:45.123Z] [INFO] [NotificationService] Fetched 10 notifications
=== Campus Notifications Priority Inbox ===
=== TOP 10 PRIORITY NOTIFICATIONS ===

#1. [Placement] CSX Corporation hiring (Score: 3.9999)
     ID: b283218f-ea5a-4b7c-93a9-1f2f240d64b0
     Timestamp: 2026-04-22 17:51:18

#2. [Result] mid-sem (Score: 2.9998)
     ...
```

### Stage 2: React/Next.js Frontend

```bash
# Navigate to stage2 directory
cd stage2

# Install dependencies (required: Node.js 18+)
npm install

# Run the development server (will start on http://localhost:3000)
npm run dev
```

**Application URL**: http://localhost:3000

**Pages**:
- Home Page (All Notifications): http://localhost:3000/
- Priority Inbox: http://localhost:3000/priority

## System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **RAM**: Minimum 2GB
- **Network**: Internet access for API calls

## Environment Configuration

### Stage 2 (.env.local)
```
NEXT_PUBLIC_API_URL=http://4.224.186.213/evaluation-service
NEXT_PUBLIC_API_KEY=evaluation-key-2026
```

These are pre-configured. Modify if needed to point to a different API.

## Troubleshooting

### Problem: Port 3000 already in use
```bash
# Option 1: Use a different port
npm run dev -- -p 3001

# Option 2: Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### Problem: npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: API connection errors
- Verify the API URL in `.env.local`
- Check network connectivity
- Ensure the API server is running
- Check browser console for detailed errors

### Problem: Material UI styles not loading
```bash
# Reinstall Material UI dependencies
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## Verification Checklist

### Stage 1 Verification
- [ ] Code compiles without errors
- [ ] Logging middleware is functional
- [ ] Min-Heap algorithm correctly sorts notifications
- [ ] Priority scoring is calculated accurately
- [ ] Top-10 notifications are displayed
- [ ] Extensive logging is present

### Stage 2 Verification
- [ ] Application starts on http://localhost:3000
- [ ] All Notifications page displays all notifications
- [ ] Priority Inbox shows top-10 notifications
- [ ] Type filtering works (Placement, Result, Event)
- [ ] Top-N selector works (5, 10, 15, 20, 50)
- [ ] Read/Unread status tracking works
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] Material UI styling is applied

## Performance Testing

### Stage 1
```bash
# Time the notification processing
time npm run dev
```

Expected: Completes within 1-2 seconds

### Stage 2
```bash
# Check build size
npm run build

# Start production server
npm start

# Measure First Contentful Paint (FCP) in browser DevTools
```

## Development Features

### Hot Reload
Both applications support hot reload:
- **Stage 1**: Changes to `.ts` files trigger recompilation
- **Stage 2**: Changes to any file trigger browser refresh

### Source Maps
TypeScript source maps are generated for debugging:
- Stage 1: `dist/*.js.map`
- Stage 2: `.next/` directory

### Logging
All operations are logged:
- **Debug Level**: Detailed operation tracking
- **Info Level**: Important operations
- **Warn Level**: Potential issues
- **Error Level**: Actual errors

Set log level in code or via environment variable.

## Deployment

### Stage 1 (Node.js Application)
```bash
# Build
npm run build

# Run production version
npm start
```

### Stage 2 (Next.js Application)
```bash
# Build
npm run build

# Start production server
npm start

# Or deploy to Vercel
npm install -g vercel
vercel deploy
```

## Git Workflow

```bash
# Initialize repository (if not done)
git init

# Add all files
git add .

# First commit - Project setup
git commit -m "feat: Initialize Campus Notifications project with Stage 1 and Stage 2"

# Stage 1 commits
git add stage1/
git commit -m "feat: Implement priority notification system with min-heap algorithm"
git commit -m "docs: Add comprehensive system design documentation"

# Stage 2 commits
git add stage2/
git commit -m "feat: Create React/Next.js frontend with all notifications and priority inbox"
git commit -m "feat: Add responsive Material UI components and styling"

# View commit history
git log --oneline
```

## Database Setup (Optional for future)

Currently, the application uses the provided API. To add database persistence in future:

```bash
# Install database driver (example: PostgreSQL)
npm install pg

# Create database schema
psql -U user -d database < schema.sql

# Run migrations
npm run migrate
```

## API Documentation

### Endpoints Used

```
GET http://4.224.186.213/evaluation-service/notifications
```

Query parameters:
- `limit`: Number of notifications
- `page`: Page number
- `notification_type`: Filter by type

Response format:
```json
{
  "notifications": [
    {
      "ID": "string",
      "Type": "Placement|Result|Event",
      "Message": "string",
      "Timestamp": "ISO8601 string"
    }
  ]
}
```

## Monitoring and Logs

### Log Files
- **Stage 1**: Logs output to console
- **Stage 2**: Logs appear in browser console and Next.js terminal

### Debug Mode
```bash
# Stage 1: Enable debug logging
DEBUG=* npm run dev

# Stage 2: Enable Next.js debug
DEBUG=next:* npm run dev
```

## Common Commands

| Command | Stage | Description |
|---------|-------|-------------|
| `npm install` | Both | Install dependencies |
| `npm run dev` | Both | Start development server |
| `npm run build` | Both | Build for production |
| `npm start` | Both | Start production server |
| `npm run lint` | Stage 2 | Run ESLint |
| `npm test` | Both | Run tests (if configured) |

## Support

For issues or questions:
1. Check this document
2. Review application logs
3. Verify API connectivity
4. Check browser DevTools console
5. Review source code comments

## Next Steps

After running the application:

1. **Test All Notifications Page**
   - Verify all notifications load
   - Test filtering by type
   - Check responsive design

2. **Test Priority Inbox**
   - Verify top-10 notifications display
   - Check scoring is correct
   - Test top-N selector

3. **Test Features**
   - Mark notifications as read
   - Add to favorites
   - Refresh notifications
   - Mobile responsiveness

4. **Record Screenshots/Video**
   - Desktop view
   - Mobile view
   - Various interactions

5. **Commit Changes**
   - Push to GitHub
   - Include screenshots
   - Document any modifications

---

**Time Limit**: 3 Hours
**Evaluation**: Both code and functionality will be evaluated
**Submission**: Push all changes to GitHub repository
