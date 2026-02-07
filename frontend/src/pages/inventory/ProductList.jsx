import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, IconButton, Box, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ProductForm } from './ProductForm';

export default function ProductList() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ sku: '', name: '', description: '', category: '', unit: 'pcs', reorderLevel: 0, costPrice: '', sellingPrice: '' });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/products/get-products', {
        params: { page: page + 1, limit: rowsPerPage, search: search || undefined },
      });
      if (res.success) {
        setData(res.data.map((r) => ({ ...r, id: r._id })));
        setTotal(res.total);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdd = () => {
    setSelected(null);
    setFormData({ sku: '', name: '', description: '', category: '', unit: 'pcs', reorderLevel: 0, costPrice: '', sellingPrice: '' });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setFormData({
      sku: row.sku,
      name: row.name,
      description: row.description || '',
      category: row.category || '',
      unit: row.unit || 'pcs',
      reorderLevel: row.reorderLevel ?? 0,
      costPrice: row.costPrice ?? '',
      sellingPrice: row.sellingPrice ?? '',
    });
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    setSelected(row);
    setConfirmOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        reorderLevel: Number(formData.reorderLevel) || 0,
        costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
        sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice) : undefined,
      };
      if (selected) {
        await api.put(`/products/update-product/${selected._id}`, payload);
      } else {
        await api.post('/products/add-product', payload);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      await api.delete(`/products/delete-product/${selected._id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { id: 'sku', label: 'SKU' },
    { id: 'name', label: 'Name' },
    { id: 'category', label: 'Category' },
    { id: 'unit', label: 'Unit' },
    { id: 'reorderLevel', label: 'Reorder Level', align: 'right' },
    { id: 'costPrice', label: 'Cost', align: 'right', render: (v) => (v != null ? Number(v).toFixed(2) : '-') },
    { id: 'sellingPrice', label: 'Selling', align: 'right', render: (v) => (v != null ? Number(v).toFixed(2) : '-') },
    {
      id: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Box>
          <IconButton size="small" onClick={() => handleEdit(row)}><EditIcon /></IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Product / SKU Master" actionLabel="Add Product" onAction={handleAdd} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search SKU or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 220 }}
        />
        <Button variant="outlined" onClick={fetchProducts}>Search</Button>
      </Box>
      <DataTable
        columns={columns}
        rows={data}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(v) => { setRowsPerPage(v); setPage(0); }}
        loading={loading}
        emptyMessage="No products"
      />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Product' : 'Add Product'} onSubmit={handleSubmit}>
        <ProductForm formData={formData} setFormData={setFormData} />
      </FormModal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Product" message="Delete this product?" onConfirm={handleConfirmDelete} confirmLabel="Delete" danger />
    </>
  );
}
