import React, { useState, useEffect } from 'react';
import { Grid, MenuItem, TextField, Alert } from '@mui/material';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';

export default function ReturnsList() {
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ returnNo: 'RET-' + Date.now(), order: '', items: [{ product: '', quantity: 1, reason: '' }], notes: '' });
  const [products, setProducts] = useState([]);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/returns/get-returns');
      if (res.success) setData(res.data.map((r) => ({ ...r, id: r._id })));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);
  useEffect(() => {
    api.get('/orders/get-orders', { params: { limit: 200 } }).then((r) => r.data.success && setOrders(r.data.data));
    api.get('/products/get-products', { params: { limit: 500 } }).then((r) => r.data.success && setProducts(r.data.data));
  }, []);

  const handleSubmit = async () => {
    try {
      await api.post('/returns/add-return', {
        returnNo: formData.returnNo,
        order: formData.order || undefined,
        notes: formData.notes,
        items: formData.items.filter((i) => i.product && i.quantity).map((i) => ({ product: i.product, quantity: Number(i.quantity), reason: i.reason })),
      });
      setModalOpen(false);
      setFormData({ returnNo: 'RET-' + Date.now(), order: '', items: [{ product: '', quantity: 1, reason: '' }], notes: '' });
      fetch();
    } catch (e) {
      throw e;
    }
  };

  const addItem = () => setFormData({ ...formData, items: [...formData.items, { product: '', quantity: 1, reason: '' }] });
  const updateItem = (idx, field, value) => {
    const items = [...formData.items];
    items[idx] = { ...items[idx], [field]: value };
    setFormData({ ...formData, items });
  };

  const columns = [
    { id: 'returnNo', label: 'Return No' },
    { id: 'order', label: 'Order', render: (_, r) => r.order?.orderNo || '-' },
    { id: 'status', label: 'Status' },
    { id: 'rtoTracking', label: 'RTO Tracking' },
    { id: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  ];

  return (
    <>
      <PageHeader title="Customer Returns" actionLabel="Add Return" onAction={() => { setModalOpen(true); }} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No returns" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Return" onSubmit={handleSubmit} maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Return No" value={formData.returnNo} onChange={(e) => setFormData({ ...formData, returnNo: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Order" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              {orders.map((o) => <MenuItem key={o._id} value={o._id}>{o.orderNo}</MenuItem>)}
            </TextField>
          </Grid>
          {formData.items.map((item, idx) => (
            <React.Fragment key={idx}>
              <Grid item xs={12} sm={5}>
                <TextField select fullWidth size="small" label="Product" value={item.product} onChange={(e) => updateItem(idx, 'product', e.target.value)}>
                  <MenuItem value="">Select</MenuItem>
                  {products.map((p) => <MenuItem key={p._id} value={p._id}>{p.sku} - {p.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6} sm={2}><TextField fullWidth size="small" type="number" label="Qty" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} /></Grid>
              <Grid item xs={6} sm={4}><TextField fullWidth size="small" label="Reason" value={item.reason} onChange={(e) => updateItem(idx, 'reason', e.target.value)} /></Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}><Button size="small" startIcon={<AddIcon />} onClick={addItem}>Add item</Button></Grid>
          <Grid item xs={12}><TextField fullWidth label="Notes" multiline value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></Grid>
        </Grid>
      </FormModal>
    </>
  );
}
