import React from 'react';
import { Box, Pagination as MuiPagination, Typography } from '@mui/material';

export default function Pagination({ page, totalPages, total, onPageChange, rowsPerPage }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mt: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Total: {total} | Page {page} of {totalPages}
      </Typography>
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(e, p) => onPageChange(p)}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
