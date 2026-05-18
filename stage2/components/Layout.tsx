import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import NavigationBar from './NavigationBar';

interface LayoutProps {
  children: ReactNode;
  unreadCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, unreadCount = 0 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#fafafa',
      }}
    >
      <NavigationBar unreadCount={unreadCount} />
      <Box sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
      <Box
        component="footer"
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          py: 3,
          textAlign: 'center',
          marginTop: 'auto',
        }}
      >
        <p>© 2026 Afford Medical Technologies. All rights reserved.</p>
        <p style={{ fontSize: '12px', opacity: 0.8 }}>
          This is a confidential evaluation document.
        </p>
      </Box>
    </Box>
  );
};

export default Layout;
