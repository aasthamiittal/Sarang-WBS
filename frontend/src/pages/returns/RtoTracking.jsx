import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import { Alert } from '@mui/material';

export default function RtoTracking() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/returns/get-rto-orders')
      .then((r) => { if (r.data.success) setData(r.data.data.map((x) => ({ ...x, id: x._id }))); })
      .catch((e) => setError(e.response?.data?.message || 'Failed'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { id: 'returnNo', label: 'Return No' },
    { id: 'rtoTracking', label: 'RTO Tracking' },
    { id: 'status', label: 'Status' },
    { id: 'order', label: 'Order', render: (_, r) => r.order?.orderNo || '-' },
    { id: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  ];

  return (
    <>
      <PageHeader title="RTO Tracking" />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No RTO orders" />
    </>
  );
}
