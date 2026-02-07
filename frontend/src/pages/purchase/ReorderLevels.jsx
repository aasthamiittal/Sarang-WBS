import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import { Alert } from '@mui/material';

export default function ReorderLevels() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/purchases/get-reorder-levels')
      .then((r) => { if (r.data.success) setData(r.data.data.map((x) => ({ ...x, id: x._id }))); })
      .catch((e) => setError(e.response?.data?.message || 'Failed'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { id: 'sku', label: 'SKU' },
    { id: 'name', label: 'Name' },
    { id: 'reorderLevel', label: 'Reorder Level', align: 'right' },
  ];

  return (
    <>
      <PageHeader title="Reorder Levels" />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No products" />
    </>
  );
}
