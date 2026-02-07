import React, { useState, useEffect } from 'react';
import { Grid, TextField, IconButton, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function WarehouseList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', address: '', city: '', state: '', pincode: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/warehouses/get-warehouses');
      if (res.success) setData(res.data.map((r) => ({ ...r, id: r._id })));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = () => {
    setSelected(null);
    setFormData({ code: '', name: '', address: '', city: '', state: '', pincode: '' });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setFormData({ code: row.code, name: row.name, address: row.address || '', city: row.city || '', state: row.state || '', pincode: row.pincode || '' });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selected) {
        await api.put(`/warehouses/update-warehouse/${selected._id}`, formData);
      } else {
        await api.post('/warehouses/add-warehouse', formData);
      }
      setModalOpen(false);
      fetch();
    } catch (e) {
      throw e;
    }
  };

  const handleDelete = (row) => {
    setSelected(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      await api.delete(`/warehouses/delete-warehouse/${selected._id}`);
      fetch();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { id: 'code', label: 'Code' },
    { id: 'name', label: 'Name' },
    { id: 'address', label: 'Address' },
    { id: 'city', label: 'City' },
    { id: 'state', label: 'State' },
    { id: 'actions', label: 'Actions', render: (_, row) => (<><IconButton size="small" onClick={() => handleEdit(row)}><EditIcon /></IconButton><IconButton size="small" color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton></>) },
  ];

  return (
    <>
      <PageHeader title="Warehouses" actionLabel="Add Warehouse" onAction={handleAdd} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No warehouses" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Warehouse' : 'Add Warehouse'} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} /></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} /></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth label="Pincode" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} /></Grid>
        </Grid>
      </FormModal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Warehouse" message="Delete this warehouse?" onConfirm={handleConfirmDelete} confirmLabel="Delete" danger />
    </>
  );
}
