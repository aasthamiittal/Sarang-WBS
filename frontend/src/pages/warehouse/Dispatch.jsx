import React, { useState, useEffect } from 'react';
import { MenuItem, TextField, Alert } from '@mui/material';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';

export default function Dispatch() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [orderId, setOrderId] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/get-orders', { params: { status: 'packing', limit: 100 } });
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
      await api.post('/warehouses/add-dispatch', { orderId });
      setModalOpen(false);
      setOrderId('');
      fetch();
    } catch (e) {
      throw e;
    }
  };

  const columns = [
    { id: 'orderNo', label: 'Order No' },
    { id: 'customerName', label: 'Customer' },
    { id: 'status', label: 'Status' },
    { id: 'warehouse', label: 'Warehouse', render: (_, r) => r.warehouse?.name || '-' },
  ];

  return (
    <>
      <PageHeader title="Dispatch" actionLabel="Dispatch Order" onAction={() => { setOrderId(''); setModalOpen(true); }} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={orders.map((o) => ({ ...o, id: o._id }))} loading={loading} emptyMessage="No orders ready for dispatch" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Dispatch Order" onSubmit={handleSubmit}>
        <TextField select fullWidth label="Order" value={orderId} onChange={(e) => setOrderId(e.target.value)} required>
          <MenuItem value="">Select Order</MenuItem>
          {orders.map((o) => <MenuItem key={o._id} value={o._id}>{o.orderNo} - {o.customerName}</MenuItem>)}
        </TextField>
      </FormModal>
    </>
  );
}
