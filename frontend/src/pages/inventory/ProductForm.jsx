import React from 'react';
import { TextField, Grid } from '@mui/material';

export function ProductForm({ formData, setFormData }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="SKU" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Description" multiline rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField fullWidth type="number" label="Reorder Level" value={formData.reorderLevel} onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField fullWidth type="number" label="Cost Price" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField fullWidth type="number" label="Selling Price" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} />
      </Grid>
    </Grid>
  );
}
