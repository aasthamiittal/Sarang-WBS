import React, { useState, useEffect } from 'react';
import { Grid, MenuItem, TextField, Alert } from '@mui/material';
import api from '../../api/axios';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';

export default function StockTransfer() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ product: '', fromWarehouse: '', toWarehouse: '', quantity: '' });

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
      await api.post('/warehouses/transfer-stock', {
        product: formData.product,
        fromWarehouse: formData.fromWarehouse,
        toWarehouse: formData.toWarehouse,
        quantity: Number(formData.quantity),
      });
      setModalOpen(false);
      setFormData({ product: '', fromWarehouse: '', toWarehouse: '', quantity: '' });
    } catch (e) {
      throw e;
    }
  };

  return (
    <>
      <PageHeader title="Stock Transfer" actionLabel="Transfer Stock" onAction={() => { setModalOpen(true); setFormData({ product: '', fromWarehouse: '', toWarehouse: '', quantity: '' }); }} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Stock Transfer" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField select fullWidth label="Product" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} required>
              <MenuItem value="">Select Product</MenuItem>
              {products.map((p) => <MenuItem key={p._id} value={p._id}>{p.sku} - {p.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField select fullWidth label="From Warehouse" value={formData.fromWarehouse} onChange={(e) => setFormData({ ...formData, fromWarehouse: e.target.value })} required>
              <MenuItem value="">Select</MenuItem>
              {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField select fullWidth label="To Warehouse" value={formData.toWarehouse} onChange={(e) => setFormData({ ...formData, toWarehouse: e.target.value })} required>
              <MenuItem value="">Select</MenuItem>
              {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="number" label="Quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
          </Grid>
        </Grid>
      </FormModal>
    </>
  );
}
