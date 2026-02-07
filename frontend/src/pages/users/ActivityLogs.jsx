import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import { Alert } from '@mui/material';

export default function ActivityLogs() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/activity-logs/get-activity-logs', { params: { page: page + 1, limit: rowsPerPage } })
      .then((r) => {
        if (r.data.success) {
          setData(r.data.data.map((x) => ({ ...x, id: x._id })));
          setTotal(r.data.total || r.data.data.length);
        }
      })
      .catch((e) => setError(e.response?.data?.message || 'Failed'))
      .finally(() => setLoading(false));
  }, [page, rowsPerPage]);

  const columns = [
    { id: 'user', label: 'User', render: (_, r) => r.user?.name || r.user?.email || '-' },
    { id: 'action', label: 'Action' },
    { id: 'module', label: 'Module' },
    { id: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  ];

  return (
    <>
      <PageHeader title="Activity Logs" />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} total={total} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={(v) => { setRowsPerPage(v); setPage(0); }} loading={loading} emptyMessage="No logs" />
    </>
  );
}
