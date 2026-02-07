import React, { useState, useEffect } from 'react';
import { Grid, MenuItem, TextField, Button, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';

export default function PurchaseOrders() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ poNumber: 'PO-' + Date.now(), supplier: '', warehouse: '', items: [{ product: '', quantity: 1, unitPrice: '' }], totalAmount: '', notes: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/purchases/get-purchase-orders', { params: { page: page + 1, limit: rowsPerPage } });
      if (res.success) {
        setData(res.data.map((r) => ({ ...r, id: r._id })));
        setTotal(res.total);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, rowsPerPage]);
  useEffect(() => {
    api.get('/suppliers/get-suppliers').then((r) => r.data.success && setSuppliers(r.data.data));
    api.get('/warehouses/get-warehouses').then((r) => r.data.success && setWarehouses(r.data.data));
    api.get('/products/get-products', { params: { limit: 500 } }).then((r) => r.data.success && setProducts(r.data.data));
  }, []);

  const handleSubmit = async () => {
    try {
      await api.post('/purchases/add-purchase-order', {
        poNumber: formData.poNumber,
        supplier: formData.supplier,
        warehouse: formData.warehouse || undefined,
        totalAmount: formData.totalAmount ? Number(formData.totalAmount) : undefined,
        notes: formData.notes,
        items: formData.items.filter((i) => i.product && i.quantity).map((i) => ({ product: i.product, quantity: Number(i.quantity), unitPrice: i.unitPrice ? Number(i.unitPrice) : undefined })),
      });
      setModalOpen(false);
      setFormData({ poNumber: 'PO-' + Date.now(), supplier: '', warehouse: '', items: [{ product: '', quantity: 1, unitPrice: '' }], totalAmount: '', notes: '' });
      fetch();
    } catch (e) {
      throw e;
    }
  };

  const addItem = () => setFormData({ ...formData, items: [...formData.items, { product: '', quantity: 1, unitPrice: '' }] });
  const removeItem = (idx) => {
    if (formData.items.length <= 1) return;
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== idx) });
  };
  const updateItem = (idx, field, value) => {
    const items = [...formData.items];
    items[idx] = { ...items[idx], [field]: value };
    setFormData({ ...formData, items });
  };

  const columns = [
    { id: 'poNumber', label: 'PO Number' },
    { id: 'supplier', label: 'Supplier', render: (_, r) => r.supplier?.name || '-' },
    { id: 'warehouse', label: 'Warehouse', render: (_, r) => r.warehouse?.name || '-' },
    { id: 'status', label: 'Status' },
    { id: 'totalAmount', label: 'Amount', align: 'right', render: (v) => (v != null ? Number(v).toFixed(2) : '-') },
    { id: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  ];

  return (
    <>
      <PageHeader title="Purchase Orders" actionLabel="Add PO" onAction={() => setModalOpen(true)} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} total={total} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={(v) => { setRowsPerPage(v); setPage(0); }} loading={loading} emptyMessage="No purchase orders" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Purchase Order" onSubmit={handleSubmit} maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="PO Number" value={formData.poNumber} onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Supplier" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} required>
              <MenuItem value="">Select</MenuItem>
              {suppliers.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField select fullWidth label="Warehouse" value={formData.warehouse} onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
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
              <Grid item xs={4} sm={2}><TextField fullWidth size="small" type="number" label="Qty" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} /></Grid>
              <Grid item xs={4} sm={2}><TextField fullWidth size="small" type="number" label="Unit Price" value={item.unitPrice} onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)} /></Grid>
              <Grid item xs={4} sm={1}><Button size="small" onClick={() => removeItem(idx)}><RemoveIcon /></Button></Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}><Button size="small" startIcon={<AddIcon />} onClick={addItem}>Add item</Button></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Total Amount" value={formData.totalAmount} onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Notes" multiline value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></Grid>
        </Grid>
      </FormModal>
    </>
  );
}
