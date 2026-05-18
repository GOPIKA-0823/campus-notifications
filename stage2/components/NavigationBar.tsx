import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Badge,
} from '@mui/material';
import Link from 'next/link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useRouter } from 'next/router';

interface NavigationBarProps {
  unreadCount?: number;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ unreadCount = 0 }) => {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const isPriority = router.pathname === '/priority';

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#1976d2',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '16px 0',
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotificationsIcon sx={{ fontSize: 32, color: 'white' }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '0.5px',
              }}
            >
              Campus Notifications
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Link href="/" passHref legacyBehavior>
              <Button
                color="inherit"
                sx={{
                  fontSize: '16px',
                  borderBottom: isHome ? '2px solid white' : 'none',
                  borderRadius: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  px: 2,
                  py: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon />
                  All Notifications
                </Box>
              </Button>
            </Link>

            <Link href="/priority" passHref legacyBehavior>
              <Button
                color="inherit"
                sx={{
                  fontSize: '16px',
                  borderBottom: isPriority ? '2px solid white' : 'none',
                  borderRadius: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  px: 2,
                  py: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Badge badgeContent={Math.min(unreadCount, 9)} color="error">
                    <PriorityHighIcon />
                  </Badge>
                  Priority Inbox
                </Box>
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
