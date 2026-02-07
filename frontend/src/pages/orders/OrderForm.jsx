import React from 'react';
import { Grid, TextField, MenuItem, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export function OrderForm({ formData, setFormData, products, warehouses }) {
  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { product: '', quantity: 1 }] });
  };
  const removeItem = (idx) => {
    if (formData.items.length <= 1) return;
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== idx) });
  };
  const updateItem = (idx, field, value) => {
    const items = [...formData.items];
    items[idx] = { ...items[idx], [field]: value };
    setFormData({ ...formData, items });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Order No" value={formData.orderNo} onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })} required />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Customer Name" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Customer Email" type="email" value={formData.customerEmail} onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField select fullWidth label="Warehouse" value={formData.warehouse} onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}>
          <MenuItem value="">None</MenuItem>
          {(warehouses || []).map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <strong>Items</strong>
        {formData.items.map((item, idx) => (
          <Grid container spacing={1} key={idx} alignItems="center" sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={5}>
              <TextField select fullWidth size="small" label="Product" value={item.product} onChange={(e) => updateItem(idx, 'product', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {(products || []).map((p) => <MenuItem key={p._id} value={p._id}>{p.sku} - {p.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField fullWidth size="small" type="number" label="Qty" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} />
            </Grid>
            <Grid item xs={4} sm={2}>
              <IconButton size="small" onClick={() => removeItem(idx)}><RemoveIcon /></IconButton>
            </Grid>
          </Grid>
        ))}
        <Button size="small" startIcon={<AddIcon />} onClick={addItem}>Add item</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth type="number" label="Total Amount" value={formData.totalAmount} onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Notes" multiline rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
      </Grid>
    </Grid>
  );
}
