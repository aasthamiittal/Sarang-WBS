import React, { useState, useEffect } from 'react';
import { MenuItem, Grid, Alert, TextField } from '@mui/material';
import api from '../../api/axios';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';
import DataTable from '../../components/common/DataTable';

export default function StockInward() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ product: '', warehouse: '', quantity: '', referenceNo: '', reason: '' });

  const loadOptions = async () => {
    try {
      const [p, w] = await Promise.all([
        api.get('/products/get-products', { params: { limit: 500 } }),
        api.get('/warehouses/get-warehouses'),
      ]);
      if (p.data.success) setProducts(p.data.data);
      if (w.data.success) setWarehouses(w.data.data);
    } catch (e) {
      setError('Failed to load options');
    }
  };

  const loadMovement = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/inventory/get-stock-movement', { params: { type: 'inward', limit: 50 } });
      if (data.success) setMovements(data.data.map((r) => ({ ...r, id: r._id })));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
    loadMovement();
  }, []);

  const handleSubmit = async () => {
    try {
      await api.post('/inventory/add-stock-inward', {
        product: formData.product,
        warehouse: formData.warehouse,
        quantity: Number(formData.quantity),
        referenceNo: formData.referenceNo || undefined,
        reason: formData.reason || undefined,
      });
      setModalOpen(false);
      setFormData({ product: '', warehouse: '', quantity: '', referenceNo: '', reason: '' });
      loadMovement();
    } catch (err) {
      throw err;
    }
  };

  const columns = [
    { id: 'product', label: 'Product', render: (_, r) => r.product?.sku || r.product?.name || '-' },
    { id: 'warehouse', label: 'Warehouse', render: (_, r) => r.warehouse?.name || '-' },
    { id: 'quantity', label: 'Quantity', align: 'right' },
    { id: 'referenceNo', label: 'Reference' },
    { id: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  ];

  return (
    <>
      <PageHeader title="Stock Purchase (Inward)" actionLabel="Add Stock Inward" onAction={() => { setModalOpen(true); setFormData({ product: '', warehouse: '', quantity: '', referenceNo: '', reason: '' }); }} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={movements} loading={loading} emptyMessage="No inward movements" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Stock Inward" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField select fullWidth label="Product" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} required>
              <MenuItem value="">Select Product</MenuItem>
              {products.map((p) => <MenuItem key={p._id} value={p._id}>{p.sku} - {p.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField select fullWidth label="Warehouse" value={formData.warehouse} onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })} required>
              <MenuItem value="">Select Warehouse</MenuItem>
              {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.code} - {w.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="number" label="Quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Reference No" value={formData.referenceNo} onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
          </Grid>
        </Grid>
      </FormModal>
    </>
  );
}
