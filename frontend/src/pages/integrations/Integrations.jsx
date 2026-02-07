import React, { useState, useEffect } from 'react';
import { Grid, TextField, MenuItem, IconButton, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function Integrations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'api', isActive: true });

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/integrations/get-integrations');
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
    setFormData({ name: '', type: 'api', isActive: true });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setFormData({ name: row.name, type: row.type || 'api', isActive: row.isActive !== false });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selected) await api.put(`/integrations/update-integration/${selected._id}`, formData);
      else await api.post('/integrations/add-integration', formData);
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
      await api.delete(`/integrations/delete-integration/${selected._id}`);
      fetch();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'type', label: 'Type' },
    { id: 'isActive', label: 'Active', render: (v) => (v !== false ? 'Yes' : 'No') },
    { id: 'actions', label: 'Actions', render: (_, row) => (<><IconButton size="small" onClick={() => handleEdit(row)}><EditIcon /></IconButton><IconButton size="small" color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton></>) },
  ];

  return (
    <>
      <PageHeader title="Integrations" actionLabel="Add Integration" onAction={handleAdd} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No integrations" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Integration' : 'Add Integration'} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
          <Grid item xs={12}>
            <TextField select fullWidth label="Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <MenuItem value="amazon">Amazon</MenuItem>
              <MenuItem value="ecommerce">Ecommerce</MenuItem>
              <MenuItem value="courier">Courier</MenuItem>
              <MenuItem value="api">API / Webhooks</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FormModal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Integration" message="Delete this integration?" onConfirm={handleConfirmDelete} confirmLabel="Delete" danger />
    </>
  );
}
