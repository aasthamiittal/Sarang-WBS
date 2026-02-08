import React, { useState, useEffect } from 'react';
import { Grid, TextField, MenuItem, IconButton, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';

export default function UserManagement() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission('users', 'write');
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', isActive: true });

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/users/get-users');
      if (res.success) setData(res.data.map((r) => ({ ...r, id: r._id })));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);
  useEffect(() => { api.get('/roles/get-roles').then((r) => r.data.success && setRoles(r.data.data)); }, []);

  const handleAdd = () => {
    setSelected(null);
    setFormData({ name: '', email: '', password: '', role: '', isActive: true });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setFormData({ name: row.name, email: row.email, password: '', role: row.role?._id || '', isActive: row.isActive !== false });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData, role: formData.role || undefined };
      if (!payload.password) delete payload.password;
      if (selected) await api.put(`/users/update-user/${selected._id}`, payload);
      else {
        if (!payload.password) throw new Error('Password required for new user');
        await api.post('/users/add-user', payload);
      }
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
      await api.delete(`/users/delete-user/${selected._id}`);
      fetch();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role', render: (_, r) => r.role?.name || '-' },
    { id: 'isActive', label: 'Active', render: (v) => (v !== false ? 'Yes' : 'No') },
    ...(canWrite ? [{ id: 'actions', label: 'Actions', render: (_, row) => (<><IconButton size="small" onClick={() => handleEdit(row)}><EditIcon /></IconButton><IconButton size="small" color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton></>) }] : []),
  ];

  return (
    <>
      <PageHeader title="User Management" actionLabel={canWrite ? 'Add User' : undefined} onAction={canWrite ? handleAdd : undefined} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No users" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit User' : 'Add User'} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={!!selected} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={selected ? 'Leave blank to keep' : ''} /></Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              {roles.map((r) => <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField select fullWidth label="Active" value={formData.isActive ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FormModal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete User" message="Delete this user?" onConfirm={handleConfirmDelete} confirmLabel="Delete" danger />
    </>
  );
}
