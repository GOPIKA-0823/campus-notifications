import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Notification } from '../lib/api';
import { formatTimestamp, getTypeColor } from '../lib/api';
import { isNotificationViewed, setNotificationAsViewed } from '../lib/storage';

interface NotificationCardProps {
  notification: Notification;
  isPriority?: boolean;
  onMarkAsViewed?: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isPriority = false,
  onMarkAsViewed,
}) => {
  const [isViewed, setIsViewed] = React.useState(isNotificationViewed(notification.ID));
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleMarkViewed = () => {
    setNotificationAsViewed(notification.ID);
    setIsViewed(true);
    onMarkAsViewed?.(notification.ID);
  };

  const typeColor = getTypeColor(notification.Type);

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: `5px solid ${typeColor}`,
        backgroundColor: isViewed ? '#f5f5f5' : '#ffffff',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: isViewed ? 400 : 600,
                flex: 1,
                color: isViewed ? '#999' : '#333',
              }}
            >
              {notification.Message}
            </Typography>
            {isPriority && (
              <Chip
                label="🔥 Priority"
                size="small"
                sx={{
                  backgroundColor: '#FF6B6B',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            )}
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Chip
              label={notification.Type}
              size="small"
              sx={{
                backgroundColor: typeColor,
                color: 'white',
              }}
            />
            <Typography variant="caption" sx={{ color: '#999' }}>
              {formatTimestamp(notification.Timestamp)}
            </Typography>
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={isViewed ? 'Mark as unread' : 'Mark as read'}>
              <IconButton
                size="small"
                onClick={handleMarkViewed}
                sx={{
                  color: isViewed ? '#4CAF50' : '#999',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton
                size="small"
                onClick={() => setIsFavorite(!isFavorite)}
                sx={{
                  color: isFavorite ? '#FF9800' : '#999',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                {isFavorite ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          ID: <code>{notification.ID}</code>
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {notification.Timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
