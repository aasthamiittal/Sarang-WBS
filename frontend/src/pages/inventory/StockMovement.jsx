import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';

export default function StockMovement() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit: rowsPerPage };
      if (type) params.type = type;
      const { data: res } = await api.get('/inventory/get-stock-movement', { params });
      if (res.success) {
        setData(res.data.map((r) => ({ ...r, id: r._id })));
        setTotal(res.total);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [page, rowsPerPage, type]);

  const columns = [
    { id: 'product', label: 'Product', render: (_, r) => r.product?.sku || '-' },
    { id: 'warehouse', label: 'Warehouse', render: (_, r) => r.warehouse?.name || '-' },
    { id: 'type', label: 'Type' },
    { id: 'quantity', label: 'Quantity', align: 'right' },
    { id: 'referenceNo', label: 'Reference' },
    { id: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  ];

  return (
    <>
      <PageHeader title="Stock Movement" />
      <Box sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={(e) => { setType(e.target.value); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="inward">Inward</MenuItem>
            <MenuItem value="outward">Outward</MenuItem>
            <MenuItem value="adjustment">Adjustment</MenuItem>
            <MenuItem value="transfer">Transfer</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DataTable columns={columns} rows={data} total={total} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={(v) => { setRowsPerPage(v); setPage(0); }} loading={loading} emptyMessage="No movements" />
    </>
  );
}
