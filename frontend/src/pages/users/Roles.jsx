import React, { useState, useEffect } from 'react';
import { Grid, TextField, IconButton, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function Roles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/roles/get-roles');
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
    setFormData({ name: '', description: '' });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setFormData({ name: row.name, description: row.description || '' });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selected) await api.put(`/roles/update-role/${selected._id}`, formData);
      else await api.post('/roles/add-role', formData);
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
      await api.delete(`/roles/delete-role/${selected._id}`);
      fetch();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'description', label: 'Description' },
    { id: 'actions', label: 'Actions', render: (_, row) => (<><IconButton size="small" onClick={() => handleEdit(row)}><EditIcon /></IconButton><IconButton size="small" color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton></>) },
  ];

  return (
    <>
      <PageHeader title="Roles & Permissions" actionLabel="Add Role" onAction={handleAdd} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No roles" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Role' : 'Add Role'} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Description" multiline value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></Grid>
        </Grid>
      </FormModal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Role" message="Delete this role?" onConfirm={handleConfirmDelete} confirmLabel="Delete" danger />
    </>
  );
}
