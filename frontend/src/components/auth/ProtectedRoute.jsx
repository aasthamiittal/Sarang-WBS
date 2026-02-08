import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Button } from '@mui/material';
import MainLayout from '../layout/MainLayout';

/**
 * Protects content by permission and/or admin role.
 * adminOnly: only Admin role can access (roles, permissions, user management).
 */
export default function ProtectedRoute({ children, module, action, adminOnly = false, fallbackToHome = false }) {
  const { isAuthenticated, hasPermission, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <MainLayout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Access denied. Admin only.
          </Typography>
          <Button href="/" variant="contained" sx={{ mt: 2 }}>
            Go to Dashboard
          </Button>
        </Box>
      </MainLayout>
    );
  }

  if (module != null && action != null && !hasPermission(module, action)) {
    if (fallbackToHome) {
      return <Navigate to="/" replace />;
    }
    return (
      <MainLayout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Access denied. You do not have permission to view this page.
          </Typography>
          <Button href="/" variant="contained" sx={{ mt: 2 }}>
            Go to Dashboard
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
