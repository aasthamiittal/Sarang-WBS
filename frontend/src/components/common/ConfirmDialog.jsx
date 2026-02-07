import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

export default function ConfirmDialog({
  open,
  onClose,
  title = 'Confirm',
  message = 'Are you sure?',
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  danger = false,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={() => {
            onConfirm?.();
            onClose();
          }}
          color={danger ? 'error' : 'primary'}
          variant="contained"
          disabled={loading}
        >
          {loading ? '...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
