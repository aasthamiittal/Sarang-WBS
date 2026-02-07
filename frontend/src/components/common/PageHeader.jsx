import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function PageHeader({ title, actionLabel, onAction }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Typography variant="h5" fontWeight={600}>
        {title}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
