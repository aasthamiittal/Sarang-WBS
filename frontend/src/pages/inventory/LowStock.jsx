import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import { Alert } from '@mui/material';

export default function LowStock() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/inventory/get-low-stock')
      .then((r) => {
        if (r.data.success) setData(r.data.data.map((x) => ({ ...x, id: x._id || x.product?._id })));
      })
      .catch((e) => setError(e.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { id: 'product', label: 'SKU', render: (_, r) => r.product?.sku || '-' },
    { id: 'product', label: 'Product', render: (_, r) => r.product?.name || '-' },
    { id: 'warehouse', label: 'Warehouse', render: (_, r) => r.warehouse?.name || '-' },
    { id: 'quantity', label: 'Current Qty', align: 'right' },
    { id: 'product', label: 'Reorder Level', render: (_, r) => r.product?.reorderLevel ?? 0, align: 'right' },
  ];

  return (
    <>
      <PageHeader title="Low Stock Alerts" />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No low stock items" />
    </>
  );
}
