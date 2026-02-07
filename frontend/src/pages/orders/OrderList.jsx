import React, { useState, useEffect } from 'react';
import { MenuItem, TextField, IconButton, Box, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';
import { OrderForm } from './OrderForm';

export default function OrderList() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ orderNo: '', customerName: '', customerEmail: '', items: [{ product: '', quantity: 1 }], warehouse: '', totalAmount: '', notes: '' });
  const [newStatus, setNewStatus] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit: rowsPerPage };
      if (status) params.status = status;
      const { data: res } = await api.get('/orders/get-orders', { params });
      if (res.success) {
        setData(res.data.map((r) => ({ ...r, id: r._id })));
        setTotal(res.total);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [page, rowsPerPage, status]);

  useEffect(() => {
    api.get('/warehouses/get-warehouses').then((r) => r.data.success && setWarehouses(r.data.data));
    api.get('/products/get-products', { params: { limit: 500 } }).then((r) => r.data.success && setProducts(r.data.data));
  }, []);

  const handleAdd = () => {
    setSelected(null);
    setFormData({ orderNo: 'ORD-' + Date.now(), customerName: '', customerEmail: '', items: [{ product: '', quantity: 1 }], warehouse: '', totalAmount: '', notes: '' });
    setModalOpen(true);
  };

  const handleUpdateStatus = (row) => {
    setSelected(row);
    setNewStatus(row.status);
    setStatusModalOpen(true);
  };

  const handleStatusSubmit = async () => {
    if (!selected) return;
    try {
      await api.put(`/orders/update-order-status/${selected._id}`, { status: newStatus });
      setStatusModalOpen(false);
      fetch();
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed');
    }
  };

  const handleOrderSubmit = async () => {
    try {
      const payload = {
        orderNo: formData.orderNo,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        warehouse: formData.warehouse || undefined,
        totalAmount: formData.totalAmount ? Number(formData.totalAmount) : undefined,
        notes: formData.notes,
        items: formData.items.filter((i) => i.product && i.quantity).map((i) => ({ product: i.product, quantity: Number(i.quantity), price: i.price ? Number(i.price) : undefined })),
      };
      await api.post('/orders/add-order', payload);
      setModalOpen(false);
      fetch();
    } catch (e) {
      throw e;
    }
  };

  const columns = [
    { id: 'orderNo', label: 'Order No' },
    { id: 'customerName', label: 'Customer' },
    { id: 'status', label: 'Status' },
    { id: 'warehouse', label: 'Warehouse', render: (_, r) => r.warehouse?.name || '-' },
    { id: 'totalAmount', label: 'Amount', align: 'right', render: (v) => (v != null ? Number(v).toFixed(2) : '-') },
    { id: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '-' },
    {
      id: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <IconButton size="small" onClick={() => handleUpdateStatus(row)}><EditIcon /></IconButton>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="All Orders" actionLabel="Add Order" onAction={handleAdd} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        <TextField select size="small" label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} sx={{ minWidth: 160 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="picking">Picking</MenuItem>
          <MenuItem value="packing">Packing</MenuItem>
          <MenuItem value="dispatched">Dispatched</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
          <MenuItem value="backorder">Backorder</MenuItem>
        </TextField>
      </Box>
      <DataTable columns={columns} rows={data} total={total} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={(v) => { setRowsPerPage(v); setPage(0); }} loading={loading} emptyMessage="No orders" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Order" onSubmit={handleOrderSubmit} maxWidth="md">
        <OrderForm formData={formData} setFormData={setFormData} products={products} warehouses={warehouses} />
      </FormModal>
      <FormModal open={statusModalOpen} onClose={() => setStatusModalOpen(false)} title="Update Order Status" onSubmit={handleStatusSubmit}>
        <TextField select fullWidth label="Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="picking">Picking</MenuItem>
          <MenuItem value="packing">Packing</MenuItem>
          <MenuItem value="dispatched">Dispatched</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
          <MenuItem value="backorder">Backorder</MenuItem>
        </TextField>
      </FormModal>
    </>
  );
}
