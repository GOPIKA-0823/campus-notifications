import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import Layout from '../components/Layout';
import NotificationCard from '../components/NotificationCard';
import NotificationFilter from '../components/NotificationFilter';
import { fetchNotifications, Notification } from '../lib/api';
import { getViewedNotifications } from '../lib/storage';

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [limit, setLimit] = useState(20);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNotifications(limit);
        setNotifications(data);
        filterNotifications(data, selectedType);
        updateUnreadCount(data);
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

  // Filter notifications
  const filterNotifications = (data: Notification[], type: string) => {
    if (type === 'all') {
      setFilteredNotifications(data);
    } else {
      setFilteredNotifications(data.filter((n) => n.Type === type));
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
    filterNotifications(notifications, type);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(limit);
      setNotifications(data);
      filterNotifications(data, selectedType);
      updateUnreadCount(data);
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
    updateUnreadCount(notifications);
  };

  return (
    <Layout unreadCount={unreadCount}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#333',
              mb: 1,
            }}
          >
            📬 All Notifications
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Showing all {filteredNotifications.length} notification
            {filteredNotifications.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* Filter */}
        <NotificationFilter
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          topN={limit}
          onTopNChange={setLimit}
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
                Loading notifications...
              </Typography>
            </Box>
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Alert severity="info">
            No notifications found. Check back later!
          </Alert>
        ) : (
          <Grid container spacing={0}>
            {filteredNotifications.map((notification) => (
              <Grid item xs={12} key={notification.ID}>
                <NotificationCard
                  notification={notification}
                  onMarkAsViewed={handleMarkAsViewed}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
}
