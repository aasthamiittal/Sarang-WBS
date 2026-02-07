import React, { useState, useEffect } from 'react';
import { Grid, MenuItem, TextField, Alert } from '@mui/material';
import api from '../../api/axios';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';

export default function StockAdjustment() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ product: '', warehouse: '', quantity: '', reason: '' });

  useEffect(() => {
    Promise.all([
      api.get('/products/get-products', { params: { limit: 500 } }),
      api.get('/warehouses/get-warehouses'),
    ]).then(([p, w]) => {
      if (p.data.success) setProducts(p.data.data);
      if (w.data.success) setWarehouses(w.data.data);
    });
  }, []);

  const handleSubmit = async () => {
    try {
      await api.post('/inventory/add-stock-adjustment', {
        product: formData.product,
        warehouse: formData.warehouse,
        quantity: Number(formData.quantity),
        reason: formData.reason || 'Manual adjustment',
      });
      setModalOpen(false);
      setFormData({ product: '', warehouse: '', quantity: '', reason: '' });
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <PageHeader title="Stock Adjustment" actionLabel="Add Adjustment" onAction={() => { setModalOpen(true); setFormData({ product: '', warehouse: '', quantity: '', reason: '' }); }} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Stock Adjustment" onSubmit={handleSubmit}>
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
            <TextField fullWidth type="number" label="Quantity (+ or -)" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required helperText="Negative for decrease" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
          </Grid>
        </Grid>
      </FormModal>
    </>
  );
}
