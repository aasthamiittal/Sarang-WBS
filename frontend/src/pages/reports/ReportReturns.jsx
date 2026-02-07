import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import { Alert } from '@mui/material';

export default function ReportReturns() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/reports/returns-rto-report')
      .then((r) => { if (r.data.success) setData(r.data.data.map((x) => ({ ...x, id: x._id }))); })
      .catch((e) => setError(e.response?.data?.message || 'Failed'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { id: 'returnNo', label: 'Return No' },
    { id: 'order', label: 'Order', render: (_, r) => r.order?.orderNo || '-' },
    { id: 'status', label: 'Status' },
    { id: 'rtoTracking', label: 'RTO' },
    { id: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  ];

  return (
    <>
      <PageHeader title="Returns & RTO Report" />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No data" />
    </>
  );
}
