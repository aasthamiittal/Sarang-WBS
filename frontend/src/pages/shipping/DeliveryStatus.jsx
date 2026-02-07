import React, { useState, useEffect } from 'react';
import { MenuItem, TextField, Alert } from '@mui/material';
import api from '../../api/axios';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';

export default function DeliveryStatus() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('pending');

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/get-orders', { params: { status: 'dispatched', limit: 100 } });
      if (data.success) setOrders(data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async () => {
    try {
      await api.put('/shipping/update-delivery-status', { orderId, deliveryStatus: status });
      setModalOpen(false);
      setOrderId('');
      fetch();
    } catch (e) {
      throw e;
    }
  };

  return (
    <>
      <PageHeader title="Delivery Status" actionLabel="Update Status" onAction={() => { setOrderId(''); setStatus('pending'); setModalOpen(true); }} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Update Delivery Status" onSubmit={handleSubmit}>
        <TextField select fullWidth label="Order" value={orderId} onChange={(e) => setOrderId(e.target.value)} required sx={{ mb: 2 }}>
          <MenuItem value="">Select Order</MenuItem>
          {orders.map((o) => <MenuItem key={o._id} value={o._id}>{o.orderNo}</MenuItem>)}
        </TextField>
        <TextField select fullWidth label="Delivery Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="picked">Picked</MenuItem>
          <MenuItem value="in_transit">In Transit</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
        </TextField>
      </FormModal>
    </>
  );
}
