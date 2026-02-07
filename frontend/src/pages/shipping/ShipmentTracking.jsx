import React, { useState } from 'react';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import api from '../../api/axios';
import PageHeader from '../../components/common/PageHeader';

export default function ShipmentTracking() {
  const [trackingNo, setTrackingNo] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!trackingNo.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const { data: res } = await api.get('/shipping/track-shipment', { params: { trackingNo: trackingNo.trim() } });
      if (res.success) setData(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Shipment not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Shipment Tracking" />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField size="small" label="Tracking Number" value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} placeholder="Enter tracking no" sx={{ minWidth: 280 }} />
        <Button variant="contained" onClick={handleSearch} disabled={loading}>{loading ? 'Searching...' : 'Track'}</Button>
      </Box>
      {data && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="subtitle1"><strong>Order:</strong> {data.order?.orderNo}</Typography>
          <Typography variant="body2"><strong>Courier:</strong> {data.courier}</Typography>
          <Typography variant="body2"><strong>Tracking:</strong> {data.trackingNo}</Typography>
          <Typography variant="body2"><strong>Status:</strong> {data.deliveryStatus}</Typography>
        </Box>
      )}
    </>
  );
}
