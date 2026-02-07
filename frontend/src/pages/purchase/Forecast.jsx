import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import { Alert } from '@mui/material';

export default function Forecast() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/purchases/get-forecast')
      .then((r) => { if (r.data.success) setData(r.data.data.map((x, i) => ({ ...x, id: x.product?._id || i }))); })
      .catch((e) => setError(e.response?.data?.message || 'Failed'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { id: 'product', label: 'SKU', render: (_, r) => r.product?.sku || '-' },
    { id: 'product', label: 'Product', render: (_, r) => r.product?.name || '-' },
    { id: 'product', label: 'Reorder Level', render: (_, r) => r.product?.reorderLevel ?? 0, align: 'right' },
    { id: 'suggestedOrder', label: 'Suggested Order', align: 'right' },
  ];

  return (
    <>
      <PageHeader title="Forecasted Demand" />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No forecast data" />
    </>
  );
}
