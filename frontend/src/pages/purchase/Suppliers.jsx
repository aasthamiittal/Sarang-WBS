import React, { useState, useEffect } from 'react';
import { Grid, TextField, IconButton, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function Suppliers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', contactPerson: '', email: '', phone: '', address: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/suppliers/get-suppliers');
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
    setFormData({ code: '', name: '', contactPerson: '', email: '', phone: '', address: '' });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setFormData({ code: row.code, name: row.name, contactPerson: row.contactPerson || '', email: row.email || '', phone: row.phone || '', address: row.address || '' });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selected) await api.put(`/suppliers/update-supplier/${selected._id}`, formData);
      else await api.post('/suppliers/add-supplier', formData);
      setModalOpen(false);
      fetch();
    } catch (e) {
      throw e;
    }
  };

  const handleDelete = (row) => { setSelected(row); setConfirmOpen(true); };
  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      await api.delete(`/suppliers/delete-supplier/${selected._id}`);
      fetch();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { id: 'code', label: 'Code' },
    { id: 'name', label: 'Name' },
    { id: 'contactPerson', label: 'Contact' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'actions', label: 'Actions', render: (_, row) => (<><IconButton size="small" onClick={() => handleEdit(row)}><EditIcon /></IconButton><IconButton size="small" color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton></>) },
  ];

  return (
    <>
      <PageHeader title="Suppliers" actionLabel="Add Supplier" onAction={handleAdd} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No suppliers" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Supplier' : 'Add Supplier'} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Contact Person" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Address" multiline value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></Grid>
        </Grid>
      </FormModal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Supplier" message="Delete this supplier?" onConfirm={handleConfirmDelete} confirmLabel="Delete" danger />
    </>
  );
}
