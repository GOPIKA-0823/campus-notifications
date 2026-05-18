import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import Layout from '../components/Layout';
import NotificationCard from '../components/NotificationCard';
import NotificationFilter from '../components/NotificationFilter';
import {
  fetchNotifications,
  Notification,
  getTopNotifications,
  calculatePriorityScore,
} from '../lib/api';
import { getViewedNotifications } from '../lib/storage';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export default function PriorityPage() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [priorityNotifications, setPriorityNotifications] = useState<Notification[]>([]);
  const [filteredPriority, setFilteredPriority] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [topN, setTopN] = useState(10);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch and process notifications
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNotifications(100); // Fetch more to get better priority selection
        setAllNotifications(data);

        // Get top N by priority
        const topNotif = getTopNotifications(data, topN);
        setPriorityNotifications(topNotif);
        filterNotifications(topNotif, selectedType);
        updateUnreadCount(topNotif);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch notifications'
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Re-filter when topN changes
  useEffect(() => {
    if (allNotifications.length > 0) {
      const topNotif = getTopNotifications(allNotifications, topN);
      setPriorityNotifications(topNotif);
      filterNotifications(topNotif, selectedType);
      updateUnreadCount(topNotif);
    }
  }, [topN]);

  // Filter notifications
  const filterNotifications = (data: Notification[], type: string) => {
    if (type === 'all') {
      setFilteredPriority(data);
    } else {
      setFilteredPriority(data.filter((n) => n.Type === type));
    }
  };

  // Update unread count
  const updateUnreadCount = (data: Notification[]) => {
    const viewed = getViewedNotifications();
    const unread = data.filter((n) => !viewed.has(n.ID)).length;
    setUnreadCount(unread);
  };

  // Handle type change
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    filterNotifications(priorityNotifications, type);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(100);
      setAllNotifications(data);

      const topNotif = getTopNotifications(data, topN);
      setPriorityNotifications(topNotif);
      filterNotifications(topNotif, selectedType);
      updateUnreadCount(topNotif);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch notifications'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle viewed notification
  const handleMarkAsViewed = (id: string) => {
    updateUnreadCount(priorityNotifications);
  };

  return (
    <Layout unreadCount={unreadCount}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <LocalFireDepartmentIcon
              sx={{ fontSize: 40, color: '#FF6B6B' }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              🔥 Priority Inbox
            </Typography>
          </Box>
          <Typography variant="body1" color="textSecondary">
            {filteredPriority.length} important notification
            {filteredPriority.length !== 1 ? 's' : ''} (sorted by type weight & recency)
          </Typography>
        </Box>

        {/* Priority Score Info Card */}
        <Card sx={{ mb: 3, backgroundColor: '#E3F2FD' }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              How Priority is Calculated:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Score = Type Weight + Recency Score</strong>
              <br />
              • Placement: 3.0 | Result: 2.0 | Event: 1.0
              <br />
              • Recency decreases by 0.5% per hour
            </Typography>
          </CardContent>
        </Card>

        {/* Filter */}
        <NotificationFilter
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          topN={topN}
          onTopNChange={setTopN}
          onRefresh={handleRefresh}
          isLoading={loading}
        />

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
              <Typography sx={{ mt: 2, color: '#999' }}>
                Loading priority notifications...
              </Typography>
            </Box>
          </Box>
        ) : filteredPriority.length === 0 ? (
          <Alert severity="info">
            No priority notifications match your filters.
          </Alert>
        ) : (
          <Grid container spacing={0}>
            {filteredPriority.map((notification, index) => (
              <Grid item xs={12} key={notification.ID}>
                <Box sx={{ position: 'relative' }}>
                  {/* Priority Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 16,
                      backgroundColor: '#FF6B6B',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '0 8px 8px 0',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      zIndex: 1,
                    }}
                  >
                    #{index + 1}
                  </Box>
                  <NotificationCard
                    notification={notification}
                    isPriority={true}
                    onMarkAsViewed={handleMarkAsViewed}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
}
