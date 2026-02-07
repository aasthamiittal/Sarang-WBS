import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Alert } from '@mui/material';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';

export default function CurrentStock() {
  const [data, setData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouse, setWarehouse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/inventory/get-current-stock', { params: warehouse ? { warehouse } : {} });
      if (res.success) setData(res.data.map((r) => ({ ...r, id: r._id })));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/warehouses/get-warehouses').then((r) => r.data.success && setWarehouses(r.data.data));
  }, []);

  useEffect(() => {
    fetch();
  }, [warehouse]);

  const columns = [
    { id: 'product', label: 'SKU', render: (_, r) => r.product?.sku || '-' },
    { id: 'product', label: 'Product', render: (_, r) => r.product?.name || '-' },
    { id: 'warehouse', label: 'Warehouse', render: (_, r) => r.warehouse?.name || '-' },
    { id: 'quantity', label: 'Quantity', align: 'right' },
    { id: 'reservedQuantity', label: 'Reserved', align: 'right' },
  ];

  return (
    <>
      <PageHeader title="Current Stock" />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <FormControl size="small" sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel>Warehouse</InputLabel>
        <Select value={warehouse} label="Warehouse" onChange={(e) => setWarehouse(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
        </Select>
      </FormControl>
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No stock" />
    </>
  );
}
